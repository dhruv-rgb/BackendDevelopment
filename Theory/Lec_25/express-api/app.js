const express = require("express");
const app = express();
app.use(express.json({ limit: "32kb" }));

let nextId = 3;
let courses = [
  { id: 1, title: "Backend Development", level: "beginner" },
  { id: 2, title: "Web APIs", level: "intermediate" },
];

app.get("/api/courses", (_req, res) => res.json(courses));
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((item) => item.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});
app.post("/api/courses", (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const level = typeof req.body.level === "string" ? req.body.level.trim() : "beginner";
  if (!title) return res.status(400).json({ error: "title is required" });
  const course = { id: nextId++, title, level };
  courses = [...courses, course];
  res.status(201).location(`/api/courses/${course.id}`).json(course);
});
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ error: "Invalid JSON body" });
  res.status(500).json({ error: "Unexpected server error" });
});

const port = Number(process.env.PORT) || 3000;
if (require.main === module) app.listen(port, () => console.log(`Course API listening on ${port}`));
module.exports = app;
