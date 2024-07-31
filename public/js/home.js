document.querySelectorAll('.clickable-div').forEach(item => {
    item.addEventListener('click', function () {
        window.location.href = this.dataset.url;
    });
});

document.addEventListener("DOMContentLoaded", function (event) {
    const scrollpos = localStorage.getItem('scrollpos');
    if (scrollpos) window.scrollTo(0, scrollpos);
});

window.onbeforeunload = function (e) {
    localStorage.setItem('scrollpos', window.scrollY);
};

const titles = document.querySelectorAll('.card-title');
filterPlants = (e) => {
    for (let title of titles) {
        if (e.target.value !== '' && !title.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
            title.parentElement.parentElement.parentElement.hidden = true;
        } else {
            title.parentElement.parentElement.parentElement.hidden = false
        }
    }
}

document.querySelector('title').innerHTML = `ARC Home`;