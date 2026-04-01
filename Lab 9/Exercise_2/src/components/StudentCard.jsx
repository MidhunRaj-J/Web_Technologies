export default function StudentCard({ name, department, marks }) {
  return (
    <article className="student-card">
      <h2 className="student-name">{name}</h2>
      <p>
        <span className="label">Department:</span> {department}
      </p>
      <p>
        <span className="label">Marks:</span> {marks}
      </p>
    </article>
  );
}
