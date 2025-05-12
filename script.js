document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-task').addEventListener('click', addTaskTile);

  // Dark mode toggle
  const themeBtn = document.getElementById('toggle-theme');
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
  });

  const container = document.getElementById('task-container');
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(dragging);
    } else {
      container.insertBefore(dragging, afterElement);
    }
    updateTileNumbers();
  });

  function addTaskTile() {
    const tileNumber = container.children.length + 1;

    const tile = document.createElement('div');
    tile.className = 'task-tile';
    tile.draggable = true;

    tile.innerHTML = `
      <div class="tile-header">
        Task #<span class="tile-number">${tileNumber}</span>
        <button class="delete-task">✖</button>
      </div>
      <input type="text" placeholder="Task Title">
      <input type="time">
      <input type="date">
      <textarea placeholder="Description"></textarea>
      <label><input type="checkbox"> Done</label>
    `;

    // Delete task
    tile.querySelector('.delete-task').addEventListener('click', () => {
      tile.remove();
      updateTileNumbers();
    });

    tile.addEventListener('dragstart', () => {
      tile.classList.add('dragging');
    });

    tile.addEventListener('dragend', () => {
      tile.classList.remove('dragging');
      updateTileNumbers();
    });

    container.appendChild(tile);
    updateTileNumbers();
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-tile:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function updateTileNumbers() {
    const tiles = document.querySelectorAll('.task-tile');
    tiles.forEach((tile, index) => {
      const numberSpan = tile.querySelector('.tile-number');
      if (numberSpan) {
        numberSpan.textContent = index + 1;
      }
    });
  }
});
  