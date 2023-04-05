  const body = document.querySelector('body');
  body.classList.add('hasJavascript');
  // Get all checkboxes with name "selectedVakken"
  const checkboxes = document.querySelectorAll('input[name="selectedVakken"]');
  const button = document.querySelector('.next');


  // Loop over each checkbox and add event listener
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Get the parent li element
      const li = checkbox.parentNode.parentNode;

      // Toggle the "selected" class on the li element
      li.classList.toggle('selected');
      // Count the number of selected checkboxes
      const selectedCount = document.querySelectorAll('input[name="selectedVakken"]:checked').length;

      // Toggle the visibility of the button based on the count
      //   if (selectedCount < 1) {
      //     button.style.display = 'none';
      //     console.log("none");
      //   } else  {
      //     button.style.display = 'block';
      //     console.log("block");
      //   }
      // }
    })
  });
  // button.style.display = 'none';