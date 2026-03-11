// Run: node seed.js
// Inserts 20 sample books into the 'books' collection.

const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "bookfinderdb";

const sampleBooks = [
  { title: "JavaScript Essentials", author: "John Smith", category: "Programming", price: 450, rating: 4.5, year: 2023 },
  { title: "Advanced JavaScript Patterns", author: "Alice Brown", category: "Programming", price: 520, rating: 4.8, year: 2022 },
  { title: "MongoDB in Action", author: "Kyle Banker", category: "Database", price: 380, rating: 4.3, year: 2021 },
  { title: "Learning Python", author: "Mark Lutz", category: "Programming", price: 490, rating: 4.6, year: 2023 },
  { title: "React Up and Running", author: "Stoyan Stefanov", category: "Web Development", price: 430, rating: 4.2, year: 2022 },
  { title: "Node.js Design Patterns", author: "Mario Casciaro", category: "Programming", price: 560, rating: 4.7, year: 2021 },
  { title: "HTML and CSS Design", author: "Jon Duckett", category: "Web Development", price: 350, rating: 4.1, year: 2020 },
  { title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", price: 410, rating: 4.9, year: 2019 },
  { title: "Design Patterns", author: "Gang of Four", category: "Software Engineering", price: 600, rating: 4.8, year: 2018 },
  { title: "Data Structures and Algorithms", author: "Thomas Cormen", category: "Computer Science", price: 720, rating: 4.7, year: 2020 },
  { title: "Python Machine Learning", author: "Sebastian Raschka", category: "Data Science", price: 540, rating: 4.5, year: 2022 },
  { title: "Deep Learning with Python", author: "Francois Chollet", category: "Data Science", price: 580, rating: 4.6, year: 2021 },
  { title: "Database System Concepts", author: "Abraham Silberschatz", category: "Database", price: 670, rating: 4.4, year: 2020 },
  { title: "Operating System Concepts", author: "Galvin Silberschatz", category: "Computer Science", price: 690, rating: 4.3, year: 2021 },
  { title: "Computer Networks", author: "Andrew Tanenbaum", category: "Networking", price: 620, rating: 4.5, year: 2019 },
  { title: "Web Development with Django", author: "William Vincent", category: "Web Development", price: 390, rating: 3.9, year: 2022 },
  { title: "TypeScript Handbook", author: "Steve Fenton", category: "Programming", price: 300, rating: 3.8, year: 2023 },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Programming", price: 280, rating: 4.4, year: 2022 },
  { title: "SQL Performance Explained", author: "Markus Winand", category: "Database", price: 340, rating: 4.2, year: 2020 },
  { title: "The Pragmatic Programmer", author: "David Thomas", category: "Software Engineering", price: 470, rating: 4.8, year: 2019 }
];

async function seed() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("books");

    // Drop existing data to avoid duplicates on re-run
    await collection.deleteMany({});
    const result = await collection.insertMany(sampleBooks);
    console.log(`Seeded ${result.insertedCount} books into '${DB_NAME}.books'`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await client.close();
  }
}

seed();
