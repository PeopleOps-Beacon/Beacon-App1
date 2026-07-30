import { useEffect, useMemo, useState } from "react";
import { Command, Search, X } from "lucide-react";

export type CommandCenterAction = {
  id: string;
  label: string;
  description: string;
  group: "Navigate" | "Prepare" | "Review";
  onRun: () => void;
};

type Props = {
  actions: CommandCenterAction[];
  isOpen: boolean;
  onClose: () => void;
};

export function CommandCenter({ actions, isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const filteredActions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return actions;
    }

    return actions.filter((action) =>
      [action.label, action.description, action.group].join(" ").toLowerCase().includes(normalizedQuery)
    );
  }, [actions, query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const runAction = (action: CommandCenterAction) => {
    action.onRun();
    onClose();
  };

  return (
    <div className="command-center-backdrop" role="presentation">
      <section className="command-center motion-modal" aria-labelledby="command-center-title" role="dialog" aria-modal="true">
        <div className="command-center-heading">
          <div>
            <p className="eyebrow">Command Center</p>
            <h2 id="command-center-title">Move through Beacon faster</h2>
          </div>
          <button aria-label="Close command center" onClick={onClose} type="button">
            <X aria-hidden="true" />
          </button>
        </div>
        <label className="command-center-search">
          <Search aria-hidden="true" />
          <input
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search actions, destinations, demos, or settings"
            type="search"
            value={query}
          />
          <kbd>Esc</kbd>
        </label>
        <div className="command-action-list" role="listbox">
          {filteredActions.length === 0 ? (
            <div className="empty-state" role="status">
              No matching actions. Try search, demo, settings, or dashboard.
            </div>
          ) : null}
          {filteredActions.map((action) => (
            <button className="command-action" key={action.id} onClick={() => runAction(action)} type="button">
              <Command aria-hidden="true" />
              <span>
                <strong>{action.label}</strong>
                <small>{action.description}</small>
              </span>
              <em>{action.group}</em>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
