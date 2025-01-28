document.addEventListener("DOMContentLoaded", function () {
  // Sélectionne les éléments du DOM
  const taskInput = document.getElementById("new-task");
  const priorityInput = document.getElementById("priority");
  const addTaskButton = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");

  // Charge les tâches depuis le localStorage et les affiche
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) =>
      addTaskToDOM(task.text, task.priority, task.completed)
    );
    sortTasks(); // Trie les tâches après les avoir chargées
  };

  // Ajoute une tâche au DOM
  const addTaskToDOM = (taskText, priority, completed = false) => {
    const li = document.createElement("li");
    li.className = `task ${priority} ${completed ? "completed" : ""}`;
    li.innerHTML = `
        <span class="priority-dot"></span>
        <span>${taskText}</span>
        <button class="delete">Supprimer</button>
      `;

    // Ajoute un écouteur d'événement pour supprimer une tâche
    li.querySelector(".delete").addEventListener("click", () => {
      li.remove();
      saveTasks(); // Sauvegarde les tâches après suppression
    });

    // Ajoute un écouteur d'événement pour marquer une tâche comme complétée
    li.addEventListener("click", () => {
      li.classList.toggle("completed");
      saveTasks(); // Sauvegarde les tâches après modification
    });

    taskList.appendChild(li);
    sortTasks(); // Trie les tâches après en avoir ajouté une nouvelle
  };

  // Sauvegarde les tâches dans le localStorage
  const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll(".task").forEach((task) => {
      tasks.push({
        text: task.querySelector("span:nth-child(2)").textContent,
        priority: task.classList[1],
        completed: task.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Trie les tâches par priorité
  const sortTasks = () => {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.classList[1]] - priorities[a.classList[1]];
    });
    tasks.forEach((task) => taskList.appendChild(task));
  };

  // Ajoute une nouvelle tâche lorsque le bouton est cliqué
  addTaskButton.addEventListener("click", () => {
    if (taskInput.value.trim()) {
      addTaskToDOM(taskInput.value.trim(), priorityInput.value);
      saveTasks(); // Sauvegarde les tâches après en avoir ajouté une nouvelle
      taskInput.value = ""; // Réinitialise le champ de saisie
    }
  });

  // Charge les tâches lors du chargement de la page
  loadTasks();
});

// Recherche de tâches en fonction du texte saisi
const searchInput = document.getElementById("search-task");

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();
  document.querySelectorAll(".task").forEach((task) => {
    const taskText = task
      .querySelector("span:nth-child(2)")
      .textContent.toLowerCase();
    task.style.display = taskText.includes(searchText) ? "" : "none";
  });
});

// Met à jour le nombre de tâches et de tâches complétées
const updateTaskCount = () => {
  const totalTasks = document.querySelectorAll(".task").length;
  const completedTasks = document.querySelectorAll(".task.completed").length;
  document.getElementById(
    "task-count"
  ).textContent = `${totalTasks} tâches en cours, ${completedTasks} tâches terminées`;
};
