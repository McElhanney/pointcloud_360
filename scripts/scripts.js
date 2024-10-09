// Function to toggle the visibility of the side menu
function toggleMenu() {
    var menu = document.getElementById('side-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Function to change the 360 image and update the image name and Google Maps
function changeImage(imagePath, imageName, rotationX = 0, rotationY = 0, rotationZ = 0) {
    var sky = document.getElementById('sky');
    var imageNameDisplay = document.getElementById('image-name');
    var mapViewer = document.getElementById('map-viewer');

    // Add a cache-busting query parameter to ensure the image is reloaded
    var timestamp = new Date().getTime();
    var newImagePath = `${imagePath}?t=${timestamp}`;  // Add a timestamp to avoid cache

    // Clear the current src and force the sky element to reload
    sky.setAttribute('src', '');  // Reset the skybox temporarily
    setTimeout(function () {
        sky.setAttribute('src', newImagePath);  // Set the new image after a brief delay
    }, 100);  // Small delay to allow the reset

    // Reset the camera's view to the specified rotation for each image
    sky.setAttribute('rotation', `${rotationX} ${rotationY} ${rotationZ}`);  // Reset the rotation

    // Update the image name display
    imageNameDisplay.textContent = imageName;

    // Close the menu automatically after selecting an image
    var menu = document.getElementById('side-menu');
    menu.style.display = 'none';

    // Read EXIF data from the image
    var img = new Image();
    img.src = imagePath;

    img.onload = function () {
        EXIF.getData(img, function () {
            var lat = EXIF.getTag(this, "GPSLatitude");
            var lon = EXIF.getTag(this, "GPSLongitude");

            if (lat && lon) {
                // Convert EXIF lat/lon to decimal format
                var latitude = convertToDecimal(lat, EXIF.getTag(this, "GPSLatitudeRef"));
                var longitude = convertToDecimal(lon, EXIF.getTag(this, "GPSLongitudeRef"));

                // Update Google Maps viewer with a marker at the new lat/lon
                mapViewer.src = `https://www.google.com/maps/embed/v1/view?key=AIzaSyAWftVtxepvExKu4DtnWRK46Am7GeRHD_U&center=${latitude},${longitude}&zoom=15`;

            } else {
                mapViewer.src = ''; // Clear map if no GPS data is found
            }
        });
    };
}

// Helper function to convert EXIF GPS coordinates to decimal format
function convertToDecimal(coord, ref) {
    var decimal = coord[0] + coord[1] / 60 + coord[2] / 3600;
    return (ref === "S" || ref === "W") ? decimal * -1 : decimal;
}
