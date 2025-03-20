import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import Filters from "./components/Filters";
import "./App.css";
import { fetchTasks } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem("taskFilter") || "all";
  });

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskFilter", filter);
  }, [filter]);

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = totalTasks - activeTasks;

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <TaskInput setTasks={setTasks} />
      <Filters
        filter={filter}
        setFilter={setFilter}
        totalTasks={totalTasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
      />
      <TaskList tasks={tasks} setTasks={setTasks} filter={filter} />
    </div>
  );
}

export default App;