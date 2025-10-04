require("dotenv").config();
const asana = require("asana");

// Authenticate with your token
const client = asana.Client.create().useAccessToken(process.env.ASANA_TOKEN);

// Replace with your real project ID
const PROJECT_ID = "1211435655536820";

async function addCommentsWithTaskIds() {
  try {
    // 1. Get all tasks in the project
    const tasks = await client.tasks.findByProject(PROJECT_ID, { opt_fields: "gid,name" });

    for (const task of tasks.data) {
      const taskId = task.gid;
      const taskName = task.name;

      console.log(`🔹 Found Task: ${taskName} (${taskId})`);

      // 2. Add a comment with Task ID
      await client.tasks.addComment(taskId, {
        text: `Auto-Comment Task ID is: ${taskId}`
      });

      console.log(`✅ Comment added to Task "${taskName}" (${taskId})`);

      // 3. Fetch subtasks for this task
      const subtasks = await client.tasks.subtasks(taskId, { opt_fields: "gid,name" });

      for (const subtask of subtasks.data) {
        const subtaskId = subtask.gid;
        const subtaskName = subtask.name;

        console.log(`   ↳ Found Subtask: ${subtaskName} (${subtaskId})`);

        // 4. Add a comment with Subtask ID
        await client.tasks.addComment(subtaskId, {
          text: `Auto-Comment Subtask ID is: ${subtaskId}`
        });

        console.log(`   ✅ Comment added to Subtask "${subtaskName}" (${subtaskId})`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.value ? error.value : error);
  }
}

addCommentsWithTaskIds();
