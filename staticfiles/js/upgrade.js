document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('upgradeModal');
    const closeBtn = document.querySelector('.close');
    const selectTierBtns = document.querySelectorAll('.select-tier-btn');
    const selectedTierSpan = document.getElementById('selectedTier');

    // Initialize modal
    if (!modal || !closeBtn || !selectedTierSpan) {
        console.error('Modal elements not found');
        return;
    }

    // Show modal when a tier button is clicked
    selectTierBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tier = this.getAttribute('data-tier');
            console.log('Opening modal for tier:', tier);
            selectedTierSpan.textContent = tier;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Function to close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of it
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // For debugging
    console.log('Modal setup complete');
    console.log('Found tier buttons:', selectTierBtns.length);
});
