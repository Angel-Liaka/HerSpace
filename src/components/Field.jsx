
export default function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function EmptyMessage({ children }) {
  return <p className="empty-message">{children}</p>;
}
