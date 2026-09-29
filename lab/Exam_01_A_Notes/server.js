require("dotenv").config();
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "notes_lab";

// Template Engine & Middleware Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Setup with In-Memory Dev Fallback for local practice
let notesCollection;
let isUsingInMemory = false;

// Fallback in-memory collection if MongoDB service is not running locally
class InMemoryCollection {
  constructor() {
    this.data = [
      {
        _id: new ObjectId(),
        title: "Backend Lab",
        content: "Complete the Notes application using Node.js, Express, EJS, and MongoDB.",
        category: "Study",
        createdAt: new Date()
      }
    ];
  }

  find(query = {}) {
    return {
      sort: (sortObj = {}) => ({
        toArray: async () => {
          let result = [...this.data];
          if (query.title && query.title.$regex) {
            result = result.filter(n => query.title.$regex.test(n.title));
          }
          if (query.category) {
            result = result.filter(n => n.category === query.category);
          }
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return result;
        }
      }),
      toArray: async () => {
        let result = [...this.data];
        if (query.title && query.title.$regex) {
          result = result.filter(n => query.title.$regex.test(n.title));
        }
        if (query.category) {
          result = result.filter(n => n.category === query.category);
        }
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return result;
      }
    };
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
    this.data.push(newDoc);
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
    const note = this.data.find(item => item._id.toString() === targetId);
    if (note && update.$set) {
      Object.assign(note, update.$set);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async countDocuments() {
    return this.data.length;
  }
}

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(mongoURL, {
      serverSelectionTimeoutMS: 2500
    });
    await client.connect();
    const database = client.db(dbName);
    notesCollection = database.collection("notes");
    console.log(`Connected to MongoDB successfully at ${mongoURL} (Database: ${dbName})`);

    // Optional seed if collection is brand new
    const count = await notesCollection.countDocuments();
    if (count === 0) {
      await notesCollection.insertOne({
        title: "Backend Lab",
        content: "Complete the Notes application.",
        category: "Study",
        createdAt: new Date()
      });
      console.log("Seeded initial sample note into MongoDB.");
    }
  } catch (error) {
    console.warn(`\n[NOTICE] Could not connect to MongoDB server at ${mongoURL}.`);
    console.warn(`Using in-memory data store for local development/testing so the application works immediately.`);
    console.warn(`In the examination lab environment with MongoDB running, it connects to real MongoDB automatically.\n`);
    isUsingInMemory = true;
    notesCollection = new InMemoryCollection();
  }
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Redirect root to /notes
app.get("/", (req, res) => {
  res.redirect("/notes");
});

// 1. Display All Notes (with Search & Category filter bonus)
app.get("/notes", async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    // Search by title (Bonus Requirement)
    if (search && search.trim() !== "") {
      query.title = { $regex: new RegExp(search.trim(), "i") };
    }

    // Filter by category (Bonus Requirement)
    if (category && category.trim() !== "") {
      query.category = category.trim();
    }

    const notes = await notesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.render("index", {
      notes,
      searchQuery: search ? search.trim() : "",
      selectedCategory: category ? category.trim() : "",
      isUsingInMemory
    });
  } catch (err) {
    console.error("Error retrieving notes:", err);
    res.status(500).send("Error retrieving notes from database.");
  }
});

// 2. Display Add Note Form
app.get("/notes/new", (req, res) => {
  res.render("new", {
    error: null,
    note: { title: "", content: "", category: "Study" }
  });
});

// 3. Add a New Note (Compulsory Requirement)
app.post("/notes", async (req, res) => {
  const { title, content, category } = req.body;

  // Validation: Validate that title and content are not empty
  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).render("new", {
      error: "Both Title and Content are required fields and cannot be empty.",
      note: {
        title: title || "",
        content: content || "",
        category: category || "Study"
      }
    });
  }

  try {
    // Insert the note into MongoDB
    await notesCollection.insertOne({
      title: title.trim(),
      content: content.trim(),
      category: (category && category.trim()) || "General",
      createdAt: new Date()
    });

    // Redirect to the notes list page
    res.redirect("/notes");
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).render("new", {
      error: "Failed to save note to the database. Please try again.",
      note: req.body
    });
  }
});

// 4. Delete a Note (Compulsory Requirement)
app.post("/notes/:id/delete", async (req, res) => {
  const { id } = req.params;

  try {
    let filter;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    await notesCollection.deleteOne(filter);
    res.redirect("/notes");
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Error deleting note.");
  }
});

// 5. Bonus: Edit an Existing Note Form
app.get("/notes/:id/edit", async (req, res) => {
  const { id } = req.params;

  try {
    let filter;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    const note = await notesCollection.findOne(filter);
    if (!note) {
      return res.status(404).send("Note not found.");
    }

    res.render("edit", {
      note,
      error: null
    });
  } catch (err) {
    console.error("Error fetching note for edit:", err);
    res.status(500).send("Error fetching note for edit.");
  }
});

// 6. Bonus: Update an Existing Note
app.post("/notes/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).render("edit", {
      note: { _id: id, title, content, category },
      error: "Both Title and Content are required fields and cannot be empty."
    });
  }

  try {
    let filter;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    await notesCollection.updateOne(filter, {
      $set: {
        title: title.trim(),
        content: content.trim(),
        category: (category && category.trim()) || "General",
        updatedAt: new Date()
      }
    });

    res.redirect("/notes");
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).render("edit", {
      note: { _id: id, title, content, category },
      error: "Failed to update note in the database."
    });
  }
});

// Start Server after connecting to DB
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  My Notes Application is Running!`);
    console.log(`  Local URL: http://localhost:${PORT}`);
    console.log(`=========================================`);
  });
}

startServer();

module.exports = app;
