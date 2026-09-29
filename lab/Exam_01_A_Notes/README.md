# Backend Development Lab Examination: "My Notes" Management Application

**Course:** Backend Development  
**Student Name:** Dhruv Mehta  
**SAP ID:** 590016903  
**Technology Stack:** Node.js with Express.js, EJS Template Engine, MongoDB  

---

## 📌 Project Overview
"My Notes" is a complete, server-side rendered Notes Management Web Application built according to the specifications of the Backend Development Lab Examination. It allows users to create, view, update, search, filter, and delete personal notes stored in a MongoDB database.

---

## 🎯 Compulsory Features Implemented
1. **Display Notes:**
   - Home page (`GET /notes`) retrieves and renders all notes stored in MongoDB.
   - Shows **Title**, **Content**, **Category**, **Creation Date**, and **Delete Button** for every note.
   - Graceful empty-state message displayed when no notes exist.
2. **Add Note:**
   - Clean form at `GET /notes/new` with fields for Title, Category, and Content.
   - Server-side validation ensuring Title and Content are non-empty.
   - Inserts document into MongoDB `notes_lab` database under `notes` collection.
   - Redirects to `/notes` upon success.
3. **Delete Note:**
   - Dedicated Delete button per note sending `POST /notes/:id/delete`.
   - Safely removes note matching MongoDB `ObjectId`.
4. **Server-Side Rendering (EJS):**
   - Built using dynamic EJS templates with modular partials for Header and Footer.

---

## 🌟 Bonus Features Implemented (Up to 3 Bonus Marks)
- **Edit Note:** Full Edit and Update capability (`GET /notes/:id/edit` and `POST /notes/:id/edit`).
- **Search Notes by Title:** Case-insensitive search filter (`GET /notes?search=keyword`).
- **Filter Notes by Category:** Instant filtering by Study, Work, Personal, Ideas, or General (`GET /notes?category=name`).
- **Enhanced Responsive UI:** Modern card design, interactive category badges, hover effects, and CSS styling.

---

## 🗄️ MongoDB Information & Document Structure
- **Default Connection URL:** `mongodb://127.0.0.1:27017`
- **Database:** `notes_lab`
- **Collection:** `notes`

### Sample Document:
```json
{
  "_id": "65fc1234567890abcdef1234",
  "title": "Backend Lab",
  "content": "Complete the Notes application.",
  "category": "Study",
  "createdAt": "2026-09-22T09:48:00.000Z"
}
```

---

## 🚀 Execution Instructions (How to Run in VS Code)

### Prerequisites
- Node.js (v18 or higher)
- VS Code editor
- MongoDB (running on `mongodb://127.0.0.1:27017` in the lab, or fallback dev mode)

### Step 1: Open Folder in VS Code
Open VS Code and select **File > Open Folder...**, then navigate to:
```
lab/Exam_01
```

### Step 2: Open Terminal & Install Dependencies
Press ``Ctrl + ` `` to open the VS Code integrated terminal and run:
```bash
npm install
```

### Step 3: Start the Application
```bash
npm start
```
*Alternatively, for hot-reloading development:*
```bash
npm run dev
```

### Step 4: Open in Your Web Browser
Open your browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📋 Routes Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Redirects to `/notes` |
| `GET` | `/notes` | Display all notes (supports `?search=` and `?category=`) |
| `GET` | `/notes/new` | Render the Add Note form |
| `POST` | `/notes` | Validate and insert a new note into MongoDB |
| `POST` | `/notes/:id/delete` | Delete a note by its `_id` |
| `GET` | `/notes/:id/edit` | Display the Edit Note form populated with note data |
| `POST` | `/notes/:id/edit` | Update an existing note in MongoDB |
