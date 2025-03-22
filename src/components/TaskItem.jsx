import { useState, useCallback } from "react";
import React from "react";

function TaskItem({ task, setTasks, onDragStart, onDragOver, onDrop }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const toggleTask = useCallback(async () => {
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );
  }, [task, setTasks]);

  const deleteTask = useCallback(async () => {
    if (window.confirm("Ви впевнені, що хочете видалити це завдання?")) {
      await fetch(`http://localhost:3000/tasks/${task.id}`, { method: "DELETE" });
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    }
  }, [task, setTasks]);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!newText.trim()) return;
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, text: newText } : t))
    );
    setIsEditing(false);
  }, [newText, task, setTasks]);

  return (
    <li
      draggable
      onDragStart={(event) => onDragStart(event, task)}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, task)}
    >
      <input type="checkbox" checked={task.completed} onChange={toggleTask} />
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onBlur={saveEdit}
          onKeyPress={(e) => e.key === "Enter" && saveEdit()}
          autoFocus
          className="edit-input"
        />
      ) : (
        <span onClick={enableEditing}>{task.text}</span>
      )}
      <button onClick={deleteTask}>❌</button>
    </li>
  );
}

export default React.memo(TaskItem);
