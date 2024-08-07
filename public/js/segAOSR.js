const savingIcon = document.querySelector('#savingIcon');

const aosrInstance = createEditorInstance(`aosrTextArea-${programID}`, editorConfig);
aosrInstance.onInput = (contents, core) => {
    const aosrText = core.getContents();
    socket.emit('aosrUpdate', { programID, text: aosrText, userID, userName });
};


const socket = io();
socket.on('aosrUpdate', (data) => {
    if (userID !== data.userID) {
        const aosrTextBox = document.querySelector(`#aosrTextArea-${data.programID}`);
        if (aosrTextBox) {
            aosrInstance.setContents(data.text)
            aosrInstance.save();
        }
    }
})


function arrowKeyNavigation(e) {
    if (!document.activeElement.classList.contains("sun-editor-editable")) {
        if (e.key === 'ArrowLeft' && document.querySelector('#previousButton')) {
            document.querySelector('#previousButton').click();
        } else if (e.key === 'ArrowRight' && document.querySelector('#nextButton')) {
            document.querySelector('#nextButton').click();
        }
    }
}

document.addEventListener('keydown', (e) => {
    arrowKeyNavigation(e)
})

async function updateHistory() {
    axios.post(`/plant/${currentPlantID}/seg/${segInstructionID}/${programID}/history`, { page: 'aosr' })
}
    
window.addEventListener('beforeunload', () => {
    updateHistory()
})

