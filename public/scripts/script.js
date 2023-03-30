// Get all checkboxes with name "selectedVakken"
const checkboxes = document.querySelectorAll('input[name="selectedVakken"]');

// Loop over each checkbox and add event listener
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    // Get the parent li element
    const li = checkbox.parentNode.parentNode;

    // Toggle the "selected" class on the li element
    li.classList.toggle('selected');
  });
});