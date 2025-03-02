
// Modal functionality
function openModal(modalId) {
  console.log("Opening modal:", modalId); // Debug log
  const modal = document.getElementById(modalId);
  if (modal) {
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    modal.classList.remove('hidden');
    
    // Force reflow before adding active class for animation
    modal.offsetWidth;
    
    // Add active class to trigger animation
    modal.classList.add('active');
    
    // Add escape key listener
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal(modalId);
        document.removeEventListener('keydown', escapeHandler);
      }
    });
  } else {
    console.error("Modal not found:", modalId);
  }
}

function closeModal(modalId) {
  console.log("Closing modal:", modalId); // Debug log
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

  // Add visual feedback for clickable project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover:scale-[1.02]');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover:scale-[1.02]');
    });
  });
});
