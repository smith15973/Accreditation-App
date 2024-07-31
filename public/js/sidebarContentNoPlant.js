// JavaScript to handle toggling of nested lists
document.addEventListener('DOMContentLoaded', function () {
    const nestedLists = document.querySelectorAll('li > ul');

    nestedLists.forEach(nestedList => {
        const parentLi = nestedList.parentElement;

        parentLi.addEventListener('click', function (e) {
            if (e.target === parentLi || e.target.tagName === 'A') {
                e.stopPropagation();
                const isExpanded = parentLi.classList.contains('expanded');

                nestedList.style.display = isExpanded ? 'none' : 'block';
                parentLi.classList.toggle('expanded', !isExpanded);
            }
        });
    });
});

document.querySelectorAll('.clickable-li').forEach(item => {
    item.addEventListener('click', function () {
        window.location.href = this.dataset.url;
    });
});