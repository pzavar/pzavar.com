
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
// Enhanced modal functionality with accessibility improvements
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

    // Accessibility: Add role, aria attributes
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
      modalContainer.setAttribute('role', 'dialog');
      modalContainer.setAttribute('aria-modal', 'true');
      modalContainer.setAttribute('aria-labelledby', `${modalId}-title`);
      modalContainer.setAttribute('aria-describedby', `${modalId}-content`);
      
      // Find the close button and improve its accessibility
      const closeButton = modalContainer.querySelector('.modal-close');
      if (closeButton) {
        closeButton.setAttribute('aria-label', 'Close dialog');
      }
      
      // Focus the first focusable element inside the modal
      setTimeout(() => {
        const focusableElements = modalContainer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);
    }

    // Get the modal content element for scrolling
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      // Reset scroll position to top
      modalContent.scrollTop = 0;
    }

    // Position modal to ensure visibility with top margin
    positionModal(modal);

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

function positionModal(modal) {
  // Ensure the modal is positioned with proper margins
  const modalContainer = modal.querySelector('.modal-container');
  if (modalContainer) {
    // Always scroll to top when opening
    modal.scrollTop = 0;
    
    // Check if modal is too tall for viewport
    const viewportHeight = window.innerHeight;
    const modalHeight = modalContainer.offsetHeight;
    
    if (modalHeight > viewportHeight - 24) { // If taller than viewport minus margins
      // Set a max-height to ensure it fits with margin
      modalContainer.style.height = `${viewportHeight - 24}px`;
    } else {
      // Reset any previously set height
      modalContainer.style.height = '';
    }
  }
}

function closeModal(modalId) {
  console.log("Closing modal:", modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');

    // Store the element that had focus before the modal was opened
    const lastFocusedElement = document.activeElement;
    
    // Find the trigger that opened the modal if possible
    const possibleTrigger = document.querySelector(`[onclick*="openModal('${modalId}')"]`);

    // Add a delay before hiding to allow animations to complete
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = ''; // Restore body scrolling
      
      // Return focus to the element that opened the modal for better keyboard navigation
      if (possibleTrigger) {
        possibleTrigger.focus();
      }
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
