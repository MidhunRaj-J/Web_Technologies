const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "bookfinderdb";
const PAGE_SIZE = 5;

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI)
  .then((client) => {
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB — database: ${DB_NAME}`);
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ─────────────────────────────────────────────────────────
// Module 1 — Search Books by Title
// GET /books/search?title=javascript
// db.books.find({ title: { $regex: "javascript", $options: "i" } })
// ─────────────────────────────────────────────────────────
app.get("/books/search", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Query parameter 'title' is required." });
    }
    const books = await db
      .collection("books")
      .find({ title: { $regex: title.trim(), $options: "i" } })
      .toArray();
    res.json({ count: books.length, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// Module 2 — Filter Books by Category
// GET /books/category/programming
// db.books.find({ category: "Programming" })
// ─────────────────────────────────────────────────────────
app.get("/books/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    // Case-insensitive match using regex so "programming" matches "Programming"
    const books = await db
      .collection("books")
      .find({ category: { $regex: `^${category}$`, $options: "i" } })
      .toArray();
    res.json({ count: books.length, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// Module 3 — Sort Books by Price or Rating
// GET /books/sort/price  → db.books.find().sort({ price: 1 })
// GET /books/sort/rating → db.books.find().sort({ rating: -1 })
// ─────────────────────────────────────────────────────────
app.get("/books/sort/:field", async (req, res) => {
  try {
    const { field } = req.params;
    const allowed = { price: 1, rating: -1 };
    if (!allowed.hasOwnProperty(field)) {
      return res
        .status(400)
        .json({ error: "Sort field must be 'price' or 'rating'." });
    }
    const sortOrder = {};
    sortOrder[field] = allowed[field];
    const books = await db.collection("books").find().sort(sortOrder).toArray();
    res.json({ sortedBy: field, order: allowed[field] === 1 ? "ascending" : "descending", count: books.length, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// Module 4 — Top Rated Books
// GET /books/top
// db.books.find({ rating: { $gte: 4 } }).limit(5)
// ─────────────────────────────────────────────────────────
app.get("/books/top", async (req, res) => {
  try {
    const books = await db
      .collection("books")
      .find({ rating: { $gte: 4 } })
      .sort({ rating: -1 })
      .limit(5)
      .toArray();
    res.json({ count: books.length, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────
// Module 5 — Pagination (Load More)
// GET /books?page=2
// db.books.find().skip(5).limit(5)
// ─────────────────────────────────────────────────────────
app.get("/books", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * PAGE_SIZE;
    const total = await db.collection("books").countDocuments();
    const books = await db
      .collection("books")
      .find()
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray();
    const totalPages = Math.ceil(total / PAGE_SIZE);
    res.json({
      page,
      pageSize: PAGE_SIZE,
      totalBooks: total,
      totalPages,
      hasMore: page < totalPages,
      books,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
