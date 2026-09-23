import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const emptyForm = { name: "", age: "", course: "", email: "" };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) throw new Error("Unable to load students.");
      setStudents(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/students`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load students.");
        return response.json();
      })
      .then((data) => {
        if (active) setStudents(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const saveStudent = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, age: Number(form.age) };
    const path = editingId ? `/students/${editingId}` : "/students";

    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Unable to save student.");
      setForm(emptyForm);
      setEditingId(null);
      await loadStudents();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      age: String(student.age),
      course: student.course,
      email: student.email,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm("Delete this student?")) return;
    setError("");
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete student.");
      await loadStudents();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ACADEMIC RECORDS</p>
          <h1>Student directory</h1>
          <p className="subtitle">Manage enrolment details from one place.</p>
        </div>
        <div className="stat"><strong>{students.length}</strong><span>students</span></div>
      </header>

      <section className="workspace">
        <form className="student-form" onSubmit={saveStudent}>
          <div className="section-heading">
            <div><p className="eyebrow">{editingId ? "EDIT RECORD" : "NEW RECORD"}</p><h2>{editingId ? "Update student" : "Add a student"}</h2></div>
            {editingId && <button className="link-button" type="button" onClick={cancelEdit}>Cancel</button>}
          </div>
          <label>Name<input name="name" value={form.name} onChange={updateField} required placeholder="Full name" /></label>
          <div className="form-row">
            <label>Age<input name="age" type="number" min="1" max="120" value={form.age} onChange={updateField} required placeholder="Age" /></label>
            <label>Course<input name="course" value={form.course} onChange={updateField} required placeholder="Course" /></label>
          </div>
          <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required placeholder="student@example.com" /></label>
          <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add student"}</button>
        </form>

        <section className="student-list">
          <div className="section-heading"><div><p className="eyebrow">DIRECTORY</p><h2>All students</h2></div><button className="refresh-button" onClick={loadStudents} disabled={loading}>Refresh</button></div>
          {error && <p className="error-message">{error} Check that the backend is running on port 8000.</p>}
          {loading ? <p className="empty-state">Loading records...</p> : students.length === 0 ? <p className="empty-state">No students yet. Add the first record.</p> : (
            <div className="table-wrap"><table><thead><tr><th>Name</th><th>Course</th><th>Age</th><th>Email</th><th aria-label="Actions" /></tr></thead><tbody>
              {students.map((student) => <tr key={student.id}><td><strong>{student.name}</strong><small>#{student.id}</small></td><td>{student.course}</td><td>{student.age}</td><td>{student.email}</td><td className="actions"><button onClick={() => editStudent(student)}>Edit</button><button className="danger" onClick={() => deleteStudent(student.id)}>Delete</button></td></tr>)}
            </tbody></table></div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
