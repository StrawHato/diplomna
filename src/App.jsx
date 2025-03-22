import { useState, useEffect, useMemo, useCallback } from "react";
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

  //Динамічне підключення фонового зображення (lazy load)
  useEffect(() => {
    const img = new Image();
    img.src = "/background.jpg";
    img.onload = () => {
      document.body.style.background = `url("${img.src}") no-repeat center center fixed`;
      document.body.style.backgroundSize = "cover";
    };
  }, []);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskFilter", filter);
  }, [filter]);

  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );
  const completedTasks = useMemo(() => totalTasks - activeTasks, [totalTasks, activeTasks]);

  const handleSetFilter = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <TaskInput setTasks={setTasks} />
      <Filters
        filter={filter}
        setFilter={handleSetFilter}
        totalTasks={totalTasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
      />
      <TaskList tasks={tasks} setTasks={setTasks} filter={filter} />
    </div>
  );
}

export default App;
