// ─────────────────────────────────────────────
// In a real app, these functions would make
// AJAX (fetch) calls to an Express/Node backend
// which connects to MongoDB.
//
// Here, localStorage is used to simulate MongoDB.
// ─────────────────────────────────────────────

const STORAGE_KEY = 'student_notes';

// ── Utility: generate simple unique ID (simulates ObjectId)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ── Utility: get today's date as YYYY-MM-DD
function today() {
  return new Date().toISOString().split('T')[0];
}

// ── Load all notes from localStorage (simulates: GET /notes)
function getNotes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// ── Save notes array back to localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ─────────────────────────────────────────────
// 1. ADD NOTE  →  POST /notes
// AJAX would send:
// fetch('/notes', {
//   method: 'POST',
//   headers: {'Content-Type': 'application/json'},
//   body: JSON.stringify({ title, subject, description })
// })
// ─────────────────────────────────────────────
function addNote() {
  const title       = document.getElementById('title').value.trim();
  const subject     = document.getElementById('subject').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !subject || !description) {
    showToast('Please fill in all fields.', true);
    return;
  }

  const newNote = {
    _id:          generateId(),      // MongoDB uses ObjectId
    title,
    subject,
    description,
    created_date: today()
  };

  const notes = getNotes();
  notes.unshift(newNote);            // db.notes.insertOne(newNote)
  saveNotes(notes);

  // Clear form
  document.getElementById('title').value       = '';
  document.getElementById('subject').value     = '';
  document.getElementById('description').value = '';

  showToast('Note added successfully!');
  renderNotes();
}

// ─────────────────────────────────────────────
// 2. VIEW NOTES  →  GET /notes
// AJAX would send:
// fetch('/notes')
//   .then(res => res.json())
//   .then(notes => renderNotes(notes))
// ─────────────────────────────────────────────
function renderNotes() {
  const notes     = getNotes();
  const container = document.getElementById('notes-container');
  const countEl   = document.getElementById('note-count');

  countEl.textContent = notes.length === 0 ? '' : `${notes.length} note${notes.length > 1 ? 's' : ''}`;

  if (notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        No notes yet. Add your first note above! 📝
      </div>`;
    return;
  }

  container.innerHTML = notes.map(note => `
    <div class="note-card" id="card-${note._id}">
      <div class="note-title">${escapeHtml(note.title)}</div>
      <span class="note-subject">${escapeHtml(note.subject)}</span>
      <div class="note-desc">${escapeHtml(note.description)}</div>
      <div class="note-date">📅 ${note.created_date}</div>
      <div class="note-actions">
        <button class="btn btn-warning" onclick="openEdit('${note._id}')">✏️ Edit</button>
        <button class="btn btn-danger"  onclick="deleteNote('${note._id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// 3. EDIT NOTE  →  PUT /notes/{id}
// AJAX would send:
// fetch(`/notes/${id}`, {
//   method: 'PUT',
//   headers: {'Content-Type': 'application/json'},
//   body: JSON.stringify({ title, subject, description })
// })
// ─────────────────────────────────────────────
function openEdit(id) {
  const notes = getNotes();
  const note  = notes.find(n => n._id === id);
  if (!note) return;

  document.getElementById('edit-id').value          = note._id;
  document.getElementById('edit-title').value       = note.title;
  document.getElementById('edit-subject').value     = note.subject;
  document.getElementById('edit-description').value = note.description;

  document.getElementById('editModal').classList.add('active');
}

function saveEdit() {
  const id          = document.getElementById('edit-id').value;
  const title       = document.getElementById('edit-title').value.trim();
  const subject     = document.getElementById('edit-subject').value.trim();
  const description = document.getElementById('edit-description').value.trim();

  if (!title || !subject || !description) {
    showToast('All fields are required.', true);
    return;
  }

  let notes = getNotes();
  notes = notes.map(n => {
    if (n._id === id) {
      // db.notes.updateOne({ _id: ObjectId(id) },
      //   { $set: { title, subject, description } })
      return { ...n, title, subject, description };
    }
    return n;
  });

  saveNotes(notes);
  closeModal();
  showToast('Note updated successfully!');
  renderNotes();
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('editModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─────────────────────────────────────────────
// 4. DELETE NOTE  →  DELETE /notes/{id}
// AJAX would send:
// fetch(`/notes/${id}`, { method: 'DELETE' })
// ─────────────────────────────────────────────
function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) return;

  let notes = getNotes();
  notes = notes.filter(n => n._id !== id);  // db.notes.deleteOne({ _id: ObjectId(id) })
  saveNotes(notes);

  showToast('Note deleted.');
  renderNotes();
}

// ── Toast notification
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'show' + (isError ? ' error' : '');
  setTimeout(() => { toast.className = ''; }, 2800);
}

// ── Prevent XSS when rendering user input
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Initial render on page load
renderNotes();
