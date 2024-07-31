const socket = io();

socket.on('supportingDataUpdate', (data) => {
    const id = 'supportingData-' + data.programID;
    if (document.querySelector('#' + id)) {
        document.querySelector('#' + id).innerHTML = data.text
    }
})
socket.on('conclusionUpdate', (data) => {
    const id = 'conclusion-' + data.programID;
    if (document.querySelector('#' + id)) {
        document.querySelector('#' + id).innerHTML = data.text
    }
})
socket.on('aosrUpdate', (data) => {
    const id = 'aosr-' + data.programID;
    if (document.querySelector('#' + id)) {
        document.querySelector('#' + id).innerHTML = data.text
    }
})
socket.on('programStatusUpdate', program => {
    const programID = '#programStatus-' + program._id
    const status = document.querySelector(programID);

    if (status) {
        if (status.value !== program.status) {
            status.value = program.status;
        }
        if (status.value === 'Submitted') {
            status.style.backgroundColor = 'rgb(123,187,123)';
        } else {
            status.style.backgroundColor = 'white';
        }
    }
})


const statusSelects = document.querySelectorAll('.statusSelect');
statusSelects.forEach(select => {
    select.addEventListener('change', () => {
        socket.emit('programStatusUpdate', { programID: select.id.split('-')[1], status: select.value });
    })
})

document.addEventListener("DOMContentLoaded", function (event) {
    const scrollpos = localStorage.getItem('scrollpos');
    if (scrollpos) window.scrollTo(0, scrollpos);
});

window.onbeforeunload = function (e) {
    localStorage.setItem('scrollpos', window.scrollY);
};

document.querySelector('#backToPlantButton').addEventListener('click', () => {
    localStorage.removeItem('scrollpos');
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && document.querySelector('#previousButton')) {
        document.querySelector('#previousButton').click();
    } else if (e.key === 'ArrowRight' && document.querySelector('#nextButton')) {
        document.querySelector('#nextButton').click();
    }
})