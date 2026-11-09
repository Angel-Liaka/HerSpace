
import { Plus } from "lucide-react";

import Field, { EmptyMessage } from "./Field";
import SmartOverlap from "./SmartOverlap";

import { formatDate, today } from "../utils/dateHelpers";

export default function CycleTracker({
  cycleDate,
  setCycleDate,
  cycleLength,
  setCycleLength,
  handleAddCycle,
  busy,
  sortedCycles,
  nextPeriod,
  estimatedPeriodEnd,
  overlapEvents,
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">WELLNESS</p>
          <h2>Cycle tracker</h2>
          <p className="subtext">
            Keep track of your cycle and plan with more confidence.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">NEW RECORD</p>
            <h3>Add a cycle record</h3>
          </div>
        </div>

        <form onSubmit={handleAddCycle} className="form-grid">
          <Field label="Period start date">
            <input
              type="date"
              value={cycleDate}
              max={today()}
              onChange={(event) => setCycleDate(event.target.value)}
              required
            />
          </Field>

          <Field label="Cycle length (days)">
            <input
              type="number"
              min="15"
              max="60"
              value={cycleLength}
              onChange={(event) =>
                setCycleLength(event.target.value)
              }
              required
            />
          </Field>

          <button className="primary-button form-action" disabled={busy}>
            <Plus size={17} />
            {busy ? "Saving..." : "Save cycle"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">YOUR RECORDS</p>
            <h3>Cycle history</h3>
          </div>

          <span className="pill">
            {sortedCycles.length} records
          </span>
        </div>

        {sortedCycles.length ? (
          sortedCycles.map((cycle) => (
            <div className="history-row" key={cycle.id}>
              <span className="history-dot" />

              <strong>{formatDate(cycle.startDate)}</strong>

              <span>{cycle.cycleLength} days</span>
            </div>
          ))
        ) : (
          <EmptyMessage>No cycle records yet.</EmptyMessage>
        )}
      </section>

      <SmartOverlap
        nextPeriod={nextPeriod}
        estimatedPeriodEnd={estimatedPeriodEnd}
        overlapEvents={overlapEvents}
      />
    </>
  );
}
