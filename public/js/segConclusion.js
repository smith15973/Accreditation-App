const socket = io();
const savingIcon = document.querySelector('#savingIcon');
let oldText = document.querySelector(`#conclusionTextArea-${programID}`).innerHTML;

const conclusionID = `conclusionTextArea-${programID}`;
const conclusionInstance = createEditorInstance(conclusionID, editorConfig);
conclusionInstance.onInput = (contents, core) => {
    const conclusionText = core.getContents();
    conclusionInstance.save();
    socket.emit('conclusionUpdate', { programID, text: conclusionText });
};



socket.on('conclusionUpdate', (data) => {
    if (document.querySelector(`#conclusionTextArea-${data.programID}`) && savingIcon.innerHTML !== 'EDITING...') {
        savingIcon.innerHTML = 'EDITING...'
    }

    const focus = document.activeElement;
    if (!focus.classList.contains("se-wrapper-inner")) {
        const conclusionTextBox = document.querySelector(`#conclusionTextArea-${data.programID}`);
        if (conclusionTextBox) {
            conclusionInstance.setContents(data.text)
            conclusionInstance.save();
        }
    }
})



const updateData = async () => {
    conclusionInstance.save();
    const conclusionText = conclusionInstance.getContents();
    if (oldText !== conclusionText) {
        oldText = conclusionText;
        const data = { conclusion: conclusionText };
        try {
            const response = await axios.put(`/plant/${currentPlantID}/seg/${segInstructionID}/conclusion/${programID}`, data);

        } catch (error) {
            console.error('There was an error making the request:', error);
        }
    }
    if (savingIcon.innerHTML !== 'Saved') {
        savingIcon.innerHTML = 'Saved'
    }
};

setInterval(updateData, 100000);

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