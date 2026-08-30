const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const students = [
    { id: 1, name: "Dhruv Mehta", branch: "CSE", sap_id: "590016903" },
    { id: 2, name: "Aarav Sharma", branch: "CSE", sap_id: "590014101" },
    { id: 3, name: "Diya Patel", branch: "ECE", sap_id: "590014202" },
    { id: 4, name: "Rohan Verma", branch: "IT", sap_id: "590014303" }
];

app.get("/", (req, res) => {
    res.render("home", { studentName: "Dhruv Mehta", sapId: "590016903" });
});

app.get("/students", (req, res) => {
    res.render("students", { students: students });
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
