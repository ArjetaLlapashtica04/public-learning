// Function to save a note
function saveNote() {
    const noteDateInput = document.getElementById('note-date');
    const noteContentInput = document.getElementById('note-content');
    const statusDiv = document.getElementById('status');

    const date = noteDateInput.value;
    const content = noteContentInput.value.trim();

    if (!date || !content) {
        statusDiv.textContent = 'Please select a date and write your note.';
        statusDiv.style.color = 'red';
        return;
    }

    // Retrieve existing notes or initialize an empty object
    let notes = JSON.parse(localStorage.getItem('dailyNotes')) || {};
    
    // Store notes with date as key, content as value
    notes[date] = content; 
    localStorage.setItem('dailyNotes', JSON.stringify(notes));

    statusDiv.textContent = `Note for ${date} saved successfully!`;
    statusDiv.style.color = '#2ecc71';

    // Clear form fields
    noteContentInput.value = ''; 
    noteDateInput.value = ''; 

    displayAllNotes(); // Refresh the displayed notes
}

// Function to display all saved notes as dropdowns
function displayAllNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear current list

    let notes = JSON.parse(localStorage.getItem('dailyNotes')) || {};

    // Get dates and sort them from newest to oldest
    const sortedDates = Object.keys(notes).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        notesList.innerHTML = '<p>No notes saved yet.</p>';
        return;
    }

    sortedDates.forEach(date => {
        const content = notes[date];
        const listItem = document.createElement('li');

        // Create the header (the clickable date part)
        const noteHeader = document.createElement('div');
        noteHeader.classList.add('note-header');
        noteHeader.innerHTML = `
            <span>${date}</span>
            <span class="arrow">&#9658;</span> `;
        listItem.appendChild(noteHeader);

        // Create the content body (the collapsible part)
        const noteContentBody = document.createElement('div');
        noteContentBody.classList.add('note-content-body');
        noteContentBody.innerHTML = `
            <div class="note-content-text">${content}</div>
            <div class="note-item-actions">
                <button class="edit-note-btn" data-date="${date}">Edit</button>
                <button class="delete-note-btn" data-date="${date}">Delete</button>
            </div>
        `;
        listItem.appendChild(noteContentBody);

        notesList.appendChild(listItem);

        // Add click listener to the header to toggle the content
        noteHeader.addEventListener('click', () => {
            noteContentBody.classList.toggle('show');
            noteHeader.classList.toggle('active'); // To rotate the arrow
        });
    });

    // Attach event listeners to new edit/delete buttons (after they are created)
    document.querySelectorAll('.edit-note-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const dateToEdit = event.target.dataset.date;
            editNote(dateToEdit); 
        });
    });

    document.querySelectorAll('.delete-note-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const dateToDelete = event.target.dataset.date;
            deleteNote(dateToDelete); 
        });
    });
}

// Function to handle editing a specific no