const savingIcon = document.querySelector('#savingIcon');
let oldText = document.querySelector(`#aosrTextArea-${programID}`).innerHTML;
const aosrID = `aosrTextArea-${programID}`;
const aosrInstance = createEditorInstance(aosrID, editorConfig);
aosrInstance.onChange = (contents, core) => {
    const aosrText = core.getContents();
    socket.emit('aosrUpdate', { programID, text: aosrText });
};


const socket = io();
socket.on('aosrUpdate', (data) => {
    if (document.querySelector(`#aosrTextArea-${data.programID}`) && savingIcon.innerHTML !== 'EDITING...') {
        savingIcon.innerHTML = 'EDITING...'
    }

    const focus = document.activeElement;
    if (!focus.classList.contains("se-wrapper-inner")) {
        const aosrTextBox = document.querySelector(`#aosrTextArea-${data.programID}`);
        if (aosrTextBox) {
            aosrInstance.setContents(data.text)
            aosrInstance.save();
        }
    }
})



const updateData = async () => {
    aosrInstance.save();
    const aosrText = aosrInstance.getContents();
    if (oldText !== aosrText) {
        oldText = aosrText;
        const data = { aosr: aosrText };
        try {
            const response = await axios.put(`/plant/${currentPlantID}/seg/${segInstructionID}/aosr/${programID}`, data);

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