window.onload = function () {
  loadSavedSchedules();
};

function addRow(time = "", activity = "", done = false) {
  var table = document.getElementById("schedule");
  var row = table.insertRow();

  var timeCell = row.insertCell(0);
  var activityCell = row.insertCell(1);
  var doneCell = row.insertCell(2);

  var timeInput = document.createElement("input");
  timeInput.value = time;
  timeCell.appendChild(timeInput);

  var activityInput = document.createElement("input");
  activityInput.value = activity;
  activityCell.appendChild(activityInput);

  var doneCheckbox = document.createElement("input");
  doneCheckbox.type = "checkbox";
  doneCheckbox.checked = done;
  doneCell.appendChild(doneCheckbox);
}

function saveSchedule() {
  var name = document.getElementById("save-name").value.trim();
  var title = document.getElementById("planner-title").textContent;
  var table = document.getElementById("schedule");

  if (!name) {
    alert("Please enter a name for the schedule.");
    return;
  }

  var schedule = {
    title: title,
    tasks: []
  };

  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var time = row.cells[0].querySelector("input").value;
    var activity = row.cells[1].querySelector("input").value;
    var done = row.cells[2].querySelector("input").checked;

    schedule.tasks.push({ time, activity, done });
  }

  localStorage.setItem("schedule-" + name, JSON.stringify(schedule));
  alert("Schedule saved!");
  loadSavedSchedules();
  window.location.reload(); // Clears planner after saving
}

function loadSavedSchedules() {
  var list = document.getElementById("schedule-list");
  list.innerHTML = "";

  for (var key in localStorage) {
    if (key.startsWith("schedule-")) {
      let name = key.replace("schedule-", "");

      var li = document.createElement("li");

      var nameSpan = document.createElement("span");
      nameSpan.textContent = name;
      nameSpan.style.cursor = "pointer";
      nameSpan.onclick = function () {
        loadSchedule(this.textContent);
      };

      var deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.onclick = function (e) {
        e.stopPropagation();
        if (confirm("Delete schedule '" + name + "'?")) {
          localStorage.removeItem("schedule-" + name);
          loadSavedSchedules();
        }
      };

      li.appendChild(nameSpan);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    }
  }
}

function loadSchedule(name) {
  var data = localStorage.getItem("schedule-" + name);
  if (!data) return;

  var parsed = JSON.parse(data);

  document.getElementById("save-name").value = name;
  document.getElementById("planner-title").textContent = parsed.title || "My Daily Planner";

  var table = document.getElementById("schedule");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  parsed.tasks.forEach(task => {
    addRow(task.time, task.activity, task.done);
  });
}
