# Theory Task 4: Database Integration & Persistent CRUD API

**Student:** Dhruv Mehta  
**SAP ID:** 590016903  
**Batch:** Batch 4  
**Course:** Backend Development  

---

## 🎯 Objective
To implement persistent data storage using **SQLite** with the **SQLAlchemy ORM** and build RESTful CRUD endpoints in **FastAPI**.

---

## 🛠️ Tech Stack
- **Framework:** FastAPI
- **Database:** SQLite (`students.db`)
- **ORM:** SQLAlchemy
- **Data Validation:** Pydantic

---

## 📋 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root information & docs link |
| `GET` | `/students` | Retrieve all student records from SQLite DB |
| `GET` | `/students/{student_id}` | Retrieve specific student by database ID |
| `POST` | `/students` | Add a new student record to SQLite DB |
| `PUT` | `/students/{student_id}` | Update existing student record |
| `DELETE` | `/students/{student_id}` | Delete a student record from DB |
| `GET` | `/docs` | Interactive Swagger UI API documentation |

---

## 🚀 How to Run

1. Navigate to this directory:
   ```bash
   cd Theory/Task_4
   ```

2. Install requirements:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic
   ```

3. Start the server:
   ```bash
   python main.py
   ```

4. Open API Documentation in browser:
   👉 `http://127.0.0.1:8000/docs`

---

[🔙 Back to Main Dashboard](../../README.md)
