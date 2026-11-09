
import {
  Heart,
  CalendarDays,
  Activity,
  ArrowRight,
} from "lucide-react";

import { formatDate } from "../utils/dateHelpers";
import { EmptyMessage } from "./Field";

export default function Dashboard({
  cycles,
  events,
  upcomingEvents,
  nextPeriod,
  setPage,
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">YOUR OVERVIEW</p>
          <h2>Your dashboard</h2>
          <p className="subtext">
            A little space to care for yourself and plan ahead.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card pink">
          <div className="stat-icon">
            <Heart size={20} />
          </div>

          <span>Cycle records</span>
          <strong>{cycles.length}</strong>
          <small>Saved entries</small>
        </article>

        <article className="stat-card purple">
          <div className="stat-icon">
            <CalendarDays size={20} />
          </div>

          <span>Academic events</span>
          <strong>{events.length}</strong>
          <small>In your calendar</small>
        </article>

        <article className="stat-card peach">
          <div className="stat-icon">
            <Activity size={20} />
          </div>

          <span>Next period estimate</span>

          <strong className="date-stat">
            {nextPeriod
              ? formatDate(nextPeriod)
              : "Not available"}
          </strong>

          <small>Based on your latest record</small>
        </article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">COMING UP</p>
            <h3>Academic events</h3>
          </div>

          <button
            className="text-button"
            onClick={() => setPage("Academic Calendar")}
          >
            View calendar <ArrowRight size={15} />
          </button>
        </div>

        {upcomingEvents.length ? (
          upcomingEvents.slice(0, 5).map((event) => (
            <div className="event-row" key={event.id}>
              <div className="event-date">
                <strong>
                  {new Date(
                    `${event.date}T12:00:00`
                  ).getDate()}
                </strong>

                <span>
                  {new Date(
                    `${event.date}T12:00:00`
                  ).toLocaleDateString(undefined, {
                    month: "short",
                  })}
                </span>
              </div>

              <div className="event-info">
                <strong>{event.title}</strong>
                <span>{event.type}</span>
              </div>

              <span className="event-full-date">
                {formatDate(event.date)}
              </span>
            </div>
          ))
        ) : (
          <EmptyMessage>
            No upcoming events yet. Add one in your academic calendar.
          </EmptyMessage>
        )}
      </section>
    </>
  );
}
