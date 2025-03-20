import { useState } from "react";

function TaskInput({ setTasks }) {
  const [input, setInput] = useState("");

  const addTask = async () => {
    if (!input.trim()) return; // Не додаємо порожні задачі

    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, completed: false }),
    });

    const newTask = await response.json();
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setInput(""); // Очищаємо поле введення після додавання
  };

  return (
    <div className="todo-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введіть завдання..."
      />
      <button onClick={addTask}>Додати</button>
    </div>
  );
}

export default TaskInput;
