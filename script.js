// DOM Elements
const dateInput = document.getElementById("note-date");
const noteArea = document.getElementById("note-content");
const statusText = document.getElementById("status");
const contactForm = document.getElementById("contact-form");

// ✅ Load saved note when a date is selected
if (dateInput && noteArea && statusText) {
  dateInput.addEventListener("change", () => {
    const noteKey = "note-" + dateInput.value;
    const savedNote = localStorage.getItem(noteKey);
    noteArea.value = savedNote || "";
    statusText.textContent = "";
  });
}

// ✅ Save note for selected date
function saveNote() {
  if (!dateInput || !noteArea || !statusText) return;

  const date = dateInput.value;
  const content = noteArea.value.trim();

  if (!date) {
    alert("Please select a date first.");
    return;
  }

  localStorage.setItem("note-" + date, content);
  statusText.textContent = "✅ Note saved successfully!";
}

// ✅ Contact form logic (custom handler)
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill out all fields before sending.");
      return;
    }

    // Option 1: Use Formspree (if form action points there, this is not needed)
    // contactForm.submit();

    // Option 2: Use mailto fallback if preferred
    const mailtoLink = `mailto:your.email@example.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  });
}
