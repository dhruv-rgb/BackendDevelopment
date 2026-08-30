from flask import Flask, jsonify

app = Flask(__name__)

# Student list with Dhruv Mehta
students = [
    {"id": 1, "name": "Dhruv Mehta", "branch": "CSE", "sap_id": "590016903"},
    {"id": 2, "name": "Aarav Sharma", "branch": "CSE", "sap_id": "590014101"},
    {"id": 3, "name": "Diya Patel", "branch": "ECE", "sap_id": "590014202"},
    {"id": 4, "name": "Rohan Verma", "branch": "IT", "sap_id": "590014303"}
]

@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to Student Management API",
        "author": "Dhruv Mehta",
        "sap_id": "590016903",
        "batch": "Batch 4"
    })

@app.route("/students")
def get_students():
    return jsonify(students)

@app.route("/students/<int:student_id>")
def get_student(student_id):
    student = next((s for s in students if s["id"] == student_id), None)
    if student:
        return jsonify(student)
    else:
        return jsonify({"error": "Student not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)
