function changeImage(event) {
    const showImage = document.getElementById('showImage');
    const [file] = event.target.files;
    if (file) {
        showImage.src = URL.createObjectURL(file);
    } else {
        showImage.src = plantImageUrl;
    }
}