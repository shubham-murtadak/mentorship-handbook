document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     OFFER LIGHTBOX MODAL
     ========================================================================== */
  const modalOverlay = document.getElementById('offer-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const offerButtons = document.querySelectorAll('.offer-action');

  offerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgName = button.getAttribute('data-image');
      const companyName = button.getAttribute('data-company');

      if (imgName) {
        // Set image source and company title
        modalImg.src = `redacted_offers/${imgName}`;
        modalTitle.textContent = companyName;

        // Open modal with smooth fade
        modalOverlay.style.display = 'flex';
        // Allow display style change to register before starting transition
        setTimeout(() => {
          modalOverlay.classList.add('active');
        }, 10);
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.style.display = 'none';
      modalImg.src = ''; // Clear image to avoid flash next time
    }, 300); // Matches transition duration in CSS
  };

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    // Only close if user clicked directly on the overlay backdrop
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     INTERACTIVE ROADMAP ACCORDION
     ========================================================================== */
  const roadmapCards = document.querySelectorAll('.roadmap-card');

  // Open first step by default
  const firstStep = document.querySelector('.roadmap-step');
  if (firstStep) {
    firstStep.classList.add('active');
    const firstContent = firstStep.querySelector('.roadmap-content');
    if (firstContent) {
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }

  roadmapCards.forEach(card => {
    card.addEventListener('click', () => {
      const step = card.closest('.roadmap-step');
      const content = step.querySelector('.roadmap-content');
      const isActive = step.classList.contains('active');

      // Optional: Close all other steps first (accordion behavior)
      document.querySelectorAll('.roadmap-step').forEach(otherStep => {
        if (otherStep !== step) {
          otherStep.classList.remove('active');
          const otherContent = otherStep.querySelector('.roadmap-content');
          if (otherContent) {
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      // Toggle current step
      if (isActive) {
        step.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        step.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Toggle current FAQ item
      if (isActive) {
        item.classList.remove('active');
      } else {
        // Close others
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     SCROLL OFFSET SCROLLING FOR NAVBAR LINKS
     ========================================================================== */
  const navLinks = document.querySelectorAll('nav a');
  const headerHeight = document.querySelector('header').offsetHeight;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
