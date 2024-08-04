const socket = io();
let updateData;
document.addEventListener('DOMContentLoaded', () => {
    const savingIcon = document.querySelector('#savingIcon');
    const editors = document.querySelectorAll('div.nicEdit-main').forEach((element, i) => {
        element.setAttribute('style', 'width: 100%'); // Add width property
        element.setAttribute('style', 'min-height: 300px;'); // Add height property

        element.addEventListener('input', (e) => {
            socket.emit('aosrUpdate', { programID, text: element.innerHTML });
        });

        socket.on('aosrUpdate', (data) => {
            if (element.parentElement.parentElement.id === `aosr-${data.programID}`) {
                if (savingIcon.innerHTML !== 'EDITING...') {
                    savingIcon.innerHTML = 'EDITING...'
                }
                if (!document.activeElement.classList.contains('nicEdit-main')) {
                    element.innerHTML = data.text;
                    element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    element.classList.add('disabled')
                }
            }
        });
    });

    const nicEditElement = document.querySelector('.nicEdit-main');
    let oldText = nicEditElement.innerHTML;

    updateData = async () => {
        if (oldText !== nicEditElement.innerHTML) {
            oldText = nicEditElement.innerHTML;
            const data = { aosr: nicEditElement.innerHTML };
            try {
                const response = await axios.put(`/plant/${currentPlantID}/seg/${segInstructionID}/aosr/${programID}`, data);

            } catch (error) {
                console.error('There was an error making the request:', error);
            }
        }
        if (savingIcon.innerHTML !== 'Saved') {
            savingIcon.innerHTML = 'Saved'
            nicEditElement.style.backgroundColor = ''
        }
    };

    setInterval(updateData, 100000);
});

window.addEventListener('beforeunload', (e) => {
    updateData()
})


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && document.querySelector('#previousButton')) {
        document.querySelector('#previousButton').click();
    } else if (e.key === 'ArrowRight' && document.querySelector('#nextButton')) {
        document.querySelector('#nextButton').click();
    }
})  