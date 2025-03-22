import TaskItem from "./TaskItem";
import { useState, useEffect, useCallback, useMemo } from "react";
import { reorderTasks, fetchTasks as fetchTasksApi } from "../api";

function TaskList({ tasks, setTasks, filter }) {
  const [draggedTask, setDraggedTask] = useState(null);

  // Завантаження списку із БД (тепер враховує порядок)
  useEffect(() => {
    fetchTasksApi().then(setTasks);
  }, [setTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  }, [tasks, filter]);

  const handleDragStart = useCallback((event, task) => {
    setDraggedTask(task);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    async (event, targetTask) => {
      event.preventDefault();
      if (!draggedTask || draggedTask.id === targetTask.id) return;

      const newTasks = [...tasks];
      const draggedIndex = newTasks.findIndex((t) => t.id === draggedTask.id);
      const targetIndex = newTasks.findIndex((t) => t.id === targetTask.id);

      newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);

      setTasks(newTasks);
      setDraggedTask(null);

      try {
        await reorderTasks(newTasks.map((task) => task.id));
        console.log("✅ Порядок успішно оновлено в БД");
      } catch (error) {
        console.error("❌ Помилка підключення до сервера", error);
      }
    },
    [draggedTask, tasks, setTasks]
  );

  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          setTasks={setTasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          draggable
        />
      ))}
    </ul>
  );
}

export default TaskList;
