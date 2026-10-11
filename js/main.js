/**
 * FOBS Team - Main Client-Side JavaScript
 * Pure Vanilla JavaScript: Multi-Filter Library, Search, Sorting, Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initSpotlightSlider();
  initLibraryFilters();
  initBackToTop();
  highlightActiveNav();
  initDetailsPageHero();
});

/* ==========================================================================
   1. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('siteNav');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      }
    });
  }
}

/* ==========================================================================
   2. Library Search, Multi-Filter & Sorting
   ========================================================================== */
function initLibraryFilters() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const typeFilter = document.getElementById('typeFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const countryFilter = document.getElementById('countryFilter');
  const yearFilter = document.getElementById('yearFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const countEl = document.getElementById('visibleCount');
  const emptyBox = document.getElementById('libraryEmptyBox');
  const gridContainer = document.getElementById('movieGrid');

  if (!gridContainer) return;

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedType = typeFilter ? typeFilter.value : '';
    const selectedCat = categoryFilter ? categoryFilter.value : '';
    const selectedCountry = countryFilter ? countryFilter.value : '';
    const selectedYear = yearFilter ? yearFilter.value : '';
    const selectedSort = sortFilter ? sortFilter.value : 'newest';

    if (clearSearchBtn) {
      clearSearchBtn.style.display = query ? 'block' : 'none';
    }

    const cards = Array.from(gridContainer.querySelectorAll('.movie-card-anchor'));
    let matchCount = 0;

    cards.forEach((cardLink) => {
      const card = cardLink.querySelector('.movie-card');
      if (!card) return;

      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const type = (card.getAttribute('data-type') || '').toLowerCase();
      const year = card.getAttribute('data-year') || '';
      const country = card.getAttribute('data-country') || '';
      const category = card.getAttribute('data-category') || '';
      const genre = (card.getAttribute('data-genre') || '').toLowerCase();

      const matchesSearch = !query || title.includes(query) || genre.includes(query);
      const matchesType = !selectedType || type === selectedType.toLowerCase();
      const matchesCat = !selectedCat || category.toLowerCase() === selectedCat.toLowerCase();
      const matchesCountry = !selectedCountry || country.toLowerCase() === selectedCountry.toLowerCase();
      const matchesYear = !selectedYear || year === selectedYear;

      if (matchesSearch && matchesType && matchesCat && matchesCountry && matchesYear) {
        cardLink.style.display = 'block';
        matchCount++;
      } else {
        cardLink.style.display = 'none';
      }
    });

    // Handle Sorting
    cards.sort((a, b) => {
      const cardA = a.querySelector('.movie-card');
      const cardB = b.querySelector('.movie-card');
      const titleA = (cardA.getAttribute('data-title') || '').toLowerCase();
      const titleB = (cardB.getAttribute('data-title') || '').toLowerCase();
      const yearA = parseInt(cardA.getAttribute('data-year') || '0', 10);
      const yearB = parseInt(cardB.getAttribute('data-year') || '0', 10);

      if (selectedSort === 'title-asc') return titleA.localeCompare(titleB);
      if (selectedSort === 'title-desc') return titleB.localeCompare(titleA);
      if (selectedSort === 'oldest') return yearA - yearB;
      // Default: newest
      return yearB - yearA;
    });

    // Re-append in sorted order
    cards.forEach((c) => gridContainer.appendChild(c));

    if (countEl) countEl.textContent = matchCount;
    if (emptyBox) emptyBox.style.display = matchCount === 0 ? 'block' : 'none';
  }

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (countryFilter) countryFilter.addEventListener('change', applyFilters);
  if (yearFilter) yearFilter.addEventListener('change', applyFilters);
  if (sortFilter) sortFilter.addEventListener('change', applyFilters);

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        applyFilters();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (typeFilter) typeFilter.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (countryFilter) countryFilter.value = '';
      if (yearFilter) yearFilter.value = '';
      if (sortFilter) sortFilter.value = 'newest';
      applyFilters();
    });
  }

  // Allow quick filter pills (categories & types)
  document.querySelectorAll('[data-filter-category]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-filter-category');
      if (typeFilter) typeFilter.value = '';
      if (categoryFilter) {
        categoryFilter.value = cat;
        applyFilters();
      }
      const libSection = document.getElementById('library');
      if (libSection) {
        libSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('[data-filter-type]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const t = btn.getAttribute('data-filter-type');
      if (categoryFilter) categoryFilter.value = '';
      if (typeFilter) {
        typeFilter.value = t;
        applyFilters();
      }
      const libSection = document.getElementById('library');
      if (libSection) {
        libSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial Run
  applyFilters();
}

/* ==========================================================================
   3. Back to Top Smooth Scroll
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   4. Active Navigation Highlighting
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   5. Hero Spotlight 4-Slide Slider
   ========================================================================== */
function initSpotlightSlider() {
  const slider = document.getElementById('spotlightSlider');
  const track = document.getElementById('spotlightTrack');
  const dotsContainer = document.getElementById('sliderDots');

  if (!slider || !track) return;

  const slides = Array.from(track.querySelectorAll('.spotlight-slide'));
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.slider-dot')) : [];
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 2500; // 2.5 seconds per slide

  // Dragging state
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentDeltaX = 0;
  let isHorizontalDrag = null;
  let hasMoved = false;

  function updateSlidePosition(smooth = true) {
    if (smooth) {
      track.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSlidePosition(true);
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Dot Listeners
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Touch & Pointer Drag Event Handlers
  function onDragStart(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;

    isDragging = true;
    hasMoved = false;
    isHorizontalDrag = null;
    currentDeltaX = 0;

    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;

    stopAutoplay();
    slider.classList.add('is-dragging');
  }

  function onDragMove(e) {
    if (!isDragging) return;

    const point = e.touches ? e.touches[0] : e;
    const deltaX = point.clientX - startX;
    const deltaY = point.clientY - startY;

    if (isHorizontalDrag === null) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        isHorizontalDrag = false;
        return;
      } else if (Math.abs(deltaX) > 8) {
        isHorizontalDrag = true;
      }
    }

    if (!isHorizontalDrag) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    hasMoved = true;
    currentDeltaX = deltaX;

    // Elastic resistance at the first and last slides
    let adjustedDelta = deltaX;
    if ((currentIndex === 0 && deltaX > 0) || (currentIndex === totalSlides - 1 && deltaX < 0)) {
      adjustedDelta = deltaX * 0.35;
    }

    const sliderWidth = slider.offsetWidth || 1;
    const currentPercent = -(currentIndex * 100);
    const deltaPercent = (adjustedDelta / sliderWidth) * 100;

    track.style.transition = 'none';
    track.style.transform = `translateX(${currentPercent + deltaPercent}%)`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('is-dragging');

    if (isHorizontalDrag && hasMoved) {
      const sliderWidth = slider.offsetWidth || 1;
      const threshold = Math.max(45, sliderWidth * 0.12);

      if (currentDeltaX < -threshold) {
        nextSlide();
      } else if (currentDeltaX > threshold) {
        prevSlide();
      } else {
        goToSlide(currentIndex);
      }
    } else {
      updateSlidePosition(true);
    }

    currentDeltaX = 0;
    isHorizontalDrag = null;
    startAutoplay();
  }

  // Prevent link click when dragging
  slider.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
    }
  }, true);

  // Touch Events (Mobile Finger Swipe)
  slider.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd, { passive: true });
  window.addEventListener('touchcancel', onDragEnd, { passive: true });

  // Mouse / Pointer Events (Desktop Drag)
  slider.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  // Initial display
  goToSlide(0);
  startAutoplay();
}

