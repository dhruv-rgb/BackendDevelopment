# Backend Development

**Name:** Dhruv Mehta  
**SAP ID:** 590016903  
**Batch:** Batch 4  
**Course:** Backend Development  

This repository contains coursework, theory modules, assignments, and laboratory projects for the Backend Development course. The folders below are grouped by experiment or topic so each small project can be run independently.

---

## 🌐 Published Site
The GitHub Pages live deployment is available at:  
👉 **[https://dhruv-rgb.github.io/BackendDevelopment/](https://dhruv-rgb.github.io/BackendDevelopment/)**

---

## 🧪 Laboratory Experiments

| Experiment | Title / Description | Link |
| :--- | :--- | :--- |
| **Exp 01** | HTML5 semantic structure, forms & multimedia | [📂 View](./lab/Exp_01) |
| **Exp 02** | CSS styles, selectors, responsive layouts & motion | [📂 View](./lab/Exp_02) |
| **Exp 07–08** | ES6 task board with browser storage | [📂 View](./lab/Exp7_8) |
| **Exp 12 (A)** | Express routing, URL parameters & EJS views | [📂 View](./lab/Exp12_A) |
| **Exp 12 (B)** | Cookies and session management | [📂 View](./lab/Exp12_B) |
| **Exp 13** | Mongoose authentication API with JWT | [📂 View](./lab/Lab_13/Part_A) |
| **Exp 15** | Django task manager with SQLite | [📂 View](./lab/Exp15) |
| **Exp 15B** | Multi-app Django API and external API proxy | [📂 View](./lab/Exp15B) |
| **FastAPI Docker** | Containerized API service | [📂 View](./lab/FastAPI%20Docker%20Lab) |
| **Exam 01** | Eisenhower task matrix application | [📂 View](./lab/Exam_01) |
| **Exam 01 (A)** | Notes management application | [📂 View](./lab/Exam_01_A_Notes) |

---

## 📚 Theory & Lecture Modules

| Module / Task | Description | Link |
| :--- | :--- | :--- |
| **Lecture 01** | Node.js basics | [📂 Open](./Theory/L01-Node.js-Basics) |
| **Lecture 04** | HTTP responses, templating, Flask and browser tools | [📂 Open](./Theory/L04-HTTP-Requests-and-Responses) |
| **Lecture 05** | FastAPI course API | [📂 Open](./Theory/L05-RESTful-APIs-FastAPI) |
| **Lecture 06** | Cookies, sessions and query strings | [📂 Open](./Theory/L06-Session-Control) |
| **Lecture 07** | Web Storage and JSON | [📂 Open](./Theory/L07-Web-Storage) |
| **Lecture 08** | FastAPI and Jinja2 server rendering | [📂 Open](./Theory/Lec_08) |
| **Lecture 19** | Relational student API with SQLAlchemy | [📂 Open](./Theory/Lec_19) |
| **Unit 2: Validation** | Pydantic model constraints | [📂 Open](./Theory/Unit2_Data_Model_Validation) |
| **Unit 2: ODM** | Mongoose schemas and validation | [📂 Open](./Theory/Unit2_ODM) |
| **Unit 2: ORM** | SQLAlchemy relationships | [📂 Open](./Theory/Unit2_ORM) |
| **Lecture 25** | Express JSON API and middleware | [📂 Open](./Theory/Lec_25) |
| **Lecture 26** | Django request timing middleware | [📂 Open](./Theory/Lec_26) |
| **Lecture 29** | Django student JSON endpoints | [📂 Open](./Theory/Lec_29) |
| **Unit 4** | FastAPI containers and Nginx proxy | [📂 Open](./Theory/unit4) |
| **Assignment 01** | Interactive Notes Manager Application | [📂 Open Assignment 01](./Theory/Assignment-1-Notes-Manager) |
| **Assignment 02** | PostgreSQL JSONB analysis and SQL examples | [📂 Open Assignment 02](./Assignment/Assignment2_PostgreSQL_JSONB) |
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
