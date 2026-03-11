const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'studentnotes';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

// Connect to MongoDB, then start server
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB — database: ' + DB_NAME);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// ─── POST /notes — Add a new note ─────────────────────────────────────────────
app.post('/notes', async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    if (!title || !subject || !description) {
      return res.status(400).json({ error: 'title, subject, and description are all required.' });
    }

    const note = {
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      created_date: new Date().toISOString().split('T')[0]   // "YYYY-MM-DD"
    };

    const result = await db.collection('notes').insertOne(note);
    res.status(201).json({ message: 'Note added successfully.', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /notes — Retrieve all notes ──────────────────────────────────────────
app.get('/notes', async (req, res) => {
  try {
    const notes = await db.collection('notes').find().sort({ created_date: -1 }).toArray();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /notes/:id — Retrieve a single note ──────────────────────────────────
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await db.collection('notes').findOne({ _id: new ObjectId(req.params.id) });
    if (!note) return res.status(404).json({ error: 'Note not found.' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /notes/:id — Update an existing note ─────────────────────────────────
app.put('/notes/:id', async (req, res) => {
  try {
    const { title, subject, description } = req.body;
    const updateFields = {};

    if (title)       updateFields.title       = title.trim();
    if (subject)     updateFields.subject     = subject.trim();
    if (description) updateFields.description = description.trim();

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'Provide at least one field to update.' });
    }

    /*
      MongoDB operation:
      db.notes.updateOne(
        { _id: ObjectId(id) },
        { $set: { title: "...", description: "..." } }
      )
    */
    const result = await db.collection('notes').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.json({ message: 'Note updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /notes/:id — Delete a note ────────────────────────────────────────
app.delete('/notes/:id', async (req, res) => {
  try {
    const result = await db.collection('notes').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.json({ message: 'Note deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
