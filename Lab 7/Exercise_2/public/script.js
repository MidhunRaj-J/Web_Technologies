/* ──────────────────────────────────────────────────────────────
   Online Book Finder — Frontend AJAX Logic
   Each module uses XMLHttpRequest (AJAX) to call Express routes.
   ────────────────────────────────────────────────────────────── */

// ── Pagination state ────────────────────────────────────────────
let currentPage = 1;

// ── Utility: render loading spinner ────────────────────────────
function showSpinner(containerId) {
  document.getElementById(containerId).innerHTML =
    '<div class="spinner">Loading...</div>';
}

// ── Utility: render error message ──────────────────────────────
function showError(containerId, msg) {
  document.getElementById(containerId).innerHTML =
    `<div class="error-msg">Error: ${msg}</div>`;
}

// ── Utility: build a single book card HTML ─────────────────────
function buildBookCard(book) {
  return `
    <div class="book-card">
      <div class="book-title">${escapeHtml(book.title)}</div>
      <div class="book-author">by ${escapeHtml(book.author)}</div>
      <div class="book-meta">
        <span class="badge badge-category">${escapeHtml(book.category)}</span>
        <span class="badge badge-price">&#8377;${book.price}</span>
        <span class="badge badge-rating">&#11088; ${book.rating}</span>
        <span class="badge badge-year">${book.year}</span>
      </div>
    </div>`;
}

// ── Utility: render a book list into a container ───────────────
function renderBooks(containerId, data, label) {
  const container = document.getElementById(containerId);
  if (!data.books || data.books.length === 0) {
    container.innerHTML = '<p class="empty-msg">No books found.</p>';
    return;
  }
  const cards = data.books.map(buildBookCard).join("");
  container.innerHTML = `
    <p class="result-count">${label || `${data.count} book(s) found`}</p>
    <div class="books-grid">${cards}</div>`;
}

// ── Utility: XSS prevention ─────────────────────────────────────
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Utility: generic AJAX GET helper (XMLHttpRequest) ──────────
function ajaxGet(url, onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        onSuccess(data);
      } catch (e) {
        onError("Invalid JSON response from server.");
      }
    } else {
      try {
        const err = JSON.parse(xhr.responseText);
        onError(err.error || `HTTP ${xhr.status}`);
      } catch (_) {
        onError(`HTTP ${xhr.status}`);
      }
    }
  };
  xhr.onerror = function () { onError("Network error — is the server running?"); };
  xhr.send();
}

/* ════════════════════════════════════════════════════════════════
   MODULE 1 — Search Books by Title
   AJAX → GET /books/search?title=<input>
   MongoDB: db.books.find({ title: { $regex: "...", $options: "i" } })
   ════════════════════════════════════════════════════════════════ */
function searchByTitle() {
  const title = document.getElementById("searchInput").value.trim();
  if (!title) {
    alert("Please enter a title to search.");
    return;
  }
  showSpinner("searchResults");
  const url = `/books/search?title=${encodeURIComponent(title)}`;
  ajaxGet(
    url,
    (data) => renderBooks("searchResults", data, `${data.count} result(s) for "${title}"`),
    (err)  => showError("searchResults", err)
  );
}

// Allow Enter key in search input
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchByTitle();
  });

  // Auto-load first page on startup
  loadPage(1);
});

/* ════════════════════════════════════════════════════════════════
   MODULE 2 — Filter Books by Category
   AJAX → GET /books/category/<category>
   MongoDB: db.books.find({ category: "..." })
   ════════════════════════════════════════════════════════════════ */
function filterByCategory() {
  const select = document.getElementById("categorySelect");
  const category = select.value;
  if (!category) {
    alert("Please select a category.");
    return;
  }
  showSpinner("categoryResults");
  const url = `/books/category/${encodeURIComponent(category)}`;
  ajaxGet(
    url,
    (data) => renderBooks("categoryResults", data, `${data.count} book(s) in "${category}"`),
    (err)  => showError("categoryResults", err)
  );
}

/* ════════════════════════════════════════════════════════════════
   MODULE 3 — Sort Books by Price or Rating
   AJAX → GET /books/sort/price  or  GET /books/sort/rating
   MongoDB:
     price  → db.books.find().sort({ price: 1 })
     rating → db.books.find().sort({ rating: -1 })
   ════════════════════════════════════════════════════════════════ */
function sortBooks(field) {
  showSpinner("sortResults");
  ajaxGet(
    `/books/sort/${field}`,
    (data) => {
      const label =
        field === "price"
          ? `${data.count} books — sorted by price (low → high)`
          : `${data.count} books — sorted by rating (high → low)`;
      renderBooks("sortResults", data, label);
    },
    (err) => showError("sortResults", err)
  );
}

/* ════════════════════════════════════════════════════════════════
   MODULE 4 — Top Rated Books
   AJAX → GET /books/top
   MongoDB: db.books.find({ rating: { $gte: 4 } }).limit(5)
   ════════════════════════════════════════════════════════════════ */
function loadTopRated() {
  showSpinner("topResults");
  ajaxGet(
    "/books/top",
    (data) => renderBooks("topResults", data, `Top ${data.count} rated books (rating ≥ 4)`),
    (err)  => showError("topResults", err)
  );
}

/* ════════════════════════════════════════════════════════════════
   MODULE 5 — Pagination (Load More)
   AJAX → GET /books?page=<n>
   MongoDB: db.books.find().skip((page-1)*5).limit(5)
   ════════════════════════════════════════════════════════════════ */
function loadPage(page) {
  showSpinner("paginationResults");
  ajaxGet(
    `/books?page=${page}`,
    (data) => {
      currentPage = data.page;
      document.getElementById("pageLabel").textContent = `Page ${data.page} of ${data.totalPages}`;
      document.getElementById("pageInfo").textContent =
        `Showing ${data.books.length} of ${data.totalBooks} books (page size: ${data.pageSize})`;
      document.getElementById("prevBtn").disabled = data.page <= 1;
      document.getElementById("nextBtn").disabled = !data.hasMore;
      renderBooks(
        "paginationResults",
        data,
        `Page ${data.page}: books ${(data.page - 1) * data.pageSize + 1}–${(data.page - 1) * data.pageSize + data.books.length}`
      );
    },
    (err) => showError("paginationResults", err)
  );
}

function changePage(delta) {
  loadPage(currentPage + delta);
}
