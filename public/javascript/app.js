    const form = document.querySelector('form');
    const nameInput = document.querySelector('#name');
    const colorInput = document.querySelector('#color');
    const fileInput = document.querySelector('#image-upload-input');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Create a new button element for the theme
        const button = document.createElement('button');
        const thumbnail = document.createElement('img');
        thumbnail.src = URL.createObjectURL(fileInput.files[0]);
        thumbnail.alt = nameInput.value + ' Theme Icon';
        button.appendChild(thumbnail);
        button.appendChild(document.createTextNode(nameInput.value));
        button.addEventListener('click', () => {
            // Replace the header image with the uploaded image
            document.querySelector('header img').src = thumbnail.src;
            // Replace all theme buttons' thumbnails with the uploaded image
            document.querySelectorAll('section:nth-of-type(2) button img').forEach((img) => {
                img.src = thumbnail.src;
            });
            // Change the background color of the first and third sections
            document.querySelector('section:first-of-type').style.backgroundColor = colorInput.value;
            document.querySelector('section:nth-of-type(3)').style.backgroundColor = colorInput.value;
            // Change the font color of the third section
            document.querySelector('section:nth-of-type(3) p').style.color = document.querySelector('#font-color').value;
        });

        // Add the new button to the theme list
        document.querySelector('section:nth-of-type(2)').appendChild(button);
    });