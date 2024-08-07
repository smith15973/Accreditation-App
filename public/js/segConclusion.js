const savingIcon = document.querySelector('#savingIcon');

const conclusionInstance = createEditorInstance(`conclusionTextArea-${programID}`, editorConfig);
conclusionInstance.onInput = (contents, core) => {
    const conclusionText = core.getContents();
    socket.emit('conclusionUpdate', { programID, text: conclusionText, userID, userName });
};

const socket = io();
socket.on('conclusionUpdate', (data) => {
    if (userID !== data.userID) {
        const conclusionTextBox = document.querySelector(`#conclusionTextArea-${data.programID}`);
        if (conclusionTextBox) {
            conclusionInstance.setContents(data.text)
            conclusionInstance.save();
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
    axios.post(`/plant/${currentPlantID}/seg/${segInstructionID}/${programID}/history`, { page: 'conclusion' })
}
    
window.addEventListener('beforeunload', () => {
    updateHistory()
})