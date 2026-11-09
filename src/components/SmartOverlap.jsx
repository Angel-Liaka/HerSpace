
import { Sparkles } from "lucide-react";

import { formatDate } from "../utils/dateHelpers";
import { EmptyMessage } from "./Field";

export default function SmartOverlap({
  nextPeriod,
  estimatedPeriodEnd,
  overlapEvents,
}) {
  return (
    <section className="panel overlap-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">PLAN AHEAD</p>

          <h3>
            <Sparkles size={18} />
            Smart Overlap
          </h3>
        </div>

        <span className="pill">5-day estimate</span>
      </div>

      {!nextPeriod ? (
        <EmptyMessage>
          Add a cycle record to enable Smart Overlap.
        </EmptyMessage>
      ) : (
        <>
          <p className="overlap-description">
            Your estimated period window is{" "}
            <strong>
              {formatDate(nextPeriod)} –{" "}
              {formatDate(estimatedPeriodEnd)}
            </strong>.
          </p>

          {overlapEvents.length ? (
            <>
              <p className="small-note">
                These academic events fall within that window:
              </p>

              {overlapEvents.map((event) => (
                <div className="overlap-event" key={event.id}>
                  <div>
                    <strong>{event.title}</strong>
                    <span>{event.type}</span>
                  </div>

                  <time>{formatDate(event.date)}</time>
                </div>
              ))}

              <p className="tip">
                Planning tip: consider preparing materials in
                advance and breaking revision into manageable
                sessions.
              </p>
            </>
          ) : (
            <EmptyMessage>
              No academic events overlap with this estimated window.
            </EmptyMessage>
          )}

          <p className="disclaimer">
            This is an estimate based on your saved cycle length,
            not a medical prediction.
          </p>
        </>
      )}
    </section>
  );
}
