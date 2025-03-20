import TaskItem from "./TaskItem";
import { useState, useEffect } from "react";

function TaskList({ tasks, setTasks, filter }) {
  const [draggedTask, setDraggedTask] = useState(null);

  // ✅ Завантаження списку із БД (тепер враховує порядок)
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data); // Завантажуємо оновлений список у стан
      });
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleDragStart = (event, task) => {
    setDraggedTask(task);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, targetTask) => {
    event.preventDefault();
    if (!draggedTask || draggedTask.id === targetTask.id) return;

    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex((t) => t.id === draggedTask.id);
    const targetIndex = newTasks.findIndex((t) => t.id === targetTask.id);

    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
    setDraggedTask(null);

    // ✅ Відправляємо новий порядок у БД
    try {
      const response = await fetch("http://localhost:3000/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newTasks.map((task) => task.id) }),
      });

      if (!response.ok) {
        console.error("❌ Помилка оновлення порядку на сервері");
      } else {
        console.log("✅ Порядок успішно оновлено в БД");
      }
    } catch (error) {
      console.error("❌ Помилка підключення до сервера", error);
    }
  };

  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          setTasks={setTasks}
          onDragStart={(event) => handleDragStart(event, task)}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, task)}
          draggable
        />
      ))}
    </ul>
  );
}

export default TaskList;
