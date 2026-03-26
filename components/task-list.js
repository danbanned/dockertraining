export function TaskList({ tasks = [] }) {
  return (
    <div className="panel">
      <h2>Today&apos;s Tasks</h2>
      <div className="stack">
        {tasks.map((task) => (
          <div key={task.id || task.task} className="task-row">
            <div>
              <strong>{task.task}</strong>
              <p>{task.reason}</p>
            </div>
            <span className={task.completed ? "badge success" : "badge"}>{task.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
