
// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMenuButton = document.getElementById('close-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
  const logoLink = document.querySelector('header a.gradient-text');

  // Toggle mobile menu
  mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('translate-x-full');
    document.body.classList.toggle('overflow-hidden');
  });

  // Close menu
  closeMenuButton.addEventListener('click', function() {
    mobileMenu.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  });

  // Close menu when clicking on links
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    });
  });
  
  // Smooth scroll to top when clicking logo on home page
  if (logoLink && window.location.pathname.endsWith('index.html') || 
      window.location.pathname === '/' || 
      window.location.pathname === '') {
    logoLink.addEventListener('click', function(e) {
      // Only handle if we're already on the home page
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }
});

// Modal functionality
// Enhanced modal functionality
function openModal(modalId) {
  console.log("Opening modal:", modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    // Prevent body scroll but allow modal to scroll
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hidden');

    // Force reflow before adding active class for animation
    modal.offsetWidth;

    // Add active class to trigger animation
    modal.classList.add('active');

    // Get the modal content element for scrolling
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      // Reset scroll position to top
      modalContent.scrollTop = 0;
    }

    // Set up modal for proper scrolling
    setupModalScrolling(modal);

    // Add escape key listener
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal(modalId);
        document.removeEventListener('keydown', escapeHandler);
      }
    });
    
    // Log modal dimensions - debugging
    console.log("Modal dimensions:", {
      windowHeight: window.innerHeight,
      modalHeight: modal.offsetHeight,
      containerHeight: modal.querySelector('.modal-container')?.offsetHeight,
      contentHeight: modalContent?.offsetHeight
    });
  } else {
    console.error("Modal not found:", modalId);
  }
}

function setupModalScrolling(modal) {
  const modalContainer = modal.querySelector('.modal-container');
  const modalContent = modal.querySelector('.modal-content');
  const modalHeader = modal.querySelector('.modal-header');
  
  if (!modalContainer || !modalContent) return;
  
  // Force scrollable content for all modals
  modalContainer.style.maxHeight = '90vh';
  modalContainer.style.display = 'flex';
  modalContainer.style.flexDirection = 'column';
  
  // Calculate header height
  const headerHeight = modalHeader ? modalHeader.offsetHeight : 0;
  
  // Set fixed height for content area with scrolling
  modalContent.style.maxHeight = `calc(90vh - ${headerHeight}px)`;
  modalContent.style.height = 'auto';
  modalContent.style.overflowY = 'auto';
  modalContent.style.overflowX = 'hidden';
  
  // Add bottom padding for better appearance
  modalContent.style.paddingBottom = '30px';
  
  // Ensure all content is visible by adding additional padding
  const contentHeight = modalContent.scrollHeight;
  const visibleHeight = modalContent.clientHeight;
  
  // If content is taller than visible area, add more padding at bottom
  if (contentHeight > visibleHeight) {
    modalContent.style.paddingBottom = '60px';
  }
  
  // Fix for potential iOS scrolling issues
  setTimeout(() => {
    modalContent.style.webkitOverflowScrolling = 'touch';
    
    // Force a reflow to ensure scrolling works
    modalContent.style.display = 'none';
    modalContent.offsetHeight; // Force reflow
    modalContent.style.display = 'block';
    
    console.log("Modal content setup for scrolling", {
      modalId: modal.id,
      contentHeight: modalContent.scrollHeight,
      availableHeight: modalContent.clientHeight
    });
  }, 50);
}

function closeModal(modalId) {
  console.log("Closing modal:", modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');

    // Add a delay before hiding to allow animations to complete
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = ''; // Restore body scrolling
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

  // Add visual feedback for book cards (Reading List page)
  const bookCards = document.querySelectorAll('.book-card');
  bookCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('img').style.transform = 'scale(1.05)';
    });

    card.addEventListener('mouseleave', () => {
      card.querySelector('img').style.transform = 'scale(1)';
    });
  });
});

// Animate books on Reading List page when they come into view
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.book-card')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.book-card').forEach(card => {
      card.style.opacity = '0';
      observer.observe(card);
    });
  }

  // Education section video parallax effect
  const educationSection = document.getElementById('education');
  if (educationSection) {
    window.addEventListener('scroll', throttleScroll(function() {
      const rect = educationSection.getBoundingClientRect();
      const isVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

      if (isVisible) {
        const videoContainer = educationSection.querySelector('.video-container');
        if (videoContainer) {
          // Calculate how far into the section we've scrolled (0 to 1)
          const scrollProgress = Math.min(
            Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)),
            1
          );

          // Apply subtle scale effect similar to main video
          const scale = 1 + (scrollProgress * 0.1);
          // Apply subtle parallax effect
          const translateY = scrollProgress * -30; // Negative value moves it upward as you scroll down

          requestAnimationFrame(() => {
            videoContainer.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          });
        }
      }
    }, 16));
  }
});
