const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = [];

// Load from localStorage
const saved = localStorage.getItem("notes");
if (saved) notes = JSON.parse(saved);

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function render(filter = "") {
  notesList.innerHTML = "";
  const filtered = notes.filter(n =>
    n.text.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.textContent = filter ? "No notes match your search." : "No notes yet.";
    notesList.appendChild(li);
  } else {
    filtered.forEach(note => {
      const li = document.createElement("li");
      li.className = `note-card category-${note.category}`;

      const text = document.createElement("p");
      text.textContent = note.text;

      const meta = document.createElement("small");
      meta.textContent = `${note.category} • ${note.createdAt}`;

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => {
        notes = notes.filter(n => n.id !== note.id);
        saveNotes();
        render(searchInput.value);
      });

      li.appendChild(text);
      li.appendChild(meta);
      li.appendChild(delBtn);
      notesList.appendChild(li);
    });
  }

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = noteInput.value.trim();
  const category = categorySelect.value;

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";
  const note = {
    id: Date.now(),
    text,
    category,
    createdAt: new Date().toLocaleString()
  };
  notes.push(note);
  saveNotes();
  render(searchInput.value);
  noteInput.value = "";
});

searchInput.addEventListener("input", () => {
  render(searchInput.value);
});

// Initial render
render();

const clearAllBtn = document.querySelector("#clear-all");

clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
});



