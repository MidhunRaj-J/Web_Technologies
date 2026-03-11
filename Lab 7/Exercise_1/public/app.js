/* ============================================================
   Student Notes Manager — AJAX Client
   Modules: 1. Add Note  2. View Notes  3. Edit Note  4. Delete
   ============================================================ */

const API = '/notes';

// ── DOM references ────────────────────────────────────────────────────────────
const noteForm       = document.getElementById('note-form');
const titleInput     = document.getElementById('title');
const subjectInput   = document.getElementById('subject');
const descInput      = document.getElementById('description');
const editIdInput    = document.getElementById('edit-id');
const submitBtn      = document.getElementById('submit-btn');
const cancelBtn      = document.getElementById('cancel-btn');
const formMsg        = document.getElementById('form-msg');
const formTitle      = document.getElementById('form-title');
const notesContainer = document.getElementById('notes-container');
const refreshBtn     = document.getElementById('refresh-btn');
const searchInput    = document.getElementById('search-input');

// Modal
const modalOverlay = document.getElementById('modal-overlay');
const modalForm    = document.getElementById('modal-form');
const modalClose   = document.getElementById('modal-close');
const mTitle       = document.getElementById('m-title');
const mSubject     = document.getElementById('m-subject');
const mDesc        = document.getElementById('m-description');
const modalMsg     = document.getElementById('modal-msg');

let allNotes = [];   // local cache for client-side filtering
let editingId = null;

// ── Utility: show feedback message ───────────────────────────────────────────
function showMsg(el, text, type = 'success') {
  el.textContent = text;
  el.className = `message ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3500);
}

// ── MODULE 2: Fetch & render all notes ───────────────────────────────────────
async function loadNotes() {
  notesContainer.innerHTML = '<p class="empty-msg">Loading…</p>';
  try {
    /*
      AJAX request:  GET /notes
      Server returns JSON array of note documents.
    */
    const response = await fetch(API);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    allNotes = await response.json();
    renderNotes(allNotes);
  } catch (err) {
    notesContainer.innerHTML = `<p class="empty-msg" style="color:#e53e3e">Failed to load notes: ${err.message}</p>`;
  }
}

function renderNotes(notes) {
  if (!notes.length) {
    notesContainer.innerHTML = '<p class="empty-msg">No notes found. Add your first note above!</p>';
    return;
  }

  notesContainer.innerHTML = notes.map(note => `
    <div class="note-card" data-id="${note._id}">
      <div class="note-title">${escapeHtml(note.title)}</div>
      <span class="note-subject">${escapeHtml(note.subject)}</span>
      <p class="note-desc">${escapeHtml(note.description)}</p>
      <div class="note-meta">&#128197; Added: ${note.created_date}</div>
      <div class="card-actions">
        <button class="btn btn-edit"   onclick="openEditModal('${note._id}')">&#9998; Edit</button>
        <button class="btn btn-delete" onclick="deleteNote('${note._id}')">&#128465; Delete</button>
      </div>
    </div>
  `).join('');
}

// Escape user content before injecting into HTML (prevent XSS)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Client-side search/filter ─────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { renderNotes(allNotes); return; }
  const filtered = allNotes.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.subject.toLowerCase().includes(query)
  );
  renderNotes(filtered);
});

// ── MODULE 1: Add Note ────────────────────────────────────────────────────────
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title       = titleInput.value.trim();
  const subject     = subjectInput.value.trim();
  const description = descInput.value.trim();

  if (!title || !subject || !description) {
    showMsg(formMsg, 'Please fill in all fields.', 'error');
    return;
  }

  const payload = { title, subject, description };

  /*
    AJAX request body (JSON):
    {
      "title": "MongoDB Basics",
      "subject": "Database",
      "description": "Introduction to MongoDB concepts"
    }
  */
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add note.');

    showMsg(formMsg, 'Note added successfully!', 'success');
    noteForm.reset();
    loadNotes();
  } catch (err) {
    showMsg(formMsg, err.message, 'error');
  }
});

// Cancel edit (inline form — currently uses modal; kept for completeness)
cancelBtn.addEventListener('click', () => {
  noteForm.reset();
  editIdInput.value = '';
  submitBtn.textContent = 'Save Note';
  formTitle.textContent = '➕ Add Note';
  cancelBtn.classList.add('hidden');
});

// ── MODULE 3: Open Edit Modal ─────────────────────────────────────────────────
async function openEditModal(id) {
  editingId = id;
  modalMsg.classList.add('hidden');

  try {
    // Fetch the latest version of this single note
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) throw new Error('Could not fetch note.');
    const note = await response.json();

    mTitle.value   = note.title;
    mSubject.value = note.subject;
    mDesc.value    = note.description;

    modalOverlay.classList.remove('hidden');
    mTitle.focus();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ── MODULE 3: Submit Edit (PUT request) ───────────────────────────────────────
modalForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title       = mTitle.value.trim();
  const subject     = mSubject.value.trim();
  const description = mDesc.value.trim();

  if (!title || !subject || !description) {
    showMsg(modalMsg, 'All fields are required.', 'error');
    return;
  }

  /*
    AJAX request:
    PUT /notes/{id}
    Body: { "title": "MongoDB Advanced", "description": "Aggregation and indexing" }

    MongoDB operation performed server-side:
    db.notes.updateOne(
      { _id: ObjectId(id) },
      { $set: { title: "MongoDB Advanced", description: "Aggregation and indexing" } }
    )
  */
  try {
    const response = await fetch(`${API}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, description })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Update failed.');

    showMsg(modalMsg, 'Note updated successfully!', 'success');
    setTimeout(() => {
      closeModal();
      loadNotes();
    }, 1200);
  } catch (err) {
    showMsg(modalMsg, err.message, 'error');
  }
});

// ── MODULE 4: Delete Note ─────────────────────────────────────────────────────
async function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) return;

  try {
    /*
      AJAX request: DELETE /notes/{id}
    */
    const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Delete failed.');

    loadNotes();   // refresh the list
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ── Close modal ───────────────────────────────────────────────────────────────
function closeModal() {
  modalOverlay.classList.add('hidden');
  modalForm.reset();
  editingId = null;
}

modalClose.addEventListener('click', closeModal);

// Close modal when clicking backdrop
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Keyboard: Escape closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Refresh button ────────────────────────────────────────────────────────────
refreshBtn.addEventListener('click', loadNotes);

// ── Initial load ──────────────────────────────────────────────────────────────
loadNotes();
