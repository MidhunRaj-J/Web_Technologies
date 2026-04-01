import StudentCard from './components/StudentCard';

const students = [
  { id: 1, name: 'Aarav Kumar', department: 'Computer Science', marks: 92 },
  { id: 2, name: 'Diya Reddy', department: 'Electronics', marks: 86 },
  { id: 3, name: 'Rohan Sharma', department: 'Mechanical', marks: 78 },
  { id: 4, name: 'Sneha Patel', department: 'Information Technology', marks: 95 },
];

export default function App() {
  return (
    <main className="page">
      <h1 className="title">Student Cards</h1>
      <p className="subtitle">Reusable component with props-based data rendering</p>

      <section className="cards-grid">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            name={student.name}
            department={student.department}
            marks={student.marks}
          />
        ))}
      </section>
    </main>
  );
}
