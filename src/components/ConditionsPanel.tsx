import { Activity } from "lucide-react";
import type { AirportCondition } from "../types";

export function ConditionsPanel({ conditions }: { conditions: AirportCondition[] }) {
  return (
    <section className="enterprise-panel" aria-labelledby="conditions-title">
      <div className="panel-heading">
        <Activity aria-hidden="true" />
        <div>
          <p className="eyebrow">Operations</p>
          <h2 id="conditions-title">Live conditions</h2>
        </div>
      </div>
      <div className="condition-list">
        {conditions.map((condition) => (
          <article className={`condition ${condition.severity}`} key={condition.id}>
            <strong>{condition.title}</strong>
            <p>{condition.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
