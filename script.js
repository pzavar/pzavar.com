
// Modal functionality
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    modal.classList.remove('hidden');
    
    // Use setTimeout to allow the DOM to update before adding active class
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Add escape key listener
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal(modalId);
      }
    });
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    
    // Add a delay before hiding to allow animations to complete
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = ''; // Restore scrolling
    }, 300);
  }
}

// Close modal when clicking outside of content
document.addEventListener('DOMContentLoaded', function() {
  const modals = document.querySelectorAll('.project-modal');
  
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      // If the click is directly on the modal (not its children)
      if (e.target === modal) {
        const modalId = modal.getAttribute('id');
        closeModal(modalId);
      }
    });
  });

  // Add hover effect for the plus button
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const plusButton = card.querySelector('.fas.fa-plus').parentElement;
    
    card.addEventListener('mouseenter', () => {
      plusButton.classList.add('scale-110');
    });
    
    card.addEventListener('mouseleave', () => {
      plusButton.classList.remove('scale-110');
    });
  });
});