/* ==========================================================================
   Details Page Hero Setup (Cover Photo Backdrop, Poster Left, Details Right)
   ========================================================================== */
function initDetailsPageHero() {
  const wrapper = document.querySelector('.details-page-wrapper');
  if (!wrapper) return;

  const poster = wrapper.querySelector('.details-poster-hero');
  if (!poster) return;

  let heroCard = wrapper.querySelector('.details-hero-card');
  const title = wrapper.querySelector('.details-heading-title');
  const breadcrumbs = wrapper.querySelector('.breadcrumbs-bar');
  const year = wrapper.querySelector('.details-heading-year');
  const specsBox = wrapper.querySelector('.details-info-box');

  const titleText = (title ? title.textContent : '').trim().toLowerCase();
  const rootPath = getRelativePathToRoot();

  // Determine cover photo URL
  let coverUrl = '';
  if (titleText.includes('doctor x')) {
    coverUrl = rootPath + 'images/covers/doctor_x_cover.jpg';
  } else if (titleText.includes('omniscient reader')) {
    coverUrl = rootPath + 'images/covers/omniscient_reader_cover.jpg';
  } else if (titleText.includes('undercover high school')) {
    coverUrl = rootPath + 'images/covers/undercover_high_school_cover.jpg';
  } else if (titleText.includes('first frost')) {
    coverUrl = rootPath + 'images/covers/the_first_frost_cover.jpg';
  } else if (titleText.includes('warrior nun')) {
    coverUrl = rootPath + 'images/covers/warrior_nun_cover.jpg';
  } else if (poster.src) {
    coverUrl = poster.src;
  }

  if (!heroCard) {
    if (!title || !specsBox) return;

    heroCard = document.createElement('div');
    heroCard.className = 'details-hero-card';

    const overlay = document.createElement('div');
    overlay.className = 'details-hero-overlay';
    heroCard.appendChild(overlay);

    const heroGrid = document.createElement('div');
    heroGrid.className = 'details-hero-grid';

    // Left Column: Poster
    const posterCol = document.createElement('div');
    posterCol.className = 'details-hero-poster-col';
    posterCol.appendChild(poster);

    // Right Column: Info & Specs
    const infoCol = document.createElement('div');
    infoCol.className = 'details-hero-info-col';
    if (breadcrumbs) infoCol.appendChild(breadcrumbs);
    infoCol.appendChild(title);
    if (year) infoCol.appendChild(year);
    infoCol.appendChild(specsBox);

    heroGrid.appendChild(posterCol);
    heroGrid.appendChild(infoCol);
    heroCard.appendChild(heroGrid);

    wrapper.insertBefore(heroCard, wrapper.firstChild);
  }

  // Set cover backdrop if not set inline
  if (coverUrl && !heroCard.style.backgroundImage) {
    heroCard.style.backgroundImage = `url('${coverUrl}')`;
  }

  // If TMDB is available, fetch official high-res backdrop
  if (window.TMDB && !titleText.includes('doctor x') && !titleText.includes('omniscient reader') && !titleText.includes('undercover') && !titleText.includes('first frost') && !titleText.includes('warrior nun')) {
    const cleanQuery = titleText.replace(/\(.*?\)/g, '').trim();
    if (cleanQuery) {
      TMDB.searchMulti(cleanQuery).then(data => {
        const item = (data && data.results) ? data.results[0] : null;
        if (item && item.backdrop_path) {
          const bdUrl = TMDB.getImageUrl(item.backdrop_path, 'w1280');
          if (bdUrl) {
            heroCard.style.backgroundImage = `url('${bdUrl}')`;
          }
        }
      }).catch(() => {});
    }
  }
}

function getRelativePathToRoot() {
  const path = window.location.pathname;
  if (path.includes('/series/') || path.includes('/movie/')) {
    return '../../../';
  }
  return '';
}

