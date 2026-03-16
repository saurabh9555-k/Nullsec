(function() {
  'use strict';

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  const html = document.documentElement;

  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });
  }

  function updateThemeIcon(theme) {
    if (!sunIcon || !moonIcon) return;
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('active');
      mobileNav.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
      const icon = mobileMenuToggle.querySelector('iconify-icon');
      if (icon) {
        icon.setAttribute('icon', isOpen ? 'lucide:menu' : 'lucide:x');
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuToggle.querySelector('iconify-icon');
        if (icon) icon.setAttribute('icon', 'lucide:menu');
      }
    });
  }

  // Scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Cart functionality (shared across pages)
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const cartBadge = document.querySelector('.cart-badge');

  function updateCartBadge(count) {
    if (cartBadge) {
      cartBadge.textContent = count;
      // Store in localStorage for persistence across pages
      localStorage.setItem('cartCount', count);
    }
  }

  // Initialize cart count from localStorage
  let cartCount = parseInt(localStorage.getItem('cartCount')) || 2; // default 2 for demo
  updateCartBadge(cartCount);

  document.querySelectorAll('.btn-sm, .btn-add').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const productCard = e.target.closest('.product-card');
      if (!productCard) return;

      const productNameElem = productCard.querySelector('.product-name');
      const productName = productNameElem ? productNameElem.textContent : 'Item';

      // Show toast
      if (toast && toastMessage) {
        toastMessage.textContent = `${productName} added to cart!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }

      // Increment cart count
      cartCount += 1;
      updateCartBadge(cartCount);
    });
  });

  // Product card click (navigate to product page – demo only)
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-sm, .btn-add')) {
        const productName = card.querySelector('.product-name')?.textContent;
        console.log(`Navigate to product: ${productName}`);
        // In a real app, you'd go to product.html?id=...
      }
    });
  });

  // Active navigation highlighting (based on current page)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Lazy loading fallback
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          obs.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }
})();