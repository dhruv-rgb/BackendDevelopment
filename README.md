# Backend Development

**Name:** Dhruv Mehta  
**SAP ID:** 590016903  
**Batch:** Batch 4  
**Course:** Backend Development  

This repository contains complete coursework, theory modules, assignments, and laboratory projects for the Backend Development course.

---

## 🌐 Published Site
The GitHub Pages live deployment is available at:  
👉 **[https://dhruv-rgb.github.io/BackendDevelopment/](https://dhruv-rgb.github.io/BackendDevelopment/)**

---

## 🧪 Laboratory Experiments

| Experiment | Title / Description | Link |
| :--- | :--- | :--- |
| **Exp 01** | HTML5 Semantic Structure, Form Elements & Multimedia | [📂 View Exp_01](./lab/Exp_01) |
| **Exp 12 (A)** | Express.js Routing, URL Parameters & EJS Dynamic Views | [📂 View Exp12_A](./lab/Exp12_A) |
| **Exp 12 (B)** | Cookies & Session Management Demo | [📂 View Exp12_B](./lab/Exp12_B) |
| **Lab 13 (A)** | User Authentication & Authorization with JWT & MongoDB | [📂 View Lab_13 Part A](./lab/Lab_13/Part_A) |
| **Exam 01** | Backend Lab Exam (Set B): "Eisenhower Todo" Matrix App (Express + EJS + MongoDB) | [📂 View Exam_01](./lab/Exam_01) |
| **Exam 01 (A)** | Backend Lab Exam (Set A): "My Notes" Management App (Express + EJS + MongoDB) | [📂 View Exam_01_A_Notes](./lab/Exam_01_A_Notes) |

---

## 📚 Theory & Lecture Modules

| Module / Task | Description | Link |
| :--- | :--- | :--- |
| **Lecture 01** | Node.js Basics (Hello World, Multiple Routes, JSON Data) | [📂 Open L01](./Theory/L01-Node.js-Basics) |
| **Lecture 04** | HTTP Requests & Responses (HTML, EJS Templating, Flask APIs, DevTools) | [📂 Open L04](./Theory/L04-HTTP-Requests-and-Responses) |
| **Lecture 05** | RESTful APIs & Course Management with FastAPI | [📂 Open L05](./Theory/L05-RESTful-APIs-FastAPI) |
| **Lecture 06** | Session Control (Cookies, Sessions, Query Strings) | [📂 Open L06](./Theory/L06-Session-Control) |
| **Lecture 07** | Web Storage (localStorage, sessionStorage, JSON Basics) | [📂 Open L07](./Theory/L07-Web-Storage) |
| **Assignment 01** | Interactive Notes Manager Application | [📂 Open Assignment 01](./Theory/Assignment-1-Notes-Manager) |
| **Theory Task 1** | Express.js & EJS Dynamic Student Management API | [📂 Open Task 1](./Theory/Task_1) |
| **Theory Task 2** | Flask (Python) RESTful API for Student Management | [📂 Open Task 2](./Theory/Task_2) |
| **Theory Task 3** | FastAPI In-Memory CRUD Endpoints with Swagger Docs | [📂 Open Task 3](./Theory/Task_3) |
| **Theory Task 4** | Database Integration (SQLite + SQLAlchemy ORM) with FastAPI | [📂 Open Task 4](./Theory/Task_4) |

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/dhruv-rgb/BackendDevelopment.git
cd BackendDevelopment
```

### 2. Run Lab Experiments
- **Experiment 01 (HTML5)**: Open `lab/Exp_01/code.html` directly in your browser.
- **Experiment 12 (A) (Express)**:
  ```bash
  cd lab/Exp12_A
  npm install
  node app.js
  ```
- **Experiment 12 (B) (Cookies & Sessions)**:
  ```bash
  cd lab/Exp12_B
  npm install
  node session-cookie-demo/server.js
  ```
- **Lab 13 (A) (JWT & MongoDB)**:
  ```bash
  cd lab/Lab_13/Part_A
  npm install
  npm start
  ```
- **Exam 01 ("Eisenhower Todo" Matrix App - Express + EJS + MongoDB)**:
  ```bash
  cd lab/Exam_01
  npm install
  npm start
  ```

### 3. Run Theory Modules
- **Lecture 01 (Node.js Basics)**:
  ```bash
  cd Theory/L01-Node.js-Basics/Task-1-Hello-World
  node server.js
  ```
- **Lecture 05 (FastAPI Course API)**:
  ```bash
  cd Theory/L05-RESTful-APIs-FastAPI
  pip install -r requirements.txt
  uvicorn main:app --reload
  ```
- **Theory Task 4 (FastAPI + SQLite Database)**:
  ```bash
  cd Theory/Task_4
  pip install fastapi uvicorn sqlalchemy pydantic
  python main.py
  ```
