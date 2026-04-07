document.addEventListener('DOMContentLoaded', () => {
    // Get user account status
    // const accountStatus = localStorage.getItem('accountStatus') || 'Basic';
    // const accountTypeElement = document.querySelector('.account-type h3');
    // if (accountTypeElement) {
    //     accountTypeElement.textContent = `${accountStatus} Account`;
    // }

    // Handle upgrade button click
    const upgradeBtn = document.querySelector('.upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
            window.location.href = '/upgrade/';
        });
    }
});
