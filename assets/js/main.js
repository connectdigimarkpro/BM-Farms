// JavaScript for BM Farms Website Interactivity

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initGallery();
  initContactForm();
});

// 1. Sticky Navbar & Mobile Menu
function initNavbar() {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

  // Sticky border scroll toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md');
      header.classList.remove('border-transparent');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('border-transparent');
    }
  });

  // Mobile drawer toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.className = 'fa-solid fa-bars text-xl';
      } else {
        icon.className = 'fa-solid fa-xmark text-xl';
      }
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = 'fa-solid fa-bars text-xl';
      });
    });
  }
}

// 2. Animated Stats Counters
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const speed = parseInt(el.getAttribute('data-speed') || '2000', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const increment = target / (speed / 16); // ~60fps
    let current = 0;

    const updateValue = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(updateValue);
      }
    };
    
    updateValue();
  };

  // Run observer to trigger only when section enters viewport
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target); // Run once
      }
    });
  }, { threshold: 0.1 });

  counterElements.forEach(el => observer.observe(el));
}

// 3. Gallery Filtering and Lightbox
function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryGrid = document.getElementById('gallery-grid');
  const gallerySection = document.getElementById('gallery');
  
  // Lightbox Elements
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!galleryGrid) return;

  // We will hold active list of filtered items for lightbox navigation
  let activeGalleryItems = [];
  let currentActiveIndex = 0;
  let isGalleryRendered = false;

  // Filter click binding
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active styling
      filterButtons.forEach(b => {
        b.classList.remove('bg-emerald-800', 'text-white');
        b.classList.add('bg-gray-100', 'text-gray-750', 'hover:bg-gray-200');
      });
      btn.classList.add('bg-emerald-800', 'text-white');
      btn.classList.remove('bg-gray-100', 'text-gray-750', 'hover:bg-gray-200');

      const category = btn.getAttribute('data-category');
      renderGallery(category);
    });
  });

  // Render gallery cards based on category
  function renderGallery(category = 'all') {
    isGalleryRendered = true;
    galleryGrid.innerHTML = '';
    
    // Filter IMAGES dataset (linked in images-data.js)
    // Show only a selected high-quality representation of images to keep grid neat (e.g., max 16 items)
    // We can showcase the best image for each category, but list all in the catalog
    let filtered = IMAGES;
    if (category !== 'all') {
      filtered = IMAGES.filter(img => img.category === category);
    } else {
      // For "all", pick the top 16 most visual ones so page is not cluttered with 90 items
      const featuredFiles = [
        "WhatsApp Image 2026-06-18 at 12.38.32.jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.33.jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.34 (2).jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.34 (5).jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.34 (15).jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.34 (16).jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.13 (20).jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.13 (22).jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.13 (30).jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.59.jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.59 (1).jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.02.jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.11 (1).jpeg",
        "WhatsApp Image 2026-06-18 at 12.42.13 (1).jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.34 (10).jpeg",
        "WhatsApp Image 2026-06-18 at 12.38.34 (18).jpeg"
      ];
      filtered = IMAGES.filter(img => featuredFiles.includes(img.filename));
    }

    activeGalleryItems = filtered;

    filtered.forEach((img, idx) => {
      const col = document.createElement('div');
      col.className = 'group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover-lift cursor-pointer';
      col.setAttribute('data-aos', 'fade-up');
      col.setAttribute('data-aos-delay', (idx * 50) % 200);

      const imgSrc = `assets/images/${encodeURIComponent(img.filename)}`;

      col.innerHTML = `
        <div class="relative overflow-hidden h-64 bg-gray-50 flex items-center justify-center">
          <img class="object-cover w-full h-full transform transition duration-500 group-hover:scale-105" src="${imgSrc}" alt="${img.title}" loading="lazy" decoding="async" width="640" height="480">
          <div class="absolute inset-0 bg-emerald-900 bg-opacity-0 group-hover:bg-opacity-80 transition duration-300 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100">
            <span class="text-xs font-semibold text-emerald-300 uppercase tracking-widest mb-1">${img.category}</span>
            <h4 class="text-white text-lg font-bold truncate">${img.title}</h4>
            <p class="text-gray-200 text-xs mt-2 line-clamp-2">${img.desc}</p>
            <div class="absolute top-4 right-4 bg-white bg-opacity-25 rounded-full p-2 text-white">
              <i class="fa-solid fa-expand text-sm"></i>
            </div>
          </div>
        </div>
      `;

      col.addEventListener('click', () => {
        openLightbox(idx);
      });

      galleryGrid.appendChild(col);
    });
  }

  // Open Lightbox
  function openLightbox(index) {
    currentActiveIndex = index;
    const item = activeGalleryItems[currentActiveIndex];
    if (!item) return;

    const imgSrc = `assets/images/${encodeURIComponent(item.filename)}`;
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    
    lightbox.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  // Lightbox Navigations
  function showNext() {
    currentActiveIndex = (currentActiveIndex + 1) % activeGalleryItems.length;
    openLightbox(currentActiveIndex);
  }

  function showPrev() {
    currentActiveIndex = (currentActiveIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    openLightbox(currentActiveIndex);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
    
    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });

    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') {
        lightbox.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  const renderInitialGallery = () => {
    if (isGalleryRendered) return;
    renderGallery('all');
  };

  // Initial render only when the gallery is close to entering the viewport.
  if (gallerySection && 'IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          renderInitialGallery();
          obs.disconnect();
        }
      });
    }, { rootMargin: '250px 0px' });

    galleryObserver.observe(gallerySection);
  } else {
    renderInitialGallery();
  }
}

// 5. Contact Form Handler (Simulated)
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect values
    const name = document.getElementById('form-name').value;
    const phone = document.getElementById('form-phone').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    // Show visual loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Sending message...`;

    setTimeout(() => {
      // Simulate success response
      submitBtn.className = "w-full bg-green-600 text-white rounded-lg py-3 font-bold shadow-lg flex items-center justify-center gap-2";
      submitBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> Message Sent Successfully!`;

      // Alert or notification
      alert(`Thank you ${name}! We have received your inquiry. A representative from BM Farms will contact you on ${phone} shortly.`);

      // Reset
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.className = "w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg py-3 font-bold transition shadow-lg flex items-center justify-center gap-2";
        submitBtn.innerHTML = originalText;
      }, 3000);
    }, 1500);
  });
}
