import { memo } from "react";
import { ClipboardList } from "lucide-react";
import type { StaffTask } from "../services/DemoDataGenerator";

function TaskQueueComponent({ tasks }: { tasks: StaffTask[] }) {
  return (
    <section className="operations-card task-queue" aria-labelledby="task-queue-title">
      <div className="panel-heading compact">
        <ClipboardList aria-hidden="true" />
        <div>
          <p className="eyebrow">Staff</p>
          <h3 id="task-queue-title">Task queue</h3>
        </div>
      </div>
      <div className="operations-list compact-list">
        {tasks.slice(0, 8).map((task) => (
          <article className={"task-row " + task.priority} key={task.id}>
            <strong>{task.type}</strong>
            <p>{task.location}</p>
            <span>{task.priority}</span>
            <small>{task.assigned} - {task.status} - ETA {task.etaMinutes} min</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export const TaskQueue = memo(TaskQueueComponent);
