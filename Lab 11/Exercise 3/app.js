const EventEmitter = require("events");

const appEvents = new EventEmitter();

console.log("--- Node.js Event-Driven Programming Demo ---");

appEvents.on("userRegistered", (user) => {
  console.log(`[Listener 1] Welcome, ${user.name}!`);
});

appEvents.on("userRegistered", (user) => {
  console.log(`[Listener 2] User ID ${user.id} saved for ${user.name}.`);
});

appEvents.on("orderPlaced", (orderId, amount) => {
  console.log(`[Order Listener] Order #${orderId} placed for Rs.${amount}.`);
});

appEvents.on("taskCompleted", (taskName) => {
  console.log(`[Task Listener] ${taskName} completed asynchronously.`);
});

appEvents.emit("userRegistered", { id: 101, name: "Asha" });
appEvents.emit("orderPlaced", "ORD-501", 2499);

setTimeout(() => {
  appEvents.emit("taskCompleted", "Email Notification");
}, 1000);

setTimeout(() => {
  appEvents.emit("taskCompleted", "Database Backup");
}, 1500);

console.log("Main thread continues while async events run...");
