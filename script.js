// script.js
let tasks = {}; // Menyimpan semua tugas berdasarkan tanggal

// Fungsi untuk menyimpan data ke local storage
function saveToLocalStorage() {
  const profilePic = document.getElementById("profilePic").src;
  localStorage.setItem(
    "userData",
    JSON.stringify({
      name: document.getElementById("displayName").textContent,
      position: document.getElementById("displayPosition").textContent,
      profilePic: profilePic,
    })
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Fungsi untuk memuat data dari local storage
function loadFromLocalStorage() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (userData) {
    // Jika data pengguna sudah ada, langsung tampilkan konten utama
    document.getElementById("displayName").textContent = userData.name;
    document.getElementById("displayPosition").textContent = userData.position;
    document.getElementById("profilePic").src =
      userData.profilePic || "default-profile.png";
    document.getElementById("userForm").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  }

  if (savedTasks) {
    tasks = savedTasks;
    updateDateInput(); // Perbarui tampilan kalender
    loadTasksForDate(); // Muat tugas untuk tanggal yang dipilih
  }
}

function saveUserData() {
  const nameInput = document.getElementById("nameInput");
  const positionInput = document.getElementById("positionInput");

  if (nameInput.value.trim() === "" || positionInput.value.trim() === "") {
    alert("Nama dan jabatan tidak boleh kosong!");
    return;
  }

  // Simpan data dan tampilkan di profile
  document.getElementById("displayName").textContent = nameInput.value;
  document.getElementById("displayPosition").textContent = positionInput.value;

  // Sembunyikan form input dan tampilkan konten utama
  document.getElementById("userForm").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  // Simpan ke local storage
  saveToLocalStorage();
}

function updateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("currentTime").textContent = now.toLocaleDateString(
    "id-ID",
    options
  );
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const dateInput = document.getElementById("dateInput").value;

  if (taskInput.value.trim() === "" || dateInput === "") {
    alert("Tugas dan tanggal tidak boleh kosong!");
    return;
  }

  const task = {
    text: taskInput.value,
    priority: priorityInput.value,
    date: dateInput, // Tambahkan tanggal ke dalam tugas
    completed: false,
  };

  if (!tasks[dateInput]) {
    tasks[dateInput] = [];
  }
  tasks[dateInput].push(task);

  // Bersihkan input
  taskInput.value = "";
  loadTasksForDate();

  // Simpan ke local storage
  saveToLocalStorage();
  updateDateInput(); // Perbarui tampilan kalender
}

function loadTasksForDate() {
  const dateInput = document.getElementById("dateInput").value;
  const todoList = document.getElementById("todoList");
  const doneList = document.getElementById("doneList");

  // Kosongkan daftar
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  if (tasks[dateInput]) {
    tasks[dateInput].forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <input type="checkbox" onchange="toggleTaskCompletion('${dateInput}', ${index})" ${
        task.completed ? "checked" : ""
      }>
                <div class="task-details">
                    <span>${task.text}</span>
                    <div class="task-date">${formatDate(task.date)}</div>
                </div>
                <span class="priority ${
                  task.priority
                }">${task.priority.toUpperCase()}</span>
                <button onclick="deleteTask('${dateInput}', ${index})">Hapus</button>
            `;

      if (task.completed) {
        li.classList.add("completed");
        doneList.appendChild(li);
      } else {
        todoList.appendChild(li);
      }
    });
  }
}

function toggleTaskCompletion(date, index) {
  tasks[date][index].completed = !tasks[date][index].completed;
  loadTasksForDate();

  // Simpan ke local storage
  saveToLocalStorage();
}

function deleteTask(date, index) {
  tasks[date].splice(index, 1);
  loadTasksForDate();

  // Simpan ke local storage
  saveToLocalStorage();
  updateDateInput(); // Perbarui tampilan kalender
}

function deleteAllTasks() {
  const dateInput = document.getElementById("dateInput").value;
  tasks[dateInput] = [];
  loadTasksForDate();

  // Simpan ke local storage
  saveToLocalStorage();
  updateDateInput(); // Perbarui tampilan kalender
}

// Fungsi untuk menampilkan To-Do List
function showTodoList() {
  document.getElementById("todoSection").style.display = "block";
  document.getElementById("doneSection").style.display = "none";
}

// Fungsi untuk menampilkan Done List
function showDoneList() {
  document.getElementById("todoSection").style.display = "none";
  document.getElementById("doneSection").style.display = "block";
}

// Fungsi untuk memperbarui tampilan kalender
function updateDateInput() {
  const dateInput = document.getElementById("dateInput");
  dateInput.classList.remove("has-tasks");
  if (tasks[dateInput.value] && tasks[dateInput.value].length > 0) {
    dateInput.classList.add("has-tasks");
  }
}

// Fungsi untuk membuka form edit profile
function openEditProfile() {
  document.getElementById("editProfileForm").style.display = "block";
  document.getElementById("editNameInput").value =
    document.getElementById("displayName").textContent;
  document.getElementById("editPositionInput").value =
    document.getElementById("displayPosition").textContent;
}

// Fungsi untuk menutup form edit profile
function closeEditProfile() {
  document.getElementById("editProfileForm").style.display = "none";
}

// Fungsi untuk menyimpan perubahan profile
function saveEditedProfile() {
  const editNameInput = document.getElementById("editNameInput");
  const editPositionInput = document.getElementById("editPositionInput");

  if (
    editNameInput.value.trim() === "" ||
    editPositionInput.value.trim() === ""
  ) {
    alert("Nama dan jabatan tidak boleh kosong!");
    return;
  }

  // Simpan perubahan
  document.getElementById("displayName").textContent = editNameInput.value;
  document.getElementById("displayPosition").textContent =
    editPositionInput.value;

  // Sembunyikan form edit
  closeEditProfile();

  // Simpan ke local storage
  saveToLocalStorage();
}

// Fungsi untuk menghapus profil
function deleteProfile() {
  if (confirm("Apakah Anda yakin ingin menghapus profil Anda?")) {
    localStorage.removeItem("userData");
    localStorage.removeItem("tasks");
    tasks = {}; // Hapus semua tugas
    document.getElementById("displayName").textContent = "";
    document.getElementById("displayPosition").textContent = "";
    document.getElementById("profilePic").src = "default-profile.png";
    document.getElementById("userForm").style.display = "block";
    document.getElementById("mainContent").style.display = "none";
    loadTasksForDate(); // Perbarui tampilan daftar tugas
  }
}

// Fungsi untuk memformat tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
}

// Fungsi untuk menangani unggahan foto profil
function handleProfilePicUpload(event) {
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("profilePic").src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

// Muat data dari local storage saat halaman dimuat
window.onload = function () {
  loadFromLocalStorage();
  updateTime();
  setInterval(updateTime, 1000);

  // Muat tugas untuk tanggal yang dipilih atau tanggal hari ini
  const dateInput = document.getElementById("dateInput");
  if (dateInput.value) {
    loadTasksForDate();
  } else {
    dateInput.value = new Date().toISOString().split("T")[0];
    loadTasksForDate();
  }
};
