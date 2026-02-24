import pool from './db';

const initDb = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('⏳ Initializing Database...');

        // 1. Create Users Table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`
        );

        // 2. Create Tone Profiles Table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS tone_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            config_json JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )`
        );

      console.log('✅ Database Tables Verified/Created.');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
    } finally {
      connection.release();
    }
};

export default initDb;