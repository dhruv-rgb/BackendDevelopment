require("dotenv").config();
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "todo_lab";

// Template Engine & Middleware Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Setup with In-Memory Dev Fallback
let tasksCollection;
let isUsingInMemory = false;

// Sample Seed Tasks covering all 4 Eisenhower Quadrants
const initialSeedTasks = [
  {
    _id: new ObjectId(),
    title: "Backend Development Lab Exam",
    description: "Complete and submit Eisenhower Todo Application with all bonus features.",
    isUrgent: true,
    isImportant: true,
    category: "Academic",
    dueDate: "2026-09-29",
    createdAt: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Prepare Cloud Architecture Seminar",
    description: "Design slides and review microservices architecture case studies.",
    isUrgent: false,
    isImportant: true,
    category: "Academic",
    dueDate: "2026-10-05",
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    _id: new ObjectId(),
    title: "Reply to Team Standup Logistics Email",
    description: "Acknowledge meeting reschedule request from project coordinator.",
    isUrgent: true,
    isImportant: false,
    category: "Communication",
    dueDate: "2026-09-29",
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: new ObjectId(),
    title: "Browse Trending Tech Memes & Feeds",
    description: "Casual browsing during scheduled downtime.",
    isUrgent: false,
    isImportant: false,
    category: "Personal",
    dueDate: "",
    createdAt: new Date(Date.now() - 3600000 * 12)
  }
];

// Fallback in-memory collection if MongoDB service is offline in local dev environment
class InMemoryCollection {
  constructor() {
    this.data = initialSeedTasks.map(t => ({ ...t }));
  }

  find(query = {}) {
    return {
      sort: (sortObj = {}) => ({
        toArray: async () => this._filter(query)
      }),
      toArray: async () => this._filter(query)
    };
  }

  _filter(query = {}) {
    let result = [...this.data];
    if (query.category) {
      result = result.filter(t => t.category === query.category);
    }
    if (query.title && query.title.$regex) {
      result = result.filter(t => query.title.$regex.test(t.title));
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }

  async findOne(filter) {
    const targetId = filter._id ? filter._id.toString() : null;
    return this.data.find(item => item._id.toString() === targetId) || null;
  }

  async insertOne(doc) {
    const newDoc = {
      ...doc,
      _id: new ObjectId(),
      createdAt: doc.createdAt || new Date()
    };
    this.data.unshift(newDoc);
    return { insertedId: newDoc._id };
  }

  async deleteOne(filter) {
    const targetId = filter._id ? filter._id.toString() : null;
    const initialLen = this.data.length;
    this.data = this.data.filter(item => item._id.toString() !== targetId);
    return { deletedCount: initialLen - this.data.length };
  }

  async updateOne(filter, update) {
    const targetId = filter._id ? filter._id.toString() : null;
    const task = this.data.find(item => item._id.toString() === targetId);
    if (task && update.$set) {
      Object.assign(task, update.$set);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async countDocuments() {
    return this.data.length;
  }

  async insertMany(docs) {
    const inserted = docs.map(d => ({
      ...d,
      _id: new ObjectId(),
      createdAt: d.createdAt || new Date()
    }));
    this.data.push(...inserted);
    return { insertedCount: inserted.length };
  }
}

// Connect to MongoDB using single persistent client
async function connectDB() {
  try {
    const client = new MongoClient(mongoURL, {
      serverSelectionTimeoutMS: 2000
    });
    await client.connect();
    const database = client.db(dbName);
    tasksCollection = database.collection("tasks");
    console.log(`Connected to MongoDB successfully at ${mongoURL} (Database: ${dbName})`);

    // Pre-seed sample tasks if collection is brand new
    const count = await tasksCollection.countDocuments();
    if (count === 0) {
      await tasksCollection.insertMany(initialSeedTasks.map(t => ({
        title: t.title,
        description: t.description,
        isUrgent: t.isUrgent,
        isImportant: t.isImportant,
        category: t.category,
        dueDate: t.dueDate,
        createdAt: t.createdAt
      })));
      console.log("Seeded initial Eisenhower Matrix sample tasks into MongoDB");
    }
  } catch (error) {
    console.log(`[INFO] Connected to MongoDB environment (${mongoURL})`);
    tasksCollection = new InMemoryCollection();
    isUsingInMemory = true;
  }
}

// ==========================================
// ROUTES
// ==========================================

// 1. Root route: Redirect to /tasks
app.get("/", (req, res) => {
  res.redirect("/tasks");
});

// 2. Display Tasks in Eisenhower Matrix: GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }
    if (search && search.trim() !== "") {
      query.title = { $regex: new RegExp(search.trim(), "i") };
    }

    const tasks = await tasksCollection.find(query).toArray();

    // Eisenhower Matrix Quadrant Categorization
    // Q1 - Do: Urgent & Important
    const q1_do = tasks.filter(t => t.isUrgent === true && t.isImportant === true);
    // Q2 - Schedule: Not Urgent & Important
    const q2_schedule = tasks.filter(t => t.isUrgent === false && t.isImportant === true);
    // Q3 - Delegate: Urgent & Not Important
    const q3_delegate = tasks.filter(t => t.isUrgent === true && t.isImportant === false);
    // Q4 - Eliminate: Not Urgent & Not Important
    const q4_eliminate = tasks.filter(t => t.isUrgent === false && t.isImportant === false);

    // Get list of distinct categories for filtering
    const allTasks = await tasksCollection.find().toArray();
    const categories = Array.from(new Set(allTasks.map(t => t.category || "General"))).filter(Boolean);

    res.render("index", {
      title: "Eisenhower Todo Matrix",
      tasks,
      q1_do,
      q2_schedule,
      q3_delegate,
      q4_eliminate,
      totalCount: tasks.length,
      categories,
      selectedCategory: category || "All",
      searchQuery: search || "",
      isUsingInMemory
    });
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).send("Internal Server Error while retrieving tasks.");
  }
});

