// Get references to HTML elements
const noteDateInput = document.getElementById('note-date');
const noteContentInput = document.getElementById('note-content');
const statusDiv = document.getElementById('status');
const notesList = document.getElementById('notes-list'); // Changed from allNotesDiv

// --- Functions for Saving Notes to Firestore ---
async function saveNote() {
    const date = noteDateInput.value;
    const content = noteContentInput.value.trim();

    if (!date || !content) {
        statusDiv.textContent = 'Please select a date and write your note.';
        statusDiv.style.color = 'red';
        return;
    }

    try {
        // Add a new document to the 'notes' collection in Firestore
        // We'll use the date as the document ID for simplicity,
        // but ensure dates are unique if you use this approach.
        // If you want multiple notes per day, you'd use addDoc and let Firestore generate an ID.
        await window.setDoc(window.doc(window.db, "notes", date), {
            date: date, // Store the date field explicitly
            content: content,
            timestamp: window.serverTimestamp() // Add a server timestamp
        });

        statusDiv.textContent = `Note for ${date} saved successfully to the cloud!`;
        statusDiv.style.color = '#2ecc71';

        // Clear form fields
        noteContentInput.value = '';
        noteDateInput.value = '';

        displayAllNotes(); // Refresh the displayed notes from Firestore
    } catch (error) {
        console.error("Error saving note:", error);
        statusDiv.textContent = 'Error saving note. Please try again.';
        statusDiv.style.color = 'red';
    }
}


// --- Functions for Displaying Notes from Firestore ---
async function displayAllNotes() {
    notesList.innerHTML = ''; // Clear previous notes

    try {
        // Get all documents from the 'notes' collection, ordered by timestamp (or date)
        // Using window.query and window.orderBy as they are exposed from index.html
        const notesQuery = window.query(window.collection(window.db, "notes"), window.orderBy("date", "desc"));
        const querySnapshot = await window.getDocs(notesQuery);

        if (querySnapshot.empty) {
            notesList.innerHTML = '<p>No notes saved yet in the cloud.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const note = doc.data();
            const noteId = doc.id; // Get the document ID (which is our date in this case)

            const listItem = document.createElement('li'); // Each note is a list item
            
            // Create the header (the clickable date part)
            const noteHeader = document.createElement('div');
            noteHeader.classList.add('note-header');
            noteHeader.innerHTML = `
                <span>${note.date}</span>
                <span class="arrow">&#9658;</span>`; // HTML entity for right arrow
            listItem.appendChild(noteHeader);

            // Create the content body (the collapsible part)
            const noteContentBody = document.createElement('div');
            noteContentBody.classList.add('note-content-body');
            noteContentBody.innerHTML = `
                <div class="note-content-text">${note.content}</div>
                <div class="note-item-actions">
                    <button class="edit-note-btn" data-id="${noteId}">Edit</button>
                    <button class="delete-note-btn" data-id="${noteId}">Delete</button>
                </div>`;
            listItem.appendChild(noteContentBody);

            notesList.appendChild(listItem);

            // Add click listener to the header to toggle the content
            noteHeader.addEventListener('click', () => {
                noteContentBody.classList.toggle('show');
                noteHeader.classList.toggle('active'); // To rotate the arrow
            });
        });

        // Attach event listeners to new edit/delete buttons after they are created
        document.querySelectorAll('.edit-note-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const idToEdit = event.target.dataset.id;
                editNote(idToEdit); // Call the edit function
            });
        });

        document.querySelectorAll('.delete-note-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const idToDelete = event.target.dataset.id;
                deleteNote(idToDelete); // Call the delete function
            });
        });

    } catch (error) {
        console.error("Error fetching notes:", error);
        notesList.innerHTML = '<p style="color:red;">Error loading notes.</p>';
    }
}

// --- Function to Edit Notes (Placeholder - You'll need to implement the actual editing UI/logic) ---
function editNote(id) {
    // For now, this just logs which note would be edited.
    // To implement editing, you'd typically:
    // 1. Get the note content from Firestore based on the ID.
    // 2. Populate the note input fields with the existing content.
    // 3. Change the "Save Note" button to an "Update Note" button.
    // 4. When "Update Note" is clicked, use window.setDoc to update the existing document.
    alert(`Edit note with ID: ${id}. (Feature not fully implemented yet)`);
    console.log("Attempting to edit note with ID:", id);
    // Example: You might want to fetch the note, populate the form, and then re-save
    // const noteRef = window.doc(window.db, "notes", id);
    // window.getDoc(noteRef).then(docSnap => {
    //     if (docSnap.exists()) {
    //         noteDateInput.value = docSnap.data().date;
    //         noteContentInput.value = docSnap.data().content;
    //         // Maybe change save button text and add a flag for "editing mode"
    //     }
    // });
}

// --- Function to Delete Notes from Firestore ---
async function deleteNote(idToDelete) {
    if (confirm(`Are you sure you want to delete the note for ${idToDelete}? This cannot be undone.`)) {
        try {
            // Delete the document from the 'notes' collection based on its ID
            await window.deleteDoc(window.doc(window.db, "notes", idToDelete));
            
            statusDiv.textContent = `Note for ${idToDelete} deleted successfully from the cloud!`;
            statusDiv.style.color = '#ff6347'; // Tomato color for delete confirmation
            displayAllNotes(); // Refresh the list
        } catch (error) {
            console.error("Error deleting note:", error);
            statusDiv.textContent = 'Error deleting note. Please try again.';
            statusDiv.style.color = 'red';
        }
    }
}


// --- Event Listeners and Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to the save button by its ID
    const saveButton = document.getElementById('save-note-btn');
    if (saveButton) {
        saveButton.addEventListener('click', saveNote);
    } else {
        console.warn("Save button with ID 'save-note-btn' not found. Check index.html.");
    }

    // Call displayAllNotes when the page loads to show existing notes from Firestore
    displayAllNotes();
});