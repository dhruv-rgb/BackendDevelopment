const STORAGE_KEY = "dhruv-task-board-v1";

class Task {
  constructor(title, done = false, id = crypto.randomUUID()) {
    this.id = id;
    this.title = title;
    this.done = done;
  }
}

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#task-count");
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved)
      ? saved.filter((item) => typeof item.title === "string")
          .map(({ id, title, done }) => new Task(title, Boolean(done), id))
      : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.replaceChildren();
  for (const { id, title, done } of tasks) {
    const item = document.createElement("li");
    item.dataset.id = id;
    item.classList.toggle("done", done);
    const text = document.createElement("span");
    text.className = "task-title";
    text.textContent = title;
    text.tabIndex = 0;
    text.setAttribute("role", "button");
    text.setAttribute("aria-pressed", String(done));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.dataset.action = "remove";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${title}`);
    item.append(text, remove);
    list.append(item);
  }
  emptyState.hidden = tasks.length > 0;
  const openCount = tasks.filter(({ done }) => !done).length;
  count.textContent = `${openCount} open ${openCount === 1 ? "task" : "tasks"}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  tasks = [...tasks, new Task(title)];
  saveTasks();
  render();
  form.reset();
  titleInput.focus();
});

// Event delegation: one listener handles actions on all current and future rows.
list.addEventListener("click", (event) => {
  const row = event.target.closest("li[data-id]");
  if (!row) return;
  if (event.target.closest('[data-action="remove"]')) {
    tasks = tasks.filter(({ id }) => id !== row.dataset.id);
  } else {
    tasks = tasks.map((task) => task.id === row.dataset.id
      ? new Task(task.title, !task.done, task.id)
      : task);
  }
  saveTasks();
  render();
});

list.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".task-title")) {
    event.preventDefault();
    event.target.closest("li").querySelector(".task-title").click();
  }
});

document.querySelector("#clear-done").addEventListener("click", () => {
  tasks = tasks.filter(({ done }) => !done);
  saveTasks();
  render();
});

render();
