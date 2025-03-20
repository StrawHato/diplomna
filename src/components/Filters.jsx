function Filters({ filter, setFilter, totalTasks, activeTasks, completedTasks }) {
    return (
      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          Всі ({totalTasks})
        </button>
        <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
          Активні ({activeTasks})
        </button>
        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>
          Виконані ({completedTasks})
        </button>
      </div>
    );
  }
  
  export default Filters;
  