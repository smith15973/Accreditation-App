document.querySelector('title').innerHTML = 'ARC Register';

const password = document.getElementById('password');
const charCount = document.getElementById('charCount');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const special = document.getElementById('special');

password.addEventListener('input', () => {
    const value = password.value;
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
});