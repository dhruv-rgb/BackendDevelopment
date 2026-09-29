// Automated Verification Test Suite for Eisenhower Todo Application
// Backend Development Lab Examination (Exam 01 B)
const http = require("http");

async function runTests() {
  console.log("=============================================================");
  console.log("  Running Automated Tests: Eisenhower Todo Application");
  console.log("=============================================================\n");

  process.env.PORT = 3005;
  process.env.MONGO_URI = "mongodb://127.0.0.1:27017";
  process.env.DB_NAME = "todo_lab";

  const app = require("./server");

  // Allow server initialization
  await new Promise(resolve => setTimeout(resolve, 2500));

  const baseURL = "http://localhost:3005";

  async function makeRequest(path, options = {}) {
    const res = await fetch(`${baseURL}${path}`, {
      redirect: "manual",
      ...options
    });
    const text = await res.text();
    return { status: res.status, headers: res.headers, body: text };
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
      throw new Error(`Test assertion failed: ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: GET / redirects to /tasks
    // -------------------------------------------------------------
    const res1 = await makeRequest("/");
    assert(
      res1.status === 302 && (res1.headers.get("location") === "/tasks" || res1.headers.get("location") === "/tasks/"),
      "GET / redirects to /tasks"
    );

    // -------------------------------------------------------------
    // Test 2: GET /tasks displays 4-Quadrant Eisenhower Matrix
    // -------------------------------------------------------------
    const res2 = await makeRequest("/tasks");
    assert(res2.status === 200, "GET /tasks returns HTTP 200");
    assert(res2.body.includes("Eisenhower"), "Home page displays 'Eisenhower' branding");
    assert(res2.body.includes("DO (Urgent & Important)"), "Quadrant 1 (DO) rendered");
    assert(res2.body.includes("SCHEDULE (Not Urgent & Important)"), "Quadrant 2 (SCHEDULE) rendered");
    assert(res2.body.includes("DELEGATE (Urgent & Not Important)"), "Quadrant 3 (DELEGATE) rendered");
    assert(res2.body.includes("ELIMINATE (Not Urgent & Not Important)"), "Quadrant 4 (ELIMINATE) rendered");

    // -------------------------------------------------------------
    // Test 3: GET /tasks/new renders Add Task Form
    // -------------------------------------------------------------
    const res3 = await makeRequest("/tasks/new");
    assert(res3.status === 200, "GET /tasks/new returns HTTP 200");
    assert(res3.body.includes("Create New Task"), "Displays 'Create New Task' form header");
    assert(res3.body.includes('name="title"'), "Contains 'title' input field");
    assert(res3.body.includes('name="description"'), "Contains 'description' input field");
    assert(res3.body.includes('name="isUrgent"'), "Contains 'isUrgent' checkbox");
    assert(res3.body.includes('name="isImportant"'), "Contains 'isImportant' checkbox");

    // -------------------------------------------------------------
    // Test 4: Compulsory Validation - Empty Title rejected
    // -------------------------------------------------------------
    const res4 = await makeRequest("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: "   ",
        description: "Empty title check",
        isUrgent: "on",
        isImportant: "on"
      }).toString()
    });
    assert(res4.status === 400, "POST /tasks with empty title returns HTTP 400");
    assert(res4.body.includes("required and cannot be empty"), "Validation error message returned for empty title");

    // -------------------------------------------------------------
    // Test 5: Add Task to Quadrant 1 (Urgent & Important)
    // -------------------------------------------------------------
    const uniqueQ1 = `Automated Q1 Task ${Date.now()}`;
    const res5 = await makeRequest("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: uniqueQ1,
        description: "High urgency and high importance task description",
        isUrgent: "on",
        isImportant: "on",
        category: "Academic",
        dueDate: "2026-09-30"
      }).toString()
    });
    assert(res5.status === 302, "POST /tasks with valid data redirects (302)");

    // Verify task is in Quadrant 1
    const res5Check = await makeRequest("/tasks");
    assert(res5Check.body.includes(uniqueQ1), "Newly added Q1 task is present on page");

    // -------------------------------------------------------------
    // Test 6: Add Task to Quadrant 2 (Not Urgent & Important)
    // -------------------------------------------------------------
    const uniqueQ2 = `Automated Q2 Task ${Date.now()}`;
    const res6 = await makeRequest("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: uniqueQ2,
        description: "Low urgency and high importance task description",
        isUrgent: "", // unchecked
        isImportant: "on",
        category: "Work",
        dueDate: "2026-10-10"
      }).toString()
    });
    assert(res6.status === 302, "POST /tasks for Q2 redirects (302)");

    // -------------------------------------------------------------
    // Test 7: Add Task to Quadrant 3 (Urgent & Not Important)
    // -------------------------------------------------------------
    const uniqueQ3 = `Automated Q3 Task ${Date.now()}`;
    const res7 = await makeRequest("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: uniqueQ3,
        description: "High urgency and low importance task description",
        isUrgent: "on",
        isImportant: "", // unchecked
        category: "Communication",
        dueDate: "2026-09-29"
      }).toString()
    });
    assert(res7.status === 302, "POST /tasks for Q3 redirects (302)");

    // -------------------------------------------------------------
    // Test 8: Bonus Feature - Edit Task (GET and POST)
    // -------------------------------------------------------------
    // Find task ID from HTML
    const match = res5Check.body.match(/\/tasks\/([a-f0-9]{24})\/edit/);
    assert(match !== null, "Found task ID with /tasks/:id/edit route");
    const testTaskId = match[1];

    const res8EditPage = await makeRequest(`/tasks/${testTaskId}/edit`);
    assert(res8EditPage.status === 200, `GET /tasks/${testTaskId}/edit returns HTTP 200`);
    assert(res8EditPage.body.includes("Edit Task"), "Edit page displays 'Edit Task'");

    const updatedTitle = `Updated Title ${Date.now()}`;
    const res8Update = await makeRequest(`/tasks/${testTaskId}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: updatedTitle,
        description: "Updated description via automated test",
        isUrgent: "on",
        isImportant: "on",
        category: "Academic",
        dueDate: "2026-10-01"
      }).toString()
    });
    assert(res8Update.status === 302, "POST /tasks/:id/edit redirects (302)");

    const res8Check = await makeRequest("/tasks");
    assert(res8Check.body.includes(updatedTitle), "Updated task title appears in the list");

    // -------------------------------------------------------------
    // Test 9: Delete Task (POST /tasks/:id/delete)
    // -------------------------------------------------------------
    const res9Delete = await makeRequest(`/tasks/${testTaskId}/delete`, {
      method: "POST"
    });
    assert(res9Delete.status === 302, `POST /tasks/${testTaskId}/delete redirects (302)`);

    const res9Check = await makeRequest("/tasks");
    assert(!res9Check.body.includes(updatedTitle), "Deleted task is no longer present");

    // -------------------------------------------------------------
    // Test 10: Bonus Feature - Category Filtering
    // -------------------------------------------------------------
    const res10Filter = await makeRequest("/tasks?category=Work");
    assert(res10Filter.status === 200, "GET /tasks?category=Work returns HTTP 200");
    assert(res10Filter.body.includes(uniqueQ2), "Category filter correctly displays Work task");

    console.log("\n=============================================================");
    console.log(`  ALL ${passed} AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY!`);
    console.log("=============================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("\nTest suite failed with error:", err.message);
    process.exit(1);
  }
}

runTests();
