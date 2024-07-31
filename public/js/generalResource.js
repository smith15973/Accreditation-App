function closePDF() {
    document.getElementById('pdfWindow').src = '';
    document.getElementById('pdfSection').style.display = 'none';
}
function showPDF(location) {
    document.getElementById('pdfWindow').src = location;
    document.getElementById('pdfSection').style.display = 'block';
}
const deleteCheckboxes = document.querySelectorAll('.deleteCheck');
const selectAllCheck = document.getElementById('selectAllCheck');
const deleteFilesButton = document.getElementById('deleteFilesButton');
const downloadFilesButton = document.getElementById('downloadFilesButton');
const fileForm = document.getElementById('fileForm');

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

if (deleteFilesButton) {
    deleteFilesButton.addEventListener('click', () => {
        const fileForm = document.getElementById('fileForm');
        fileForm.action = `/generalResources?_method=DELETE&type=${type}`;
        fileForm.submit();
    })
}


if (downloadFilesButton) {
    downloadFilesButton.addEventListener('click', () => {
        const fileForm = document.getElementById('fileForm');
        fileForm.action = `/generalResources?_method=PUT&type=${type}`;
        fileForm.submit();
    })
}

function fileInputSubmit() {
    document.querySelector('#loadingCircle').style.display = 'block';
    document.querySelector('#fileUploadForm').submit();
}

document.querySelector('#fileInput').onchange = fileInputSubmit;

function hideLoading() {
    document.querySelector('#loadingPDF').style.display = 'none';
}

document.querySelector('title').innerHTML = `ARC ${type}`;
