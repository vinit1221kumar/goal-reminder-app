"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/FormField";
import { useStore } from "@/store/useStore";

export function EventForm() {
  const router = useRouter();
  const addEvent = useStore((state) => state.addEvent);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState(() => format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [titleError, setTitleError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const minDate = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    let valid = true;

    setTitleError("");
    setEndDateError("");
    setSubmitError("");

    if (!trimmedTitle) {
      setTitleError("Title is required.");
      valid = false;
    }

    if (!endDate) {
      setEndDateError("End date is required.");
      valid = false;
    } else if (endDate < minDate) {
      setEndDateError("End date cannot be earlier than today.");
      valid = false;
    }

    if (!valid) return;

    const created = addEvent(trimmedTitle, endDate);
    if (!created) {
      setSubmitError("Could not create event. Check your values and try again.");
      return;
    }

    setTitle("");
    setEndDate(format(addDays(new Date(), 7), "yyyy-MM-dd"));
    setTitleError("");
    setEndDateError("");
    setSubmitError("");
    router.push(`/event/${created.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 text-2xl" aria-hidden>✨</span>
        <div>
          <h2 className="text-lg font-bold">New event</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Name your exam or deadline and pick a due date to start the countdown.
          </p>
          {submitError ? <p className="form-error mt-2">{submitError}</p> : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <FormField
          label="Title"
          hint="e.g. Biology exam, Math assignment"
          error={titleError}
          required
          htmlFor="event-title"
        >
          <input
            id="event-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) setTitleError("");
            }}
            placeholder="Biology exam"
            className="form-field"
            maxLength={80}
            aria-invalid={Boolean(titleError)}
            aria-describedby="event-title-meta"
            required
          />
        </FormField>

        <FormField
          label="Due date"
          hint="Countdown starts from today."
          error={endDateError}
          required
          htmlFor="event-end-date"
        >
          <input
            id="event-end-date"
            type="date"
            value={endDate}
            min={minDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              if (endDateError) setEndDateError("");
            }}
            className="form-field"
            aria-invalid={Boolean(endDateError)}
            aria-describedby="event-end-date-meta"
            required
          />
        </FormField>

        <button
          type="submit"
          className="btn-primary anim-press mt-auto focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
        >
          🚀 Add event
        </button>
      </div>
    </form>
  );
}
