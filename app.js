const fs = require("fs");
const http = require("http");

const filePath = "./db/Post.json";

// Tasklarni yaratish uchun funksiya
const createTask = (req, res, code, isCompleted) => {
  const tasks = getAllTasks();
  const newTask = {
    id: Date.now().toString(),
    code: code,
    isCompleted: isCompleted,
    date: new Date().toISOString(),
  };
  tasks.push(newTask);
  fs.writeFileSync(filePath, JSON.stringify(tasks));
  res.statusCode = 201;
  res.end(JSON.stringify(newTask));
};

// Barcha tasklarni olish uchun funksiya
const getAllTasks = () => {
  const data = fs.readFileSync(filePath);
  const tasks = JSON.parse(data);
  return tasks;
};

// ID bo'yicha bir taskni olish uchun funksiya
const getTaskById = (req, res, id) => {
  const task = findTaskById(id);
  if (task) {
    res.end(JSON.stringify(task));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Task not found" }));
  }
};

// ID bo'yicha taskni yangilash uchun funksiya
const updateTaskById = (req, res, id, code, isCompleted) => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Task not found" }));
    return;
  }
  tasks[taskIndex].code = code;
  tasks[taskIndex].isCompleted = isCompleted;
  fs.writeFileSync(filePath, JSON.stringify(tasks));
  res.end(JSON.stringify(tasks[taskIndex]));
};

// ID bo'yicha taskni o'chirish uchun funksiya
const deleteTaskById = (req, res, id) => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Task not found" }));
    return;
  }
  tasks.splice(taskIndex, 1);
  fs.writeFileSync(filePath, JSON.stringify(tasks));
  res.statusCode = 204;
  res.end();
};

const findTaskById = (id) => {
  const tasks = getAllTasks();
  const task = tasks.find((t) => t.id === id);
  return task;
};

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/posts") {
      const tasks = getAllTasks();
      res.end(JSON.stringify(tasks));
      req.write(200);
    } else if (req.method === "POST" && req.url === "/posts/new") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const { code, isCompleted } = JSON.parse(body);
        createTask(req, res, code, isCompleted);
      });
      req(200);
    } else if (req.method === "GET" && req.url.startsWith("/posts/")) {
      const id = req.url.split("/")[2];
      getTaskById(req, res, id);
      req(200);
    } else if (req.method === "PUT" && req.url.startsWith("/posts/")) {
      updateTaskById(req, res, id, code, isCompleted);
      req(201);
    } else if (
      req.method === "DELETE" &&
      req.url.startsWith("/posts/delete/")
    ) {
      deleteTaskById(req, res, id);
    }
  })
  .listen(3000);
