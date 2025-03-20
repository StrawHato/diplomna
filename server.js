import express from "express";
import fs from "fs";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DB_FILE = join(__dirname, "db.json");

app.use(express.json());
app.use(cors());

// Функція читання бази даних
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data).tasks || [];
    } catch (error) {
        console.error("Помилка читання БД:", error);
        return [];
    }
};

// Функція запису бази даних
const writeDB = (tasks) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify({ tasks }, null, 2));
        console.log("✅ База даних оновлена!");
    } catch (error) {
        console.error("Помилка запису БД:", error);
    }
};

// ✅ Отримання всіх завдань
app.get("/tasks", (req, res) => {
    res.json(readDB());
});

// ✅ Додавання нового завдання
app.post("/tasks", (req, res) => {
    const tasks = readDB();
    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: false,
    };
    tasks.push(newTask);
    writeDB(tasks);
    res.json(newTask);
});

// ✅ Оновлення стану завдання
app.patch("/tasks/:id", (req, res) => {
    const tasks = readDB();
    const taskId = parseInt(req.params.id);
    const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...req.body } : task
    );
    writeDB(updatedTasks);
    res.json(updatedTasks.find((task) => task.id === taskId));
});

// ✅ Редагування тексту завдання
app.patch("/tasks/edit/:id", (req, res) => {
    const tasks = readDB();
    const taskId = parseInt(req.params.id);
    const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, text: req.body.text } : task
    );
    writeDB(updatedTasks);
    res.json(updatedTasks.find((task) => task.id === taskId));
});

// ✅ Видалення завдання
app.delete("/tasks/:id", (req, res) => {
    const tasks = readDB();
    const taskId = parseInt(req.params.id);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    writeDB(updatedTasks);
    res.json({ message: "Завдання видалено" });
});

// ✅ Оновлення порядку завдань
app.patch("/tasks/reorder", (req, res) => {
    const tasks = readDB();
    const newOrder = req.body.order; // Масив ID у новому порядку

    if (!Array.isArray(newOrder)) {
        return res.status(400).json({ error: "Неправильний формат запиту" });
    }

    // Перевірка, чи всі ID існують у поточних задачах
    const reorderedTasks = newOrder
        .map((id) => tasks.find((task) => task.id === id))
        .filter(Boolean);

    if (reorderedTasks.length !== tasks.length) {
        return res.status(400).json({ error: "Некоректний порядок завдань" });
    }

    writeDB(reorderedTasks);
    res.json({ message: "Порядок оновлено", tasks: reorderedTasks });
});

// Запускаємо сервер
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
