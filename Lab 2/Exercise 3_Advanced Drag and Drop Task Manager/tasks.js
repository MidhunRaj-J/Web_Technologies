let taskId = 0;

function addTask() {
  const taskName = document.getElementById('taskName').value.trim();
  if (!taskName) return;

  const task = document.createElement('div');
  task.className = 'task';
  task.draggable = true;
  task.id = 'task-' + taskId++;
  const date = new Date().toLocaleDateString();
  task.innerHTML = `<strong>${taskName}</strong><br><small>${date}</small>`;
  task.addEventListener('dragstart', drag);

  document.getElementById('todo').appendChild(task);
  document.getElementById('taskName').value = '';
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const task = document.getElementById(data);
  event.target.closest('.column').appendChild(task);

  if (event.target.closest('.column').id === 'completed') {
    task.classList.add('completed');
    document.getElementById('message').textContent = 'Task Completed Successfully';
  } else {
    task.classList.remove('completed');
    document.getElementById('message').textContent = '';
  }
}