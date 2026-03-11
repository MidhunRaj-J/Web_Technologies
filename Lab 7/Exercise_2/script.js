// ─────────────────────────────────────────────────────────────────
//  Online Book Finder — script.js
//
//  Currently uses localStorage to simulate a MongoDB backend.
//  Each function includes the AJAX fetch() call and MongoDB query
//  as comments so the real backend can be connected later.
//
//  To connect to a real backend (Node.js + Express + MongoDB):
//    1. Remove the localStorage simulation block in each function.
//    2. Uncomment the fetch() call in each function.
//    3. Make sure the Express server is running on http://localhost:3000
// ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'book_finder_books';
const PAGE_SIZE    = 5;
let   currentPage  = 1;
let   currentBooks = [];   // holds the active result set for pagination

// ── Seed sample data on first load
(function seedData() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  const books = [
    { _id: uid(), title: "JavaScript Essentials",    author: "John Smith",    category: "Programming",  price: 450, rating: 4.5, year: 2023 },
    { _id: uid(), title: "Python for Beginners",     author: "Alice Johnson",  category: "Programming",  price: 320, rating: 4.2, year: 2022 },
    { _id: uid(), title: "Data Structures in C++",   author: "Bob Williams",   category: "Programming",  price: 500, rating: 3.8, year: 2021 },
    { _id: uid(), title: "React & Node.js Guide",    author: "Sara Lee",       category: "Programming",  price: 599, rating: 4.7, year: 2023 },
    { _id: uid(), title: "A Brief History of Time",  author: "Stephen Hawking",category: "Science",      price: 280, rating: 4.9, year: 1988 },
    { _id: uid(), title: "Cosmos",                   author: "Carl Sagan",     category: "Science",      price: 350, rating: 4.8, year: 1980 },
    { _id: uid(), title: "The Origin of Species",    author: "Charles Darwin", category: "Science",      price: 200, rating: 4.3, year: 1859 },
    { _id: uid(), title: "Calculus Made Easy",       author: "Silvanus Thompson", category: "Mathematics", price: 260, rating: 4.1, year: 1910 },
    { _id: uid(), title: "Linear Algebra Done Right",author: "Sheldon Axler",  category: "Mathematics",  price: 480, rating: 4.6, year: 2015 },
    { _id: uid(), title: "Sapiens",                  author: "Yuval Noah Harari", category: "History",   price: 399, rating: 4.7, year: 2011 },
    { _id: uid(), title: "The Guns of August",       author: "Barbara Tuchman",category: "History",      price: 310, rating: 4.0, year: 1962 },
    { _id: uid(), title: "1984",                     author: "George Orwell",  category: "Fiction",      price: 199, rating: 4.8, year: 1949 },
    { _id: uid(), title: "To Kill a Mockingbird",    author: "Harper Lee",     category: "Fiction",      price: 220, rating: 4.6, year: 1960 },
    { _id: uid(), title: "The Great Gatsby",         author: "F. Scott Fitzgerald", category: "Fiction", price: 180, rating: 3.9, year: 1925 },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
})();

// ── Helpers ──────────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getAllBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─────────────────────────────────────────────────────────────────
// 1. SEARCH BOOKS BY TITLE
//    AJAX  : GET /books/search?title=<query>
//    MongoDB: db.books.find({ title: { $regex: query, $options: "i" } })
// ─────────────────────────────────────────────────────────────────
function searchByTitle() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) { showToast('Please enter a search term.'); return; }

  /* ── Real AJAX (uncomment when backend is ready) ──────────────
  fetch(`/books/search?title=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => renderResults(data, `Search: "${query}"`))
    .catch(err => showToast('Server error: ' + err.message));
  return;
  ────────────────────────────────────────────────────────────── */

  // Simulate: db.books.find({ title: { $regex: query, $options: "i" } })
  const regex   = new RegExp(query, 'i');
  const results = getAllBooks().filter(b => regex.test(b.title));
  renderResults(results, `Search: "${query}"`);
}

// ─────────────────────────────────────────────────────────────────
// 2. FILTER BOOKS BY CATEGORY
//    AJAX  : GET /books/category/<category>
//    MongoDB: db.books.find({ category: "<Category>" })
// ─────────────────────────────────────────────────────────────────
function filterByCategory() {
  const category = document.getElementById('category-select').value;
  if (!category) { showToast('Please select a category.'); return; }

  /* ── Real AJAX (uncomment when backend is ready) ──────────────
  fetch(`/books/category/${encodeURIComponent(category)}`)
    .then(res => res.json())
    .then(data => renderResults(data, `Category: ${category}`))
    .catch(err => showToast('Server error: ' + err.message));
  return;
  ────────────────────────────────────────────────────────────── */

  // Simulate: db.books.find({ category: category })
  const results = getAllBooks().filter(b => b.category === category);
  renderResults(results, `Category: ${category}`);
}

