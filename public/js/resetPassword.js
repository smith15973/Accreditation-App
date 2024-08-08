document.querySelector('title').innerHTML = 'ARC Reset Password';


const password0 = document.getElementById('password0');
const password1 = document.getElementById('password1');
const charCount = document.getElementById('charCount');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const special = document.getElementById('special');
const match = document.getElementById('match');

password0.addEventListener('input', () => {
    const value = password0.value;
    // Validate length
    if (value.length >= 8 && value.length <= 25) {
        charCount.style.color = '#198754'; // Green
    } else {
        charCount.style.color = '#DC3545'; // Red
    }
    // Validate uppercase
    if (/[A-Z]/.test(value)) {
        uppercase.style.color = '#198754'; // Green
    } else {
        uppercase.style.color = '#DC3545'; // Red
    }
    // Validate lowercase
    if (/[a-z]/.test(value)) {
        lowercase.style.color = '#198754'; // Green
    } else {
        lowercase.style.color = '#DC3545'; // Red
    }
    // Validate special character
    if (/[!@#$%^&*]/.test(value)) {
        special.style.color = '#198754'; // Green
    } else {
        special.style.color = '#DC3545'; // Red
    }
    // Validate matching
    if (password0.value === password1.value) {
        match.style.color = '#198754'; // Green
    } else {
        match.style.color = '#DC3545'; // Red
    }
});

password1.addEventListener('input', () => {
    // Validate matching
    if (password0.value === password1.value) {
        match.style.color = '#198754'; // Green
    } else {
        match.style.color = '#DC3545'; // Red
    }
})