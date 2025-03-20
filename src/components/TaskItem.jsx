import { useState } from "react";

function TaskItem({ task, setTasks, onDragStart, onDragOver, onDrop }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const toggleTask = async () => {
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
  };

  const deleteTask = async () => {
    if (window.confirm("Ви впевнені, що хочете видалити це завдання?")) {
      await fetch(`http://localhost:3000/tasks/${task.id}`, { method: "DELETE" });
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const saveEdit = async () => {
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
  };

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

export default TaskItem;
