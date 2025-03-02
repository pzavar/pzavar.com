// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMenuButton = document.getElementById('close-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

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
});

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
});

// Video parallax effect
document.addEventListener('DOMContentLoaded', function() {
  const videoParallax = document.querySelector('.video-parallax-container');
  if (videoParallax) {
    window.addEventListener('scroll', function() {
      // Get the vertical scroll position
      const scrollPosition = window.scrollY;

      // Get the position of the video section
      const videoSection = document.querySelector('.video-parallax-container').closest('section');
      const videoSectionTop = videoSection.offsetTop;
      const videoSectionHeight = videoSection.offsetHeight;

      // Check if we're in the vicinity of the video section
      if (scrollPosition > videoSectionTop - window.innerHeight && 
          scrollPosition < videoSectionTop + videoSectionHeight) {

        // Calculate a relative position within the section
        const relativePosition = (scrollPosition - (videoSectionTop - window.innerHeight)) / 
                                 (videoSectionHeight + window.innerHeight);

        // Apply parallax effect - move video slower than scroll rate
        const translateY = relativePosition * 50; // Adjust the 50 value to control the parallax intensity

        videoParallax.style.transform = `translateY(${translateY}px)`;

        // Optional: Adjust opacity based on scroll position
        const opacity = Math.max(0, 1 - relativePosition * 1.5);
        videoParallax.style.opacity = opacity;
      }
    });
  }
});