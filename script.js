/**
 * BiyeArt Gallery — Interactive Features & Category Filtering
 * 1. Category Filter Tabs & Group Switching
 * 2. Reaction Overlay Mutual Exclusion
 * 3. Video Hover Autoplay (Muted)
 * 4. Media Spotlight Modal (Images & Videos stand out on click)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Category Filter Tabs Logic
  const filterTabs = document.querySelectorAll('.category-tab');
  const groupBlocks = document.querySelectorAll('.category-group-block');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedFilter = tab.getAttribute('data-filter');

      // Set active tab
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter category group blocks
      groupBlocks.forEach((block) => {
        const groupCategory = block.getAttribute('data-category-group');

        if (selectedFilter === 'all' || groupCategory === selectedFilter) {
          block.classList.remove('hidden');
          // Fade in animation
          block.style.opacity = '0';
          block.style.transform = 'translateY(10px)';
          setTimeout(() => {
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
          }, 30);
        } else {
          block.classList.add('hidden');
          const hiddenVideos = block.querySelectorAll('video.gallery-media');
          hiddenVideos.forEach((v) => v.pause());
        }
      });
    });
  });

  // 2. Reaction overlay mutual exclusion per card & Card interaction
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach((card) => {
    const ratingButtons = card.querySelectorAll('.rating-btn');

    ratingButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents triggering media spotlight when clicking reaction buttons
        const isCurrentlyActive = button.classList.contains('active');

        // Deselect all rating buttons in this specific card
        ratingButtons.forEach((btn) => btn.classList.remove('active'));

        // Toggle active state: activate clicked button if it wasn't already active
        if (!isCurrentlyActive) {
          button.classList.add('active');
        }
      });
    });

    // 3. Click image or video card to open in Spotlight Modal
    card.addEventListener('click', (event) => {
      if (!event.target.closest('.rating-overlay')) {
        const imageElement = card.querySelector('img.gallery-media');
        const videoElement = card.querySelector('video.gallery-media');

        if (imageElement) {
          openImageSpotlight(imageElement.getAttribute('src'), imageElement.getAttribute('alt'));
        } else if (videoElement) {
          openVideoSpotlight(videoElement.getAttribute('src'));
        }
      }
    });

    // 4. Autoplay muted strictly on hover for videos (Freeze effect)
    const video = card.querySelector('video.gallery-media');
    if (video) {
      video.muted = true;
      card.addEventListener('mouseenter', () => {
        video.muted = true;
        video.play().catch(() => {});
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // Freeze back to initial frame
      });
    }
  });

  const galleryVideos = document.querySelectorAll('video.gallery-media');

  // Spotlight Modal Elements
  const modal = document.getElementById('media-spotlight-modal');
  const modalImage = document.getElementById('spotlight-image');
  const modalVideo = document.getElementById('spotlight-video');
  const modalClose = document.getElementById('spotlight-close');
  const modalBackdrop = document.getElementById('spotlight-backdrop');

  function openImageSpotlight(src, alt) {
    if (!modal || !modalImage || !modalVideo) return;
    modalVideo.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';

    modalImage.src = src;
    modalImage.alt = alt || 'BiyeArt Gallery Piece';
    modalImage.style.display = 'block';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openVideoSpotlight(src) {
    if (!modal || !modalImage || !modalVideo) return;

    // Pause all gallery background videos while spotlight modal is active
    galleryVideos.forEach((v) => v.pause());

    modalImage.style.display = 'none';
    modalImage.src = '';

    // Strip #t= media fragment so modal plays smoothly from start
    const cleanSrc = src ? src.split('#')[0] : '';
    modalVideo.src = cleanSrc;
    modalVideo.currentTime = 0;
    modalVideo.muted = false;
    modalVideo.style.display = 'block';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    modalVideo.play().catch((err) => {
      console.warn('Browser sound autoplay policy:', err);
    });
  }

  function closeSpotlight() {
    if (!modal) return;
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }
    if (modalImage) {
      modalImage.src = '';
    }
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeSpotlight);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeSpotlight);

  // Close spotlight on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeSpotlight();
    }
  });

  // 5. Floating WhatsApp Button Visibility Observer
  const inlineWhatsappBtn = document.querySelector('.inline-whatsapp-btn');
  const floatingWhatsappBtn = document.getElementById('floating-whatsapp');

  if (inlineWhatsappBtn && floatingWhatsappBtn) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Inline button is visible in viewport -> hide floating button
          floatingWhatsappBtn.classList.add('hidden');
        } else {
          // Inline button is out of sight -> show floating button
          floatingWhatsappBtn.classList.remove('hidden');
        }
      });
    }, {
      root: null,
      threshold: 0.1
    });

    observer.observe(inlineWhatsappBtn);
  }

  // 6. Footer Product Category Links Integration
  const footerCatLinks = document.querySelectorAll('.footer-cat-link');
  footerCatLinks.forEach((catLink) => {
    catLink.addEventListener('click', () => {
      const targetFilter = catLink.getAttribute('data-target-filter');
      if (targetFilter) {
        const correspondingTab = document.querySelector(`.category-tab[data-filter="${targetFilter}"]`);
        if (correspondingTab) {
          correspondingTab.click();
        }
      }
    });
  });

  // 7. Contact Form Web3Forms API Integration
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);

      // Disable button & show loading state
      if (submitBtn && btnText) {
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
      }
      if (formStatus) {
        formStatus.style.opacity = '1';
        formStatus.className = 'form-status-msg info';
        formStatus.textContent = 'Submitting your message...';
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          if (formStatus) {
            formStatus.className = 'form-status-msg success';
            formStatus.textContent = json.message || 'Thank you! Your message has been sent successfully.';
          }
          contactForm.reset();
        } else {
          if (formStatus) {
            formStatus.className = 'form-status-msg error';
            formStatus.textContent = json.message || 'Something went wrong. Please check your Web3Forms access key.';
          }
        }
      })
      .catch((error) => {
        console.error('Web3Forms Error:', error);
        if (formStatus) {
          formStatus.className = 'form-status-msg error';
          formStatus.textContent = 'Network error. Please check your connection and try again.';
        }
      })
      .then(function() {
        if (submitBtn && btnText) {
          submitBtn.disabled = false;
          btnText.textContent = 'Send Message';
        }
        setTimeout(() => {
          if (formStatus) {
            formStatus.style.opacity = '0';
            setTimeout(() => {
              formStatus.textContent = '';
              formStatus.style.opacity = '1';
              formStatus.className = 'form-status-msg';
            }, 300);
          }
        }, 6000);
      });
    });
  }

  // 8. Dynamic Real-Time Copyright Year Update
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 10. Hero Quick Category Navigation Chips
  const heroCatChips = document.querySelectorAll('.hero-cat-chip');
  heroCatChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const target = chip.getAttribute('data-target');
      if (target) {
        const correspondingTab = document.querySelector(`.category-tab[data-filter="${target}"]`);
        if (correspondingTab) {
          correspondingTab.click();
        }
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 11. Dynamic 3D Fluid Resin Video Background Carousel
  initHeroVideoCarousel();

  function initHeroVideoCarousel() {
    const videoLayers = document.querySelectorAll('.hero-bg-video');
    const heroSection = document.getElementById('home');
    if (!videoLayers || videoLayers.length <= 1) return;

    let activeIndex = 0;
    let carouselTimer = null;
    let isHeroVisible = true;

    // Ensure all background videos are muted, looped, and playsInline
    videoLayers.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
    });

    function playActiveVideo() {
      const activeVideo = videoLayers[activeIndex];
      if (activeVideo) {
        activeVideo.play().catch(() => {
          const unlockAutoplay = () => {
            if (isHeroVisible) activeVideo.play().catch(() => {});
            window.removeEventListener('click', unlockAutoplay);
            window.removeEventListener('touchstart', unlockAutoplay);
            window.removeEventListener('scroll', unlockAutoplay);
          };
          window.addEventListener('click', unlockAutoplay, { once: true });
          window.addEventListener('touchstart', unlockAutoplay, { once: true });
          window.addEventListener('scroll', unlockAutoplay, { once: true });
        });
      }
    }

    function startCarousel() {
      if (carouselTimer) return;
      playActiveVideo();
      carouselTimer = setInterval(() => {
        if (!isHeroVisible) return;
        videoLayers[activeIndex].classList.remove('active');
        activeIndex = (activeIndex + 1) % videoLayers.length;
        videoLayers[activeIndex].classList.add('active');
        videoLayers[activeIndex].play().catch(() => {});
      }, 7500);
    }

    function stopCarousel() {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
      videoLayers.forEach((v) => v.pause());
    }

    // Mobile Performance Optimization: Pause hero videos completely when scrolling through Catalogue
    if ('IntersectionObserver' in window && heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isHeroVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            startCarousel();
          } else {
            stopCarousel();
          }
        });
      }, { threshold: 0.05 });

      heroObserver.observe(heroSection);
    } else {
      startCarousel();
    }
  }
});
