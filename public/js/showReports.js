const socket = io();
socket.on('reportTableStatusUpdate', data => {
    const seg = data.seg;
    const allPrograms = data.allPrograms

    //get each cell for the seg
    const incompleteElement = document.querySelector('#incomplete-' + seg._id);
    const uploadedElement = document.querySelector('#uploaded-' + seg._id);
    const reviewedElement = document.querySelector('#reviewed-' + seg._id);
    const approvedElement = document.querySelector('#approved-' + seg._id);
    const submittedElement = document.querySelector('#submitted-' + seg._id);

    let incomplete = 0;
    let uploaded = 0;
    let reviewed = 0;
    let approved = 0;
    let submitted = 0;

    // Count the number of programs in each status
    for (let program of seg.segPrograms) {
        if (program.status === 'Incomplete') {
            ++incomplete
        }
        if (program.status === 'Uploaded') {
            ++uploaded
        }
        if (program.status === 'Reviewed') {
            ++uploaded
            ++reviewed
        }
        if (program.status === 'Approved') {
            ++uploaded
            ++reviewed
            ++approved
        }
        if (program.status === 'Submitted') {
            ++uploaded
            ++reviewed
            ++approved
            ++submitted
        }
    }

    // Update the counts in the table and color them green if all programs are in that status
    if (incompleteElement) {
        incompleteElement.innerHTML = `${incomplete}/${seg.segPrograms.length}`
        if (incomplete === 0) {
            incompleteElement.style.backgroundColor = 'lightGreen';
        } else {
            incompleteElement.style.backgroundColor = 'white';
        }
    }
    if (uploadedElement) {
        uploadedElement.innerHTML = `${uploaded}/${seg.segPrograms.length}`
        if (uploaded === seg.segPrograms.length) {
            uploadedElement.style.backgroundColor = 'lightGreen';
        } else {
            uploadedElement.style.backgroundColor = 'white';
        }
    }
    if (reviewedElement) {
        reviewedElement.innerHTML = `${reviewed}/${seg.segPrograms.length}`
        if (reviewed === seg.segPrograms.length) {
            reviewedElement.style.backgroundColor = 'lightGreen';
        } else {
            reviewedElement.style.backgroundColor = 'white';
        }
    }
    if (approvedElement) {
        approvedElement.innerHTML = `${approved}/${seg.segPrograms.length}`
        if (approved === seg.segPrograms.length) {
            approvedElement.style.backgroundColor = 'lightGreen';
        } else {
            approvedElement.style.backgroundColor = 'white';
        }
    }
    if (submittedElement) {
        submittedElement.innerHTML = `${submitted}/${seg.segPrograms.length}`
        if (submitted === seg.segPrograms.length) {
            submittedElement.style.backgroundColor = 'lightGreen';
        } else {
            submittedElement.style.backgroundColor = 'white';
        }
    }

    //get the each of the total cells
    const tincompleteElement = document.querySelector('#totalIncomplete-' + seg.segInstruction.team[0] + seg.segInstruction.department[0]);
    const tuploadedElement = document.querySelector('#totalUploaded-' + seg.segInstruction.team[0] + seg.segInstruction.department[0]);
    const treviewedElement = document.querySelector('#totalReviewed-' + seg.segInstruction.team[0] + seg.segInstruction.department[0]);
    const tapprovedElement = document.querySelector('#totalApproved-' + seg.segInstruction.team[0] + seg.segInstruction.department[0]);
    const tsubmittedElement = document.querySelector('#totalSubmitted-' + seg.segInstruction.team[0] + seg.segInstruction.department[0]);

    // find the total counts
    const totalIncomplete = allPrograms.filter(program => program.status === 'Incomplete').length
    const totalUploaded = allPrograms.filter(program => program.status === 'Uploaded' || program.status === 'Reviewed' || program.status === 'Approved' || program.status === 'Submitted').length
    const totalReviewed = allPrograms.filter(program => program.status === 'Reviewed' || program.status === 'Approved' || program.status === 'Submitted').length
    const totalApproved = allPrograms.filter(program => program.status === 'Approved' || program.status === 'Submitted').length
    const totalSubmitted = allPrograms.filter(program => program.status === 'Submitted').length

    // Update the total counts in the table and color them green if all programs are in that status
    tincompleteElement.innerHTML = `${totalIncomplete}/${allPrograms.length}`
    if (totalIncomplete === 0) {
        tincompleteElement.style.backgroundColor = 'lightGreen';
    } else {
        tincompleteElement.style.backgroundColor = 'white';
    }
    tuploadedElement.innerHTML = `${totalUploaded}/${allPrograms.length}`
    if (totalUploaded === allPrograms.length) {
        tuploadedElement.style.backgroundColor = 'lightGreen';
    } else {
        tuploadedElement.style.backgroundColor = 'white';
    }
    treviewedElement.innerHTML = `${totalReviewed}/${allPrograms.length}`
    if (totalReviewed === allPrograms.length) {
        treviewedElement.style.backgroundColor = 'lightGreen';
    } else {
        treviewedElement.style.backgroundColor = 'white';
    }
    tapprovedElement.innerHTML = `${totalApproved}/${allPrograms.length}`
    if (totalApproved === allPrograms.length) {
        tapprovedElement.style.backgroundColor = 'lightGreen';
    } else {
        tapprovedElement.style.backgroundColor = 'white';
    }
    tsubmittedElement.innerHTML = `${totalSubmitted}/${allPrograms.length}`
    if (totalSubmitted === allPrograms.length) {
        tsubmittedElement.style.backgroundColor = 'lightGreen';
    } else {
        tsubmittedElement.style.backgroundColor = 'white';
    }
})