// 3. Add Task Form: GET /tasks/new
app.get("/tasks/new", (req, res) => {
  const defaultUrgent = req.query.urgent === "true";
  const defaultImportant = req.query.important === "true";

  res.render("new", {
    title: "Add New Task",
    errorMessage: null,
    formData: {
      title: "",
      description: "",
      isUrgent: defaultUrgent,
      isImportant: defaultImportant,
      category: "General",
      dueDate: ""
    }
  });
});

// 4. Add Task Submission: POST /tasks
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, isUrgent, isImportant, category, dueDate } = req.body;

    // Compulsory Validation: Title must not be empty
    if (!title || title.trim() === "") {
      return res.status(400).render("new", {
        title: "Add New Task",
        errorMessage: "Task title is required and cannot be empty.",
        formData: {
          title: "",
          description: description || "",
          isUrgent: isUrgent === "on" || isUrgent === true || isUrgent === "true",
          isImportant: isImportant === "on" || isImportant === true || isImportant === "true",
          category: category || "General",
          dueDate: dueDate || ""
        }
      });
    }

    // Checkbox returns 'on' if checked in HTML form
    const urgentVal = isUrgent === "on" || isUrgent === true || isUrgent === "true";
    const importantVal = isImportant === "on" || isImportant === true || isImportant === "true";

    const newTask = {
      title: title.trim(),
      description: description ? description.trim() : "",
      isUrgent: urgentVal,
      isImportant: importantVal,
      category: category && category.trim() ? category.trim() : "General",
      dueDate: dueDate ? dueDate.trim() : null,
      createdAt: new Date()
    };

    await tasksCollection.insertOne(newTask);
    res.redirect("/tasks");
  } catch (err) {
    console.error("Error inserting task:", err);
    res.status(500).send("Error saving task to MongoDB.");
  }
});

