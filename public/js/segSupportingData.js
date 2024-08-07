const socket = io();
let updateData;
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pdfWindow').addEventListener('load', () => {
        hideLoading();
    });
    document.getElementById('pdfWindow').addEventListener('change', () => {
        hideLoading();
    });



    setDeleteChecks();
    const savingIcon = document.querySelector('#savingIcon');
    const editors = document.querySelectorAll('div.nicEdit-main').forEach((element, i) => {
        element.setAttribute('style', 'width: 100%'); // Add width property
        element.setAttribute('style', 'min-height: 300px;'); // Add height property

        element.addEventListener('input', (e) => {
            socket.emit('supportingDataUpdate', { programID, text: element.innerHTML });
        });

        socket.on('supportingDataUpdate', (data) => {
            if (element.parentElement.parentElement.id === `supportingData-${data.programID}`) {
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
            const data = { supportingData: nicEditElement.innerHTML };
            try {
                const response = await axios.put(`/plant/${currentPlantID}/seg/${segID}/supportingData/${programID}`, data);
            } catch (error) {
                alert('There was an error making the request. Please try again.');
            }
        }
        if (savingIcon.innerHTML !== 'Saved') {
            savingIcon.innerHTML = 'Saved'
            nicEditElement.style.backgroundColor = ''
        }

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            // Append each file individually
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('fileInput', fileInput.files[i]);
            }
            fileInput.value = '';

            formData.append('supportingData', nicEditElement.innerHTML);


            try {
                const response = await axios.put(`/plant/${currentPlantID}/seg/${segID}/supportingData/${programID}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                appendFile(response.data.program.supportingDataFiles, response.data.admin);
                document.getElementById('loadingCircle').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
                document.body.style.pointerEvents = 'auto';

            } catch (error) {
                hideLoading()
                alert('There was an error making the request. Please try again.')
            }

        }
    };

    setInterval(updateData, 100000);
});

window.addEventListener('beforeunload', (e) => {
    updateData()
})


function setDeleteChecks() {
    const deleteCheckboxes = document.querySelectorAll('.deleteCheck');
    let selectAllCheck = document.getElementById('selectAllCheck');
    const deleteFilesButton = document.getElementById('deleteFilesButton');
    const downloadFilesButton = document.getElementById('downloadFilesButton');

    if (deleteFilesButton) {
        deleteFilesButton.addEventListener('click', () => {
            const fileForm = document.getElementById('fileForm');
            fileForm.action = `/plant/${currentPlantID}/seg/${segID}/supportingData/${programID}?_method=DELETE`;
            fileForm.submit();
        })
    }

    if (downloadFilesButton) {
        downloadFilesButton.addEventListener('click', () => {
            const fileForm = document.getElementById('fileForm');
            fileForm.action = `/plant/${currentPlantID}/seg/${segID}/supportingData/${programID}?seg=${segNumID}`;
            fileForm.submit();
        })
    }


    deleteCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            document.getElementById('checkedCount').innerHTML = `${document.querySelectorAll('.deleteCheck:checked').length} Files Selected`
            if (document.querySelectorAll('.deleteCheck:checked').length === 1) {
                document.getElementById('checkedCount').innerHTML = `1 File Selected`
            }
            if (deleteCheckboxes.length === document.querySelectorAll('.deleteCheck:checked').length) {
                selectAllCheck.checked = true;
            } else {
                selectAllCheck.checked = false;
            }
            if (document.querySelectorAll('.deleteCheck:checked').length > 0) {
                if (deleteFilesButton) {
                    deleteFilesButton.disabled = false;
                }
                if (downloadFilesButton) {
                    downloadFilesButton.disabled = false;
                }
            } else {
                if (deleteFilesButton) {
                    deleteFilesButton.disabled = true;
                }
                if (downloadFilesButton) {
                    downloadFilesButton.disabled = true;
                }
            }
        });
    });

    if (selectAllCheck) {
        selectAllCheck.addEventListener('change', () => {
            if (selectAllCheck.checked) {
                deleteCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;
                });
                if (deleteFilesButton) {
                    deleteFilesButton.disabled = false;
                }
                if (downloadFilesButton) {
                    downloadFilesButton.disabled = false;
                }
            } else {
                deleteCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                if (deleteFilesButton) {
                    deleteFilesButton.disabled = true;
                }
                if (downloadFilesButton) {
                    downloadFilesButton.disabled = true;
                }
            }
            document.getElementById('checkedCount').innerHTML = `${document.querySelectorAll('.deleteCheck:checked').length} Files Selected`
            if (document.querySelectorAll('.deleteCheck:checked').length === 1) {
                document.getElementById('checkedCount').innerHTML = `1 File Selected`
            }
        });
    }
}

function closePDF() {
    document.getElementById('pdfWindow').src = '';
    document.getElementById('pdfSection').style.display = 'none';
}

function showPDF(location) {
    document.getElementById('pdfWindow').src = location;
    document.getElementById('pdfSection').style.display = 'block';
}

function fileInputSubmit() {
    document.querySelector('#saveSupportingDataButton').click();
    document.getElementById('loadingCircle').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.pointerEvents = 'none';

}

document.querySelector('#fileInput').onchange = fileInputSubmit;

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function appendFile(files, admin) {
    let fileListContainer = document.querySelector('#fileListContainer');
    if (!fileListContainer) {
        fileListContainer = document.createElement('ul');
        fileListContainer.classList.add('list-group')
        fileListContainer.id = "fileListContainer";

        const deleteForm = document.createElement('form');
        deleteForm.classList.add('mt-5');
        deleteForm.id = "fileForm";
        deleteForm.action = `/plant/${currentPlantID}/seg/${segID}/supportingData/${programID}?_method=DELETE`;
        deleteForm.method = "POST";
        deleteForm.appendChild(fileListContainer)
        document.querySelector('#filesSection').appendChild(deleteForm);
    }


    if (admin) {
        fileListContainer.innerHTML = `
                <li id="deleteHeader" class="list-group-item d-flex align-items-center justify-content-between px-3">
                    <div class="py-2">
                        <input class="border" type="checkbox" id="selectAllCheck">
                        <label id="checkedCount" class="d-inline ps-3">0 Files Selected</label>
                        <button disabled type="button" id="downloadFilesButton" form="fileForm" class="btn btn-secondary ms-2">Download</button>
                    </div>
                    <button disabled type="button" form="fileForm" class="btn btn-danger" id="deleteFilesButton">
                        Delete
                    </button>       
                </li>
                `} else {
        fileListContainer.innerHTML = `
                    <li id="deleteHeader" class="list-group-item d-flex align-items-center justify-content-between px-3">
                        <div class="py-2">
                            <input class="border" type="checkbox" id="selectAllCheck">
                            <label id="checkedCount" class="d-inline ps-3">0 Files Selected</label>
                            <button disabled type="button" id="downloadFilesButton" form="fileForm" class="btn btn-secondary ms-2">Download</button>
                        </div>
                    </li>
                    `
    }

    for (const file of files) {
        const addedFile = document.createElement('li');
        addedFile.classList.add('list-group-item', 'd-flex', 'justify-content-between');

        addedFile.innerHTML = `
                        <div class="d-flex pt-2">
                            <div class="">
                                <input id="file${file._id}" name="files[]"
                                    value="${file._id}" type="checkbox"
                                    class="form-check mb-2 deleteCheck">
                            </div>
                            <label class="form-label px-3 text-wrap" for="file${file._id}">
                            ${file.originalName}
                        </label>
                        </div>    
                        `;

        const date = file.uploadDate.split('T')[0];
        addedFile.innerHTML += `
                        <div class="row ps-3">
                                <div class="col pe-5 py-2">
                                    <b>Upload Date:</b> ${date.substring(5, 7)}/${date.substring(8, 10)}/${date.substring(0, 4)}
                                </div>
                                <div class="col-3 d-flex my-auto justify-content-end">
                                    <div class="">
                                        <button type="button" class="btn btn-primary"
                                            onclick="showPDF('${file.location}')">View
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        fileListContainer.appendChild(addedFile);
    }
    setDeleteChecks();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && document.querySelector('#previousButton')) {
        document.querySelector('#previousButton').click();
    } else if (e.key === 'ArrowRight' && document.querySelector('#nextButton')) {
        document.querySelector('#nextButton').click();
    }
})