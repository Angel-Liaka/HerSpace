
export default function Field({ label, children }) {
  // Display a form field with its label and input
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function EmptyMessage({ children }) {
  // Display a message when there is no content to show
  return <p className="empty-message">{children}</p>;
}
