const API_URL = "http://localhost:3000/tasks";

// Отримання всіх задач
export const fetchTasks = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

// Додавання нової задачі
export const addTask = async (text) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, completed: false }),
  });
  return response.json();
};

// Перемикання стану задачі
export const toggleTask = async (id, completed) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
};

// Видалення задачі
export const deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

//Збереження нового порядку задач
export const reorderTasks = async (orderedIds) => {
  const response = await fetch(`${API_URL}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order: orderedIds }),
  });

  if (!response.ok) {
    throw new Error("Не вдалося оновити порядок завдань");
  }

  return response.json();
};
