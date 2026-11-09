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
  const modal = document.getElementById(modalId);
  if (!modal) return;

  document.body.style.overflow = 'hidden';
  modal.classList.remove('hidden');

  modal.offsetWidth; // Force reflow before animation

  modal.classList.add('active');

  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) {
    modalContent.scrollTop = 0;
  }

  setupModalScrolling(modal);

  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeModal(modalId);
      document.removeEventListener('keydown', escapeHandler);
    }
  });
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
    
  }, 50);
}

function closeModal(modalId) {
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

// Throttle helper for scroll events
const throttleScroll = (callback, wait) => {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last >= wait) {
      callback();
      last = now;
    }
  };
};

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

// Click-to-load video embeds: <button class="video-facade" data-embed="URL" data-title="..."> becomes an iframe on click
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.video-facade[data-embed]').forEach(function(facade) {
    facade.addEventListener('click', function() {
      const iframe = document.createElement('iframe');
      iframe.src = facade.dataset.embed;
      iframe.title = facade.dataset.title || 'Demo video';
      iframe.className = 'video-frame';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      facade.replaceWith(iframe);
    });
  });
});

// Hero background video. The still image (.hero-still) is always shown first; the video is attached only
// after the page has finished loading, and never on phones, with "reduce motion" on, or with data saver on.
(function() {
  var video = document.getElementById('hero-video');
  if (!video || !video.dataset.src) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var phone = window.matchMedia('(max-width: 767px)');
  var saveData = navigator.connection && navigator.connection.saveData;

  function start() {
    if (reduceMotion.matches || phone.matches || saveData) return;
    video.src = video.dataset.src;
    video.addEventListener('playing', function() { video.classList.add('is-playing'); }, { once: true });
    var p = video.play();
    if (p && p.catch) p.catch(function() {}); // autoplay blocked: the still image stays

    // Pause while the hero is off screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !reduceMotion.matches) { var q = video.play(); if (q && q.catch) q.catch(function() {}); }
        else { video.pause(); }
      }).observe(video.closest('section') || video);
    }
  }

  // Stop if the visitor turns on "reduce motion" while the page is open
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', function(e) {
      if (e.matches) { video.pause(); video.classList.remove('is-playing'); }
    });
  }

  function schedule() {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 300);
  }
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule);
})();
