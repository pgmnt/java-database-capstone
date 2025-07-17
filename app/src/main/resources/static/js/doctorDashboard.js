/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/




// doctorDashboard.js

// 1. Import necessary modules
import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';
import { renderContent } from './render.js'; // Optional if used to render layout

// 2. Initialize global variables
const appointmentTableBody = document.getElementById('patientTableBody');
let selectedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
let token = localStorage.getItem('token');
let patientName = null;

// 3. Setup search bar functionality
const searchBar = document.getElementById('searchBar');
if (searchBar) {
  searchBar.addEventListener('input', () => {
    const value = searchBar.value.trim();
    patientName = value !== '' ? value : "null";
    loadAppointments();
  });
}

// 4. Handle "Today" button click
const todayButton = document.getElementById('todayButton');
if (todayButton) {
  todayButton.addEventListener('click', () => {
    selectedDate = new Date().toISOString().split('T')[0];
    const datePicker = document.getElementById('datePicker');
    if (datePicker) {
      datePicker.value = selectedDate;
    }
    loadAppointments();
  });
}

// 5. Handle date picker change
const datePicker = document.getElementById('datePicker');
if (datePicker) {
  datePicker.value = selectedDate; // Initialize with today's date
  datePicker.addEventListener('change', () => {
    selectedDate = datePicker.value;
    loadAppointments();
  });
}

// 6. Define function to load appointments
async function loadAppointments() {
  try {
    const appointments = await getAllAppointments(selectedDate, patientName, token);

    // Clear previous rows
    appointmentTableBody.innerHTML = '';

    if (!appointments || appointments.length === 0) {
      appointmentTableBody.innerHTML = `
        <tr>
          <td colspan="4">No Appointments found for today.</td>
        </tr>
      `;
      return;
    }

    appointments.forEach(appointment => {
      const patient = {
        id: appointment.patient.id,
        name: appointment.patient.name,
        phone: appointment.patient.phone,
        email: appointment.patient.email,
      };
      const row = createPatientRow(patient);
      appointmentTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    appointmentTableBody.innerHTML = `
      <tr>
        <td colspan="4">Error loading appointments. Try again later.</td>
      </tr>
    `;
  }
}

// 7. Load initial data when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderContent === 'function') {
    renderContent(); // Optional layout rendering
  }
  loadAppointments(); // Load today’s appointments
});
