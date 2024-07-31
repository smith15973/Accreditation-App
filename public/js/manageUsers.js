const rankSelects = document.querySelectorAll('.rankSelect');
rankSelects.forEach(select => {
    select.addEventListener('change', () => {
        select.parentElement.submit();
    })
})