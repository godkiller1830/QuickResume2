export function showLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.classList.add('active');
}

export function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.classList.remove('active');
}
