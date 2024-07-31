document.addEventListener('DOMContentLoaded', () => {
    const editors = document.querySelectorAll('div.nicEdit-main').forEach((element, i) => {
        element.setAttribute('style', 'width: 100%'); // Add width property
        element.setAttribute('style', 'min-height: 300px;'); // Add height property
    });
});

let originalText;
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.nicEdit-main')) {
        originalText = document.querySelector('.nicEdit-main').innerHTML;
    }
})

let programCount = 1;

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

        document.querySelector('form').addEventListener('submit', async (e) => {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.value === '') {
                    input.disabled = true;
                } else {
                    input.disabled = false;
                }
            })
        })
