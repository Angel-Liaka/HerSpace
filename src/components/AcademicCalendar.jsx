
import { Plus } from "lucide-react";

import Field, { EmptyMessage } from "./Field";
import SmartOverlap from "./SmartOverlap";

import { formatDate, today } from "../utils/dateHelpers";

export default function AcademicCalendar({
  eventTitle,
  setEventTitle,
  eventDate,
  setEventDate,
  eventType,
  setEventType,
  handleAddEvent,
  busy,
  sortedEvents,
  nextPeriod,
  estimatedPeriodEnd,
  overlapEvents,
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <p className="eyebrow">STUDENT LIFE</p>
          <h2>Academic calendar</h2>
          <p className="subtext">
            Keep assignments, exams, and important dates together.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">NEW EVENT</p>
            <h3>Add an academic event</h3>
          </div>
        </div>

        <form
          onSubmit={handleAddEvent}
          className="form-grid event-form"
        >
          <Field label="Event title">
            <input
              value={eventTitle}
              onChange={(event) =>
                setEventTitle(event.target.value)
              }
              placeholder="e.g. Mathematics exam"
              required
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              min={today()}
              value={eventDate}
              onChange={(event) =>
                setEventDate(event.target.value)
              }
              required
            />
          </Field>

          <Field label="Event type">
            <select
              value={eventType}
              onChange={(event) =>
                setEventType(event.target.value)
              }
            >
              {[
                "Assignment",
                "Exam",
                "Class",
                "Study session",
                "Project",
                "Reminder",
                "Other",
              ].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>

          <button className="primary-button form-action" disabled={busy}>
            <Plus size={17} />
            {busy ? "Saving..." : "Add event"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">YOUR SCHEDULE</p>
            <h3>All academic events</h3>
          </div>

          <span className="pill">
            {sortedEvents.length} events
          </span>
        </div>

        {sortedEvents.length ? (
          sortedEvents.map((event) => (
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
          <EmptyMessage>No academic events yet.</EmptyMessage>
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
