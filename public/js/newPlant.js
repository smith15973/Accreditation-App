function changeImage(event) {

    const [file] = event.target.files;
    if (file) {
        document.querySelector('#imageArea').innerHTML =
            `<div id="imageContainer" class="img-container">
            <img id="showImage" class="img-cropped">
        </div>`
        const showImage = document.getElementById('showImage');
        showImage.src = URL.createObjectURL(file);
    } else {
        document.querySelector('#imageArea').innerHTML = ''
    }
}