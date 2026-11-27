
export function today() {
  // Get today's date in YYYY-MM-DD format
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function addDays(dateString, days) {
  // Add a specified number of days to a date
  const date = new Date(`${dateString}T12:00:00`);

  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function formatDate(dateString) {
  // Handle missing dates before formatting
  if (!dateString) {
    return "No date";
  }

  // Display dates in a readable format
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}
