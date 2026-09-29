// Automated Verification Test for Notes Management Application
const http = require("http");

async function runTests() {
  console.log("--- Starting Automated Verification Tests ---");
  
  // Dynamically start server on test port 3001
  process.env.PORT = 3001;
  process.env.MONGO_URI = "mongodb://127.0.0.1:27017";
  const app = require("./server");

  // Give server 3 seconds to attempt connection
  await new Promise(res => setTimeout(res, 3000));

  const baseURL = "http://localhost:3001";

  // Helper request function
  async function makeRequest(path, options = {}) {
    const res = await fetch(`${baseURL}${path}`, {
      redirect: "manual",
      ...options
    });
    const text = await res.text();
    return { status: res.status, headers: res.headers, body: text };
  }

  try {
    // Test 1: GET / redirects to /notes
    const r1 = await makeRequest("/");
    console.log("Test 1 - GET / redirect status:", r1.status);
    if (r1.status !== 302 || r1.headers.get("location") !== "/notes") {
      throw new Error(`Expected redirect to /notes, got ${r1.status} to ${r1.headers.get("location")}`);
    }
    console.log("✅ Test 1 Passed: GET / redirects to /notes");

    // Test 2: GET /notes returns HTML with notes list
    const r2 = await makeRequest("/notes");
    console.log("Test 2 - GET /notes status:", r2.status);
    if (r2.status !== 200 || !r2.body.includes("My Notes")) {
      throw new Error("Expected 200 OK containing 'My Notes'");
    }
    console.log("✅ Test 2 Passed: GET /notes displays notes page");

    // Test 3: GET /notes/new displays Add Note form
    const r3 = await makeRequest("/notes/new");
    if (r3.status !== 200 || !r3.body.includes("Add New Note")) {
      throw new Error("Expected 200 OK containing 'Add New Note'");
    }
    console.log("✅ Test 3 Passed: GET /notes/new displays add form");

    // Test 4: Validation test - POST /notes with empty fields should fail (400)
    const r4 = await makeRequest("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ title: "", content: "", category: "Study" }).toString()
    });
    if (r4.status !== 400 || !r4.body.includes("required fields")) {
      throw new Error("Expected 400 validation error for empty fields");
    }
    console.log("✅ Test 4 Passed: Empty submission correctly rejected with 400 and validation message");

    // Test 5: Add a new note
    const testTitle = "Lab Exam Test Note " + Date.now();
    const testContent = "Automated test content for Backend Lab Exam";
    const r5 = await makeRequest("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: testTitle,
        content: testContent,
        category: "Study"
      }).toString()
    });
    if (r5.status !== 302 || r5.headers.get("location") !== "/notes") {
      throw new Error(`Expected redirect to /notes after insertion, got ${r5.status}`);
    }
    console.log("✅ Test 5 Passed: Valid note inserted and redirected to /notes");

    // Test 6: Verify the newly added note is rendered in /notes
    const r6 = await makeRequest("/notes");
    if (!r6.body.includes(testTitle)) {
      throw new Error("New note title not found in notes list");
    }
    console.log("✅ Test 6 Passed: New note retrieved and displayed on UI");

    // Extract note ID for edit and delete tests
    const idMatch = r6.body.match(/\/notes\/([a-f0-9]+)\/delete/);
    if (!idMatch) {
      throw new Error("Could not find note delete action link in HTML");
    }
    const noteId = idMatch[1];
    console.log(`Found Note ID: ${noteId}`);

    // Test 7: GET /notes/:id/edit
    const r7 = await makeRequest(`/notes/${noteId}/edit`);
    if (r7.status !== 200 || !r7.body.includes("Edit Note")) {
      throw new Error("Expected 200 OK for edit page");
    }
    console.log("✅ Test 7 Passed: Edit page renders prefilled form");

    // Test 8: POST /notes/:id/edit (Update note)
    const updatedTitle = testTitle + " (Updated)";
    const r8 = await makeRequest(`/notes/${noteId}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        title: updatedTitle,
        content: "Updated note content",
        category: "Work"
      }).toString()
    });
    if (r8.status !== 302) {
      throw new Error(`Expected redirect after updating, got ${r8.status}`);
    }
    console.log("✅ Test 8 Passed: Note successfully updated");

    // Test 9: Search bonus feature
    const r9 = await makeRequest(`/notes?search=${encodeURIComponent("Updated")}`);
    if (!r9.body.includes(updatedTitle)) {
      throw new Error("Search did not return updated note");
    }
    console.log("✅ Test 9 Passed: Search by title filter works properly");

    // Test 10: Delete note
    const r10 = await makeRequest(`/notes/${noteId}/delete`, {
      method: "POST"
    });
    if (r10.status !== 302) {
      throw new Error(`Expected redirect after delete, got ${r10.status}`);
    }
    console.log("✅ Test 10 Passed: Delete note operation succeeded");

    // Test 11: Verify note is deleted
    const r11 = await makeRequest("/notes");
    if (r11.body.includes(updatedTitle)) {
      throw new Error("Deleted note still appeared in notes list");
    }
    console.log("✅ Test 11 Passed: Note verified removed from list");

    console.log("\n==========================================");
    console.log(" 🎉 ALL 11 TESTS PASSED SUCCESSFULLY! 🎉");
    console.log("==========================================\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Test Failed:", err.message);
    process.exit(1);
  }
}

runTests();