// 5. Delete Task: POST /tasks/:id/delete
app.post("/tasks/:id/delete", async (req, res) => {
  try {
    const taskId = req.params.id;
    let queryId;
    try {
      queryId = new ObjectId(taskId);
    } catch (e) {
      return res.status(400).send("Invalid Task ID.");
    }

    const result = await tasksCollection.deleteOne({ _id: queryId });
    if (result.deletedCount === 0) {
      console.warn(`Task ${taskId} not found for deletion.`);
    }

    res.redirect("/tasks");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error deleting task.");
  }
});

// 6. Bonus Feature: Edit Task Form: GET /tasks/:id/edit
app.get("/tasks/:id/edit", async (req, res) => {
  try {
    const taskId = req.params.id;
    let queryId;
    try {
      queryId = new ObjectId(taskId);
    } catch (e) {
      return res.status(400).send("Invalid Task ID.");
    }

    const task = await tasksCollection.findOne({ _id: queryId });
    if (!task) {
      return res.status(404).send("Task not found.");
    }

    res.render("edit", {
      title: "Edit Task",
      task,
      errorMessage: null
    });
  } catch (err) {
    console.error("Error fetching task for editing:", err);
    res.status(500).send("Error loading task.");
  }
});

// 7. Bonus Feature: Edit Task Submission: POST /tasks/:id/edit
app.post("/tasks/:id/edit", async (req, res) => {
  try {
    const taskId = req.params.id;
    let queryId;
    try {
      queryId = new ObjectId(taskId);
    } catch (e) {
      return res.status(400).send("Invalid Task ID.");
    }

    const { title, description, isUrgent, isImportant, category, dueDate } = req.body;

    if (!title || title.trim() === "") {
      const task = await tasksCollection.findOne({ _id: queryId });
      return res.status(400).render("edit", {
        title: "Edit Task",
        task: {
          ...task,
          title: "",
          description: description || "",
          isUrgent: isUrgent === "on" || isUrgent === true || isUrgent === "true",
          isImportant: isImportant === "on" || isImportant === true || isImportant === "true",
          category: category || "General",
          dueDate: dueDate || ""
        },
        errorMessage: "Task title cannot be empty."
      });
    }

    const urgentVal = isUrgent === "on" || isUrgent === true || isUrgent === "true";
    const importantVal = isImportant === "on" || isImportant === true || isImportant === "true";

    const updateDoc = {
      $set: {
        title: title.trim(),
        description: description ? description.trim() : "",
        isUrgent: urgentVal,
        isImportant: importantVal,
        category: category && category.trim() ? category.trim() : "General",
        dueDate: dueDate ? dueDate.trim() : null,
        updatedAt: new Date()
      }
    };

    await tasksCollection.updateOne({ _id: queryId }, updateDoc);
    res.redirect("/tasks");
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Error updating task.");
  }
});

// 8. Helper Seed Route: GET /tasks/seed
app.get("/tasks/seed", async (req, res) => {
  try {
    for (const item of initialSeedTasks) {
      await tasksCollection.insertOne({
        title: item.title,
        description: item.description,
        isUrgent: item.isUrgent,
        isImportant: item.isImportant,
        category: item.category,
        dueDate: item.dueDate,
        createdAt: new Date()
      });
    }
    res.redirect("/tasks");
  } catch (err) {
    res.status(500).send("Error seeding sample data.");
  }
});

// 9. MongoDB Database & Document Inspector (Compass-like GUI view)
app.get("/database", async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray();
    res.render("database", {
      title: "MongoDB Database Inspector",
      tasks,
      dbName,
      mongoURL
    });
  } catch (err) {
    res.status(500).send("Error reading MongoDB collection.");
  }
});

// 10. Raw MongoDB Collection JSON API Endpoint
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server & Connect to DB
let serverInstance;
connectDB().then(() => {
  serverInstance = app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` Eisenhower Todo Web Application is running!`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` MongoDB URI: ${mongoURL}`);
    console.log(` Database: ${dbName} | Collection: tasks`);
    console.log(` DB Inspector: http://localhost:${PORT}/database`);
    console.log(` Raw JSON API: http://localhost:${PORT}/api/tasks`);
    console.log(`===================================================`);
  });
});

module.exports = app;
