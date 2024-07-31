const sidebarButton = document.querySelector('#sidebarToggleButton');
const sidebar = document.querySelector('#offcanvas');

function openSidebar() {
    if (!sidebarButton.classList.contains('sidebarOpen')) {
        sidebarButton.classList.toggle('sidebarOpen')
        sidebarButton.click()
    }
}

function closeSidebar() {
    const isMouseOutside = !sidebar.contains(event.relatedTarget) && !sidebarButton.contains(event.relatedTarget);
    if (isMouseOutside) {
        sidebarButton.classList.remove('sidebarOpen');
        sidebarButton.click()
    }
}

sidebarButton.addEventListener('mouseover', openSidebar)
sidebarButton.addEventListener('mouseout', closeSidebar)
sidebar.addEventListener('mouseout', closeSidebar);