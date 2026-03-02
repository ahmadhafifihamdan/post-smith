What’s done so far

    The Login System: Users can sign up and log in securely so their posts stay private.

    The "Brain" (Tone Profile): A settings page where you can tell the AI exactly how to behave—like how long the post should be or what words it’s forbidden from using. Currently linked to only Gemini Flash 3 Preview.

    The Generator: A dashboard where you type an idea and hit "Generate." Instead of making you sit there and wait for the AI to think, the app saves the job to a database and sends you to a status page.

    The Auto-Refresh Page: A page that watches the database for you. It keeps checking "Is it done yet?" every few seconds and automatically shows the result the moment the AI finishes.

    Safety First: Fixed some tricky security settings (Helmet) that were blocking our "auto-refresh" code from working.

What I learned

    Connecting the Dots: How to make a frontend (EJS), a backend (Node/Express), and a database (MySQL) all talk to each other without breaking.

    Handling "Slow" Tasks: Learning that you shouldn't make a user wait on a loading screen for AI; it's better to let it run in the background.

    Solving Browser Issues: Figuring out why the browser sometimes blocks your own code for security reasons and how to fix it properly.

    Data Structure: How to save a post’s "rules" (like character limits) so the AI can read them later.

Features I want to add

    CSV Uploads: Let users upload a file of their old successful posts. The app will read them and automatically figure out their "Tone Profile" so they don't have to set it up manually.

    Multi-Platform: One click to turn one idea into a short tweet, a professional LinkedIn post, and a flashy Instagram caption.

    History Log: A simple list on the dashboard of every post ever generated so nothing gets lost.

    LLM Agnostic: Add more LLM to the mix to test out posts to pick and choose from.