// ─────────────────────────────────────────────────────────────────
// 3. SORT BOOKS
//    AJAX  : GET /books/sort/price  OR  GET /books/sort/rating
//    MongoDB:
//      db.books.find().sort({ price: 1 })      — price low→high
//      db.books.find().sort({ price: -1 })     — price high→low
//      db.books.find().sort({ rating: -1 })    — rating best first
//      db.books.find().sort({ rating: 1 })     — rating low first
// ─────────────────────────────────────────────────────────────────
function sortBooks(field, order) {
  const label = `${field === 'price' ? 'Price' : 'Rating'} ${order === 1 ? '↑' : '↓'}`;

  /* ── Real AJAX (uncomment when backend is ready) ──────────────
  fetch(`/books/sort/${field}?order=${order}`)
    .then(res => res.json())
    .then(data => renderResults(data, `Sorted by ${label}`))
    .catch(err => showToast('Server error: ' + err.message));
  return;
  ────────────────────────────────────────────────────────────── */

  // Simulate: db.books.find().sort({ [field]: order })
  const results = [...getAllBooks()].sort((a, b) => (a[field] - b[field]) * order);
  renderResults(results, `Sorted by ${label}`);
}

// ─────────────────────────────────────────────────────────────────
// 4. TOP RATED BOOKS
//    AJAX  : GET /books/top
//    MongoDB: db.books.find({ rating: { $gte: 4 } }).limit(5)
// ─────────────────────────────────────────────────────────────────
function loadTopRated() {
  /* ── Real AJAX (uncomment when backend is ready) ──────────────
  fetch('/books/top')
    .then(res => res.json())
    .then(data => renderResults(data, 'Top Rated (rating ≥ 4)'))
    .catch(err => showToast('Server error: ' + err.message));
  return;
  ────────────────────────────────────────────────────────────── */

  // Simulate: db.books.find({ rating: { $gte: 4 } }).sort({ rating: -1 }).limit(5)
  const results = getAllBooks()
    .filter(b => b.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  renderResults(results, 'Top Rated (rating ≥ 4)');
}

// ─────────────────────────────────────────────────────────────────
// 5. PAGINATION
//    AJAX  : GET /books?page=<page>
//    MongoDB: db.books.find().skip((page-1)*5).limit(5)
// ─────────────────────────────────────────────────────────────────
function loadPage(page) {
  /* ── Real AJAX (uncomment when backend is ready) ──────────────
  fetch(`/books?page=${page}`)
    .then(res => res.json())
    .then(data => {
      currentBooks = data.books;      // full result from server
      currentPage  = data.currentPage;
      renderPage();
    })
    .catch(err => showToast('Server error: ' + err.message));
  return;
  ────────────────────────────────────────────────────────────── */

  // Simulate: db.books.find().skip((page-1)*5).limit(5)
  const start = (page - 1) * PAGE_SIZE;
  const slice = currentBooks.slice(start, start + PAGE_SIZE);
  displayBooks(slice);
  updatePagination();
}

function changePage(delta) {
  const totalPages = Math.ceil(currentBooks.length / PAGE_SIZE);
  const newPage    = currentPage + delta;
  if (newPage < 1 || newPage > totalPages) return;
  currentPage = newPage;
  loadPage(currentPage);
  document.getElementById('books-container').scrollIntoView({ behavior: 'smooth' });
}

// ─────────────────────────────────────────────────────────────────
// RENDER HELPERS
// ─────────────────────────────────────────────────────────────────

// Called by all query functions — stores results then shows page 1
function renderResults(books, label) {
  currentBooks = books;
  currentPage  = 1;

  const countEl = document.getElementById('result-count');
  countEl.textContent = `${books.length} book${books.length !== 1 ? 's' : ''} found`;

  if (books.length === 0) {
    document.getElementById('books-container').innerHTML =
      `<div class="empty-state">No books found for <strong>${label}</strong>.</div>`;
    document.getElementById('pagination-bar').style.display = 'none';
    return;
  }

  loadPage(1);
  showToast(`${books.length} result(s) for ${label}`);
}

function displayBooks(books) {
  const container = document.getElementById('books-container');
  container.innerHTML = books.map(b => `
    <div class="book-card">
      <div class="book-title">${escapeHtml(b.title)}</div>
      <div class="book-author">by ${escapeHtml(b.author)}</div>
      <div class="book-meta">
        <span class="badge badge-category">${escapeHtml(b.category)}</span>
        <span class="badge badge-price">₹${b.price}</span>
        <span class="badge badge-rating">⭐ ${b.rating}</span>
        <span class="badge badge-year">${b.year}</span>
      </div>
    </div>
  `).join('');
}

function updatePagination() {
  const totalPages = Math.ceil(currentBooks.length / PAGE_SIZE);
  const bar        = document.getElementById('pagination-bar');

  if (totalPages <= 1) { bar.style.display = 'none'; return; }

  bar.style.display = 'flex';
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Prevent XSS when rendering book data
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Show all books on initial load ──────────────────────────────
window.onload = function () {
  renderResults(getAllBooks(), 'All Books');
};
