import { GoogleGenAI } from "@google/genai";
import pool from '../config/db';
import { runGuardrails } from '../utils/guardrails.utils';

// The new client automatically looks for process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const startWorker = () => {
  console.log('🤖 Background Worker Started: Polling every 10s...');

  setInterval(async () => {
    try {
      await processNextJob();
    } catch (err) {
      console.error('Worker Interval Error:', err);
    }
  }, 10000); 
};

const processNextJob = async () => {
  const connection = await pool.getConnection();
  let currentJobId: number | null = null;

  try {
    const [rows]: any = await connection.execute(`
      SELECT r.id, r.idea_prompt, r.user_id, t.config_json 
      FROM generation_runs r
      JOIN tone_profiles t ON r.user_id = t.user_id
      WHERE r.status = "pending" 
      ORDER BY r.created_at ASC LIMIT 1
    `);

    if (rows.length === 0) return;

    const { id, idea_prompt, config_json } = rows[0];
    currentJobId = id;

    await connection.execute('UPDATE generation_runs SET status = "processing" WHERE id = ?', [currentJobId]);

    // logging LLM REQUEST TIMESTAMP
    const requestTimestamp = new Date().toISOString();
    console.log(`[LLM REQUEST] Run ID: ${currentJobId} | Timestamp: ${requestTimestamp}`);

    // Call LLM
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Updated to the free tier model Gemini 3 Flash Preview
      contents: `Write a social media post: "${idea_prompt}". Constraints: ${JSON.stringify(config_json)}`,
    });

    const responseText = response.text;

    if (responseText) {
      // Logging LLM SUCCESS CALL
      console.log(`[LLM SUCCESS] Run ID: ${currentJobId} | Received ${responseText.length} chars`);
    } else {
      throw new Error('LLM returned an empty response or was blocked by safety filters.');
    }

    // introduce guard rails
    const validation = runGuardrails(responseText, config_json);
    if (!validation.isValid) {
      console.log(`Fail to generate content. Reason: ${validation.reason}`);
    }

    // update generated_posts table with fail reason if fail the guard rails
    await connection.execute(
      'INSERT INTO generated_posts (generation_run_id, content, status, rejection_reason) VALUES (?, ?, ?, ?)',
      [currentJobId, responseText, validation.isValid ? 'accepted' : 'rejected', validation.reason || null]
    );

    await connection.execute('UPDATE generation_runs SET status = "completed" WHERE id = ?', [currentJobId]);
    console.log(`Post Smith generated content for Job ${currentJobId}`);

  } catch (error: any) {
    console.error('❌ Worker LLM Error:', error);
    console.error(`[LLM FAILURE] Run ID: ${currentJobId} | Error: ${error.message}`);
    if (currentJobId) {
      await pool.execute(
        'UPDATE generation_runs SET status = "failed", error_message = ? WHERE id = ?',
        [error.message, currentJobId]
      );
    }
  } finally {
    connection.release();
  }
};