function addProgramReviewed() {
    const container = document.getElementById('programContainer');
    const newProgram = document.createElement('div');
    newProgram.innerHTML = `
    <div class="d-flex mb-3">
                <input type="text" name="programs[]" id="program${programCount}" class="form-control" required>
                <button onclick="deleteRow(this)" type="button" class="btn btn-danger ms-2">DELETE</button>
            </div>
`;
    container.appendChild(newProgram);
    programCount++;
}

function deleteRow(e) {
    e.parentElement.remove()
    programCount--
} 

document.querySelector('form').addEventListener('submit', (e) => {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.value === '') {
            input.disabled = true;
        } else {
            input.disabled = false;
        }
    })
})

document.querySelector('#confirmSegEditForm').addEventListener('submit', (e) => {
    document.querySelectorAll('.disabledPrograms').forEach(input => {
        input.disabled = false;
    })
})

const applicableAOC = createEditorInstance('applicableAOC', editorConfig);
const reviewActivity = createEditorInstance('reviewActivity', editorConfig);
const dataSubmittal = createEditorInstance('dataSubmittal', editorConfig);
const reviewGuidance = createEditorInstance('reviewGuidance', editorConfig);