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
  initLatestReleasesQueue();
  initEpisodeDropdowns();
  initLiveSearch();
  initCatalogFilterPills();
  initInstantSearchAndModal();
  initSectionSortButtons();
  initReportBrokenLink();
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

  // Clean up any legacy single-card hero wrapper if present
  const oldLegacyCard = wrapper.querySelector('.details-hero-card');
  if (oldLegacyCard && !wrapper.querySelector('.details-cover-banner')) {
    const oldGrid = oldLegacyCard.querySelector('.details-hero-grid');
    if (oldGrid) {
      wrapper.insertBefore(oldGrid, oldLegacyCard);
      oldGrid.className = 'details-body-grid';
    }
    oldLegacyCard.remove();
  }

  let coverBanner = wrapper.querySelector('.details-cover-banner');
  let bodyGrid = wrapper.querySelector('.details-body-grid, .details-hero-grid');
  const title = wrapper.querySelector('.details-heading-title');
  const breadcrumbs = wrapper.querySelector('.breadcrumbs-bar');
  const year = wrapper.querySelector('.details-heading-year');
  const specsBox = wrapper.querySelector('.details-info-box');

  const titleText = (title ? title.textContent : '').trim().toLowerCase();
  const rootPath = getRelativePathToRoot();

  // Determine cover photo URL
  let coverUrl = '';
  if (titleText.includes('bona fide') || titleText.includes('bonafide')) {
    coverUrl = rootPath + 'images/covers/bona_fide_killer_cover.jpg';
  } else if (titleText.includes('doctor x')) {
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

  // 1. Create Standalone Cover Photo Banner (FIRST) if not present
  if (!coverBanner) {
    coverBanner = document.createElement('div');
    coverBanner.className = 'details-cover-banner';
    if (coverUrl) {
      coverBanner.style.backgroundImage = `url('${coverUrl}')`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'details-cover-overlay';
    coverBanner.appendChild(overlay);

    wrapper.insertBefore(coverBanner, wrapper.firstChild);
  } else if (coverUrl && !coverBanner.style.backgroundImage) {
    coverBanner.style.backgroundImage = `url('${coverUrl}')`;
  }

  // 2. Create Lower Details Grid (Poster on left, details on right) if not present
  if (!bodyGrid) {
    if (!title || !specsBox) return;

    bodyGrid = document.createElement('div');
    bodyGrid.className = 'details-body-grid';

    // Left Column: Poster
    const posterCol = document.createElement('div');
    posterCol.className = 'details-poster-col';
    posterCol.appendChild(poster);

    // Right Column: Info & Specs
    const infoCol = document.createElement('div');
    infoCol.className = 'details-info-col';
    if (breadcrumbs) infoCol.appendChild(breadcrumbs);
    infoCol.appendChild(title);
    if (year) infoCol.appendChild(year);
    infoCol.appendChild(specsBox);

    bodyGrid.appendChild(posterCol);
    bodyGrid.appendChild(infoCol);

    // Insert bodyGrid directly after coverBanner
    coverBanner.parentNode.insertBefore(bodyGrid, coverBanner.nextSibling);
  }

  // If TMDB is available, fetch official high-res backdrop
  if (window.TMDB && !titleText.includes('doctor x') && !titleText.includes('omniscient reader') && !titleText.includes('undercover') && !titleText.includes('first frost') && !titleText.includes('warrior nun')) {
    const cleanQuery = titleText.replace(/\(.*?\)/g, '').trim();
    if (cleanQuery) {
      TMDB.searchMulti(cleanQuery).then(data => {
        const item = (data && data.results) ? data.results[0] : null;
        if (item && item.backdrop_path) {
          const bdUrl = TMDB.getImageUrl(item.backdrop_path, 'w1280');
          if (bdUrl && coverBanner) {
            coverBanner.style.backgroundImage = `url('${bdUrl}')`;
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

/* ==========================================================================
   Latest Releases Queue Manager (FIFO Max 5 Cards)
   Rule: Always strictly keeps top 5 latest releases.
   When a new card is added/uploaded, it is prepended at index 0 (top/first)
   and the oldest/last card drops off from #latest.
   ========================================================================== */
function initLatestReleasesQueue() {
  const latestSection = document.getElementById('latest');
  if (!latestSection) return;
  const grid = latestSection.querySelector('.movie-grid');
  if (!grid) return;

  function enforceLatestLimit() {
    const cards = Array.from(grid.children).filter(el => el.classList.contains('movie-card-anchor') || el.matches('a'));
    while (cards.length > 5) {
      const removedCard = cards.pop();
      if (removedCard) removedCard.remove();
    }
  }

  // Enforce immediately on page load
  enforceLatestLimit();

  // Expose global method to add new upload/card to latest section
  window.addNewUploadToLatest = function(cardNodeOrHtml) {
    let cardElement;
    if (typeof cardNodeOrHtml === 'string') {
      const temp = document.createElement('div');
      temp.innerHTML = cardNodeOrHtml.trim();
      cardElement = temp.firstElementChild;
    } else {
      cardElement = cardNodeOrHtml;
    }

    if (!cardElement) return;

    // Insert as first item (newest at the very beginning)
    grid.insertBefore(cardElement, grid.firstElementChild);

    // Enforce 5 card limit (drops last card)
    enforceLatestLimit();
  };

  // Watch for any dynamic card insertions into the latest grid
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      let childListChanged = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          childListChanged = true;
          break;
        }
      }
      if (childListChanged) {
        observer.disconnect();
        enforceLatestLimit();
        observer.observe(grid, { childList: true });
      }
    });

    observer.observe(grid, { childList: true });
  }
}

/* ==========================================================================
   Series Episode Subtitle Dropdown Accordion
   ========================================================================== */
function initEpisodeDropdowns() {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.episode-toggle-btn');
    if (toggleBtn) {
      e.preventDefault();
      const container = toggleBtn.closest('.episodes-dropdown-container');
      if (!container) return;
      const menu = container.querySelector('.episodes-dropdown-menu');
      if (!menu) return;

      const isExpanded = toggleBtn.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      menu.classList.toggle('show', isExpanded);
      return;
    }

    // Close when clicking anywhere outside
    if (!e.target.closest('.episodes-dropdown-container')) {
      document.querySelectorAll('.episode-toggle-btn.active').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.episodes-dropdown-menu.show').forEach((menu) => {
        menu.classList.remove('show');
      });
    }
  });
}

/* ==========================================================================
   Live Search Filter for all Movies and Series
   ========================================================================== */
function initLiveSearch() {
  const input = document.getElementById('liveSearchInput');
  const searchBtn = document.getElementById('searchSubmitBtn');
  const form = document.getElementById('headerSearchForm');
  if (!input) return;

  const allCards = Array.from(document.querySelectorAll('.library-section .movie-card-anchor'));

  function filterCards(autoScroll = false) {
    const query = input.value.trim().toLowerCase();
    const viewAllContainers = document.querySelectorAll('.view-all-container');
    let visibleCount = 0;

    if (query) {
      // Hide view all buttons during search so all matching cards show directly
      viewAllContainers.forEach((el) => (el.style.display = 'none'));

      allCards.forEach((anchor) => {
        const card = anchor.querySelector('.movie-card');
        if (!card) return;
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const country = (card.getAttribute('data-country') || '').toLowerCase();
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        const genre = (card.getAttribute('data-genre') || '').toLowerCase();
        const year = (card.getAttribute('data-year') || '').toLowerCase();

        const matches = title.includes(query) || country.includes(query) || category.includes(query) || genre.includes(query) || year.includes(query);
        anchor.style.setProperty('display', matches ? 'block' : 'none', 'important');
        if (matches) visibleCount++;
      });
    } else {
      // Restore normal view-all containers and reset inline display styles
      viewAllContainers.forEach((el) => (el.style.display = ''));
      allCards.forEach((anchor) => {
        anchor.style.removeProperty('display');
      });
    }

    if (autoScroll && query) {
      const targetSec = document.getElementById('series') || document.getElementById('latest');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Check URL query parameters for search term
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('search') || urlParams.get('q');
    if (initialQuery) {
      input.value = initialQuery;
      filterCards(true);
    }
  } catch (err) {}

  input.addEventListener('input', () => filterCards(false));

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterCards(true);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      filterCards(true);
    });
  }
}

/* ==========================================================================
   Catalog Page Filter Pills (series.html, movies.html, paid.html, free.html)
   ========================================================================== */
function initCatalogFilterPills() {
  const pills = document.querySelectorAll('.catalog-pill, .cat-pill');
  if (!pills.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const container = pill.closest('.catalog-filter-pills') || pill.parentElement;
      const section = pill.closest('.library-section') || document;
      const sectionPills = container.querySelectorAll('.catalog-pill, .cat-pill');
      sectionPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter') || 'all';
      const allCards = Array.from(section.querySelectorAll('.movie-card-anchor'));
      const countBadge = section.querySelector('.section-head-left .pill-badge');
      let visibleCount = 0;

      allCards.forEach((anchor) => {
        const card = anchor.querySelector('.movie-card');
        const cardCat = (anchor.getAttribute('data-category') || card?.getAttribute('data-category') || '').toLowerCase();
        const cardType = (anchor.getAttribute('data-type') || '').toLowerCase();
        const country = (card?.getAttribute('data-country') || '').toLowerCase();

        let matches = false;
        if (filter === 'all') {
          matches = true;
        } else if (filter === 'series') {
          matches = cardType === 'series';
        } else if (filter === 'movie') {
          matches = cardType === 'movie';
        } else if (filter === 'k-drama') {
          matches = cardCat === 'k-drama' || country.includes('korea');
        } else if (filter === 'c-drama') {
          matches = cardCat === 'c-drama' || country.includes('china');
        } else if (filter === 'turkish-drama') {
          matches = cardCat === 'turkish-drama' || country.includes('turkey');
        } else if (filter === 'hollywood') {
          matches = cardCat === 'hollywood' || country.includes('united states') || country.includes('united kingdom');
        } else if (filter === 'k-movie') {
          matches = cardCat === 'k-movie' || (cardType === 'movie' && country.includes('korea'));
        } else if (filter === 'chinese-cinema') {
          matches = cardCat === 'chinese-cinema' || (cardType === 'movie' && (country.includes('china') || country.includes('hong kong')));
        } else if (filter === 'world-cinema') {
          matches = cardCat === 'world-cinema';
        } else if (filter === 'others') {
          matches = !['k-drama', 'c-drama', 'hollywood', 'turkish-drama'].includes(cardCat);
        } else {
          matches = cardCat.includes(filter) || country.includes(filter);
        }

        anchor.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
      });

      if (countBadge) {
        countBadge.textContent = `Total ${visibleCount}`;
      }
    });
  });
}

/* ==========================================================================
   Instant Live Autocomplete & Mobile Search Modal (88 Titles)
   ========================================================================== */
function initInstantSearchAndModal() {
  function getRootPrefix() {
    const cssLink = document.querySelector('link[href*="style.css"]');
    if (cssLink) {
      const href = cssLink.getAttribute('href');
      return href.replace('css/style.css', '').replace('style.css', '');
    }
    return '';
  }

  // Ensure search-data.js is loaded
  if (!window.FOBS_CATALOG) {
    const prefix = getRootPrefix();
    const s = document.createElement('script');
    s.src = `${prefix}js/search-data.js`;
    document.head.appendChild(s);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 1. Ensure Mobile Search Button exists in header
  const mobileToggle = document.getElementById('mobileMenuToggle');
  if (mobileToggle && !document.getElementById('mobileSearchOpenBtn')) {
    const mobileSearchBtn = document.createElement('button');
    mobileSearchBtn.type = 'button';
    mobileSearchBtn.className = 'mobile-search-btn';
    mobileSearchBtn.id = 'mobileSearchOpenBtn';
    mobileSearchBtn.setAttribute('aria-label', 'Open Search');
    mobileSearchBtn.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span class="mobile-search-btn-text">Search</span>
    `;

    if (mobileToggle.parentElement) {
      if (!mobileToggle.parentElement.classList.contains('mobile-header-actions')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-header-actions';
        mobileToggle.parentNode.insertBefore(wrapper, mobileToggle);
        wrapper.appendChild(mobileSearchBtn);
        wrapper.appendChild(mobileToggle);
      } else {
        mobileToggle.parentElement.insertBefore(mobileSearchBtn, mobileToggle);
      }
    }
  }

  // 2. Ensure Desktop Search Dropdown exists
  const headerSearchBox = document.querySelector('.header-search-box');
  let desktopDropdown = document.getElementById('desktopSearchDropdown');
  if (headerSearchBox && !desktopDropdown) {
    desktopDropdown = document.createElement('div');
    desktopDropdown.className = 'desktop-search-dropdown';
    desktopDropdown.id = 'desktopSearchDropdown';
    headerSearchBox.appendChild(desktopDropdown);
  }

  // 3. Ensure Search Modal exists
  let modalBackdrop = document.getElementById('searchModal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'search-modal-backdrop';
    modalBackdrop.id = 'searchModal';
    modalBackdrop.setAttribute('aria-hidden', 'true');
    modalBackdrop.innerHTML = `
      <div class="search-modal-dialog">
        <div class="search-modal-header">
          <div class="search-modal-input-wrap">
            <svg class="search-modal-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="modalSearchInput" class="search-modal-input" placeholder="Search movies, series, K-Drama..." autocomplete="off" />
            <button type="button" class="search-modal-clear-btn" id="modalSearchClearBtn" aria-label="Clear Search" style="display: none;">✕</button>
          </div>
          <button type="button" class="search-modal-close-btn" id="modalSearchCloseBtn" aria-label="Close Search">✕</button>
        </div>
        <div class="search-suggestions-container" id="searchSuggestionsContainer">
          <div class="search-suggestions-header">
            <span class="suggestions-count" id="suggestionsCount">88 Available Titles</span>
            <span class="suggestions-hint">Instant suggestions from 1 word</span>
          </div>
          <div class="search-suggestions-list" id="modalSuggestionsList"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);
  }

  // 4. Suggestion Rendering Logic
  function renderSuggestions(query, targetListEl, isDesktop = false) {
    if (!targetListEl) return;
    const cleanQ = query.trim().toLowerCase();

    if (!cleanQ) {
      targetListEl.innerHTML = '';
      if (isDesktop && desktopDropdown) {
        desktopDropdown.classList.remove('open');
      }
      return;
    }

    const catalog = window.FOBS_CATALOG || [];
    const rootPrefix = getRootPrefix();

    const matches = catalog.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const country = (item.country || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      const year = (item.year || '').toLowerCase();
      return title.includes(cleanQ) || country.includes(cleanQ) || category.includes(cleanQ) || year.includes(cleanQ);
    });

    matches.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      const aStarts = aTitle.startsWith(cleanQ);
      const bStarts = bTitle.startsWith(cleanQ);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    const topResults = matches.slice(0, 8);

    if (topResults.length === 0) {
      targetListEl.innerHTML = `
        <div class="suggestion-empty">
          <p>No subtitles found matching "<strong>${escapeHtml(query)}</strong>"</p>
          <p style="margin-top: 8px;"><a href="${rootPrefix}request.html">Request this Subtitle →</a></p>
        </div>
      `;
      if (isDesktop && desktopDropdown) desktopDropdown.classList.add('open');
      return;
    }

    const html = topResults.map((item) => {
      const regex = new RegExp(`(${escapeRegex(cleanQ)})`, 'gi');
      const highlightedTitle = escapeHtml(item.title).replace(regex, '<mark class="search-highlight">$1</mark>');
      const isSeries = (item.type || '').toLowerCase() === 'series' || (item.type || '').toLowerCase() === 'tv';
      const badgeClass = isSeries ? 'series' : 'movie';
      const badgeText = isSeries ? 'Series' : 'Movie';
      const rawLink = item.link || item.url || '';
      const cleanLink = rawLink.startsWith('/') ? rawLink.slice(1) : rawLink;
      const itemUrl = `${rootPrefix}${cleanLink}`;

      return `
        <a href="${itemUrl}" class="suggestion-card">
          <img src="${item.poster}" alt="${escapeHtml(item.title)}" class="suggestion-thumb" loading="lazy" />
          <div class="suggestion-info">
            <span class="suggestion-title">${highlightedTitle}</span>
            <div class="suggestion-meta">
              <span class="suggestion-badge ${badgeClass}">${badgeText}</span>
              <span class="suggestion-badge category">${escapeHtml(item.category)}</span>
              <span class="suggestion-year">${item.year}</span>
            </div>
          </div>
          <span class="suggestion-chevron">→</span>
        </a>
      `;
    }).join('');

    targetListEl.innerHTML = html;
    if (isDesktop && desktopDropdown) {
      desktopDropdown.classList.add('open');
    }
  }

  // 5. Desktop Input Listener
  const liveSearchInput = document.getElementById('liveSearchInput');
  if (liveSearchInput && desktopDropdown) {
    liveSearchInput.addEventListener('input', () => {
      renderSuggestions(liveSearchInput.value, desktopDropdown, true);
    });

    liveSearchInput.addEventListener('focus', () => {
      if (liveSearchInput.value.trim().length >= 1) {
        renderSuggestions(liveSearchInput.value, desktopDropdown, true);
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-search-box')) {
        desktopDropdown.classList.remove('open');
      }
    });
  }

  // 6. Mobile Modal Open / Close / Input Listeners
  const mobileSearchOpenBtn = document.getElementById('mobileSearchOpenBtn');
  const modalCloseBtn = document.getElementById('modalSearchCloseBtn');
  const modalInput = document.getElementById('modalSearchInput');
  const modalClearBtn = document.getElementById('modalSearchClearBtn');
  const modalSuggestionsList = document.getElementById('modalSuggestionsList');

  function openModal() {
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (modalInput) modalInput.focus();
    }, 100);
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileSearchOpenBtn) {
    mobileSearchOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (desktopDropdown) desktopDropdown.classList.remove('open');
    }
  });

  if (modalInput) {
    modalInput.addEventListener('input', () => {
      const val = modalInput.value;
      if (modalClearBtn) {
        modalClearBtn.style.display = val.length > 0 ? 'flex' : 'none';
      }
      renderSuggestions(val, modalSuggestionsList, false);
    });
  }

  if (modalClearBtn && modalInput) {
    modalClearBtn.addEventListener('click', () => {
      modalInput.value = '';
      modalClearBtn.style.display = 'none';
      modalInput.focus();
      renderSuggestions('', modalSuggestionsList, false);
    });
  }
}

/* ==========================================================================
   Section Head Sort (Name A-Z, Name Z-A, Date Latest, Date Oldest) & Reset
   ========================================================================== */
function initSectionSortButtons() {
  function sortCardsInGrid(grid, sortType) {
    if (!grid) return;
    const cards = Array.from(grid.children);
    cards.sort((a, b) => {
      const artA = a.querySelector('.movie-card') || a;
      const artB = b.querySelector('.movie-card') || b;
      const titleA = (artA.getAttribute('data-title') || artA.querySelector('.movie-card-title')?.textContent || '').trim();
      const titleB = (artB.getAttribute('data-title') || artB.querySelector('.movie-card-title')?.textContent || '').trim();
      const yearA = parseInt(artA.getAttribute('data-year') || '2000', 10);
      const yearB = parseInt(artB.getAttribute('data-year') || '2000', 10);

      if (sortType === 'name-asc') {
        return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
      } else if (sortType === 'name-desc') {
        return titleB.localeCompare(titleA, undefined, { sensitivity: 'base' });
      } else if (sortType === 'date-desc') {
        if (yearB !== yearA) return yearB - yearA;
        return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
      } else if (sortType === 'date-asc') {
        if (yearA !== yearB) return yearA - yearB;
        return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
      }
      return 0;
    });

    cards.forEach((card) => grid.appendChild(card));
  }

  const sortLabelMap = {
    'name-asc': 'Sort: A to Z',
    'name-desc': 'Sort: Z to A',
    'date-desc': 'Sort: Latest',
    'date-asc': 'Sort: Oldest',
  };

  // 1. Initial setup on page load: sort cards A-Z, save original badge counts, and respect data-limit (10 on homepage)
  document.querySelectorAll('.library-section').forEach((section) => {
    // Preserve chronological upload order for Latest Releases section
    if (section.id === 'latest') return;

    const grid = section.querySelector('.movie-grid');
    const sortBtn = section.querySelector('.btn-head-sort');
    const indBtn = section.querySelector('.btn-head-industry, .btn-head-category');
    const countBadge = section.querySelector('.section-head-left .pill-badge');
    const limit = parseInt(section.getAttribute('data-limit'), 10);

    if (countBadge && !countBadge.getAttribute('data-orig')) {
      countBadge.setAttribute('data-orig', countBadge.textContent.trim());
    }
    if (indBtn && !indBtn.getAttribute('data-selected')) {
      indBtn.setAttribute('data-selected', 'all');
    }
    if (sortBtn && !sortBtn.getAttribute('data-selected')) {
      sortBtn.setAttribute('data-selected', 'name-asc');
    }
    if (grid) {
      sortCardsInGrid(grid, 'name-asc');
      if (limit && !isNaN(limit)) {
        const all = Array.from(grid.querySelectorAll('.movie-card-anchor'));
        all.forEach((c, idx) => {
          c.style.display = idx < limit ? 'block' : 'none';
        });
      }
      const sortText = sortBtn ? sortBtn.querySelector('.sort-text') : null;
      if (sortText) sortText.textContent = sortLabelMap['name-asc'];
    }
  });

  // 2. Toggle Industry dropdown menu on button click
  document.querySelectorAll('.btn-head-industry, .btn-head-category').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const wrapper = this.closest('.filter-dropdown-wrapper');
      if (!wrapper) return;
      const menu = wrapper.querySelector('.industry-dropdown-menu, .category-dropdown-menu');
      if (!menu) return;

      const isOpen = menu.classList.contains('show');

      // Close all other open dropdowns first
      document.querySelectorAll('.industry-dropdown-menu.show, .category-dropdown-menu.show, .sort-dropdown-menu.show').forEach((m) => {
        if (m !== menu) m.classList.remove('show');
      });
      document.querySelectorAll('.btn-head-industry.active, .btn-head-category.active, .btn-head-sort.active').forEach((b) => {
        if (b !== this) b.classList.remove('active');
      });

      menu.classList.toggle('show', !isOpen);
      this.classList.toggle('active', !isOpen);
      this.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // 3. Option selection in Industry dropdown (PENDING: does NOT filter until Apply Filters is clicked)
  document.querySelectorAll('.industry-option, .category-option').forEach((opt) => {
    opt.addEventListener('click', function (e) {
      e.stopPropagation();
      const filter = this.getAttribute('data-filter') || 'all';
      const wrapper = this.closest('.filter-dropdown-wrapper');
      const indBtn = wrapper ? wrapper.querySelector('.btn-head-industry, .btn-head-category') : null;
      const menu = wrapper ? wrapper.querySelector('.industry-dropdown-menu, .category-dropdown-menu') : null;

      // Update active option in menu
      if (menu) {
        menu.querySelectorAll('.industry-option, .category-option').forEach((o) => o.classList.remove('active'));
        this.classList.add('active');
        menu.classList.remove('show');
      }

      // Update button text and store selected value
      if (indBtn) {
        indBtn.classList.remove('active');
        indBtn.setAttribute('aria-expanded', 'false');
        indBtn.setAttribute('data-selected', filter);

        const labelSpan = indBtn.querySelector('.industry-text, .category-text');
        const rawText = this.textContent.trim().replace(/^[^\w\s]+/, '').trim();
        const cleanName = rawText.split('(')[0].trim();

        if (labelSpan) {
          if (filter === 'all') {
            labelSpan.textContent = indBtn.classList.contains('btn-head-industry') ? 'Industry: All' : 'Filter: All';
          } else {
            const prefix = indBtn.classList.contains('btn-head-industry') ? 'Industry:' : 'Filter:';
            labelSpan.textContent = `${prefix} ${cleanName}`;
          }
        }
      }
    });
  });

  // 4. Toggle Sort dropdown menu on button click
  document.querySelectorAll('.btn-head-sort').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const wrapper = this.closest('.sort-dropdown-wrapper');
      if (!wrapper) return;
      const menu = wrapper.querySelector('.sort-dropdown-menu');
      if (!menu) return;

      const isOpen = menu.classList.contains('show');

      // Close all other open dropdowns first
      document.querySelectorAll('.industry-dropdown-menu.show, .category-dropdown-menu.show, .sort-dropdown-menu.show').forEach((m) => {
        if (m !== menu) m.classList.remove('show');
      });
      document.querySelectorAll('.btn-head-industry.active, .btn-head-category.active, .btn-head-sort.active').forEach((b) => {
        if (b !== this) b.classList.remove('active');
      });

      menu.classList.toggle('show', !isOpen);
      this.classList.toggle('active', !isOpen);
      this.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // 5. Option selection in Sort dropdown (PENDING: stores selection until Apply Filters is clicked)
  document.querySelectorAll('.sort-option').forEach((opt) => {
    opt.addEventListener('click', function (e) {
      e.stopPropagation();
      const sortType = this.getAttribute('data-sort') || 'name-asc';
      const wrapper = this.closest('.sort-dropdown-wrapper');
      const sortBtn = wrapper ? wrapper.querySelector('.btn-head-sort') : null;
      const menu = wrapper ? wrapper.querySelector('.sort-dropdown-menu') : null;

      // Update active option in menu
      if (menu) {
        menu.querySelectorAll('.sort-option').forEach((o) => o.classList.remove('active'));
        this.classList.add('active');
        menu.classList.remove('show');
      }

      if (sortBtn) {
        sortBtn.classList.remove('active');
        sortBtn.setAttribute('aria-expanded', 'false');
        sortBtn.setAttribute('data-selected', sortType);

        const sortText = sortBtn.querySelector('.sort-text');
        if (sortText && sortLabelMap[sortType]) {
          sortText.textContent = sortLabelMap[sortType];
        }
      }
    });
  });

  // 6. APPLY FILTERS BUTTON: Filters across full catalog & caps visible to limit (10 on homepage)
  document.querySelectorAll('.btn-head-apply').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      const section = this.closest('.library-section');
      if (!section) return;
      const grid = section.querySelector('.movie-grid');
      const indBtn = section.querySelector('.btn-head-industry, .btn-head-category');
      const sortBtn = section.querySelector('.btn-head-sort');
      const limit = parseInt(section.getAttribute('data-limit'), 10);

      const filter = (indBtn ? indBtn.getAttribute('data-selected') : 'all') || 'all';
      const sortType = (sortBtn ? sortBtn.getAttribute('data-selected') : 'name-asc') || 'name-asc';

      // 1. Filter all cards in section
      const allCards = Array.from(section.querySelectorAll('.movie-card-anchor'));
      const countBadge = section.querySelector('.section-head-left .pill-badge');
      if (countBadge && !countBadge.getAttribute('data-orig')) {
        countBadge.setAttribute('data-orig', countBadge.textContent.trim());
      }

      let matchingCards = [];

      allCards.forEach((anchor) => {
        const card = anchor.querySelector('.movie-card');
        const cardCat = (anchor.getAttribute('data-category') || card?.getAttribute('data-category') || '').toLowerCase();
        const cardType = (anchor.getAttribute('data-type') || '').toLowerCase();
        const country = (card?.getAttribute('data-country') || '').toLowerCase();

        let matches = false;
        if (filter === 'all') {
          matches = true;
        } else if (filter === 'series') {
          matches = cardType === 'series';
        } else if (filter === 'movie') {
          matches = cardType === 'movie';
        } else if (filter === 'k-drama') {
          matches = cardCat.includes('k-drama') || cardCat.includes('k-movie') || country.includes('korea');
        } else if (filter === 'c-drama') {
          matches = cardCat.includes('c-drama') || cardCat.includes('chinese') || country.includes('china') || country.includes('hk') || country.includes('hong kong');
        } else if (filter === 'j-drama') {
          matches = cardCat.includes('j-drama') || cardCat.includes('j-movie') || country.includes('japan');
        } else if (filter === 'turkish-drama') {
          matches = cardCat.includes('turkish') || country.includes('turkey');
        } else if (filter === 'hollywood') {
          matches = cardCat.includes('hollywood') || country.includes('united states') || country.includes('united kingdom') || country.includes('ca') || country.includes('canada');
        } else if (filter === 'k-movie') {
          matches = cardCat.includes('k-movie') || (cardType === 'movie' && country.includes('korea'));
        } else if (filter === 'chinese-cinema') {
          matches = cardCat.includes('chinese-cinema') || (country.includes('china') || country.includes('hong kong') || country.includes('hk'));
        } else if (filter === 'world-cinema') {
          matches = cardCat.includes('world-cinema') || ['france', 'germany', 'india', 'it', 'italy'].some((c) => country.includes(c));
        } else if (filter === 'others') {
          matches = !['k-drama', 'c-drama', 'hollywood', 'turkish-drama', 'j-drama'].some((c) => cardCat.includes(c) || country.includes(c));
        } else {
          matches = cardCat.includes(filter) || country.includes(filter);
        }

        if (matches) {
          matchingCards.push(anchor);
        } else {
          anchor.style.display = 'none';
        }
      });

      // 2. Sort all cards in grid by chosen sortType
      if (grid) {
        sortCardsInGrid(grid, sortType);
      }

      // 3. Show matching cards up to `limit` (e.g. 10 on homepage, or all on catalog pages)
      const totalMatches = matchingCards.length;
      const sortedMatching = grid ? Array.from(grid.querySelectorAll('.movie-card-anchor')).filter((c) => matchingCards.includes(c)) : matchingCards;

      sortedMatching.forEach((anchor, idx) => {
        if (limit && !isNaN(limit) && idx >= limit) {
          anchor.style.display = 'none';
        } else {
          anchor.style.display = 'block';
        }
      });

      if (countBadge) {
        if (filter === 'all') {
          countBadge.textContent = countBadge.getAttribute('data-orig') || `Total ${totalMatches}`;
        } else {
          countBadge.textContent = (limit && !isNaN(limit) && totalMatches > limit) ? `Showing ${limit} of ${totalMatches}` : `Total ${totalMatches}`;
        }
      }

      // Button click tactile feedback
      this.style.transform = 'scale(0.96)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // 7. Reset Filter button click
  document.querySelectorAll('.btn-head-reset').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      const section = this.closest('.library-section');
      if (!section) return;
      const grid = section.querySelector('.movie-grid');
      const sortBtn = section.querySelector('.btn-head-sort');
      const sortMenu = section.querySelector('.sort-dropdown-menu');
      const indBtn = section.querySelector('.btn-head-industry, .btn-head-category');
      const indMenu = section.querySelector('.industry-dropdown-menu, .category-dropdown-menu');
      const limit = parseInt(section.getAttribute('data-limit'), 10);

      // Re-sort grid to Name A-Z on this page
      if (grid) sortCardsInGrid(grid, 'name-asc');

      // Unhide cards up to limit (10 on homepage, all on catalog pages)
      const allCards = section.querySelectorAll('.movie-card-anchor');
      allCards.forEach((c, idx) => {
        c.style.display = (limit && !isNaN(limit) && idx >= limit) ? 'none' : 'block';
      });

      const countBadge = section.querySelector('.section-head-left .pill-badge');
      if (countBadge) {
        countBadge.textContent = countBadge.getAttribute('data-orig') || `Total ${allCards.length}`;
      }

      // Reset Industry selection
      if (indBtn) {
        indBtn.setAttribute('data-selected', 'all');
        indBtn.classList.remove('active');
        indBtn.setAttribute('aria-expanded', 'false');
        const indText = indBtn.querySelector('.industry-text, .category-text');
        if (indText) {
          indText.textContent = indBtn.classList.contains('btn-head-industry') ? 'Industry: All' : 'Filter: All';
        }
      }
      if (indMenu) {
        indMenu.querySelectorAll('.industry-option, .category-option').forEach((o) => {
          o.classList.toggle('active', (o.getAttribute('data-filter') || 'all') === 'all');
        });
        indMenu.classList.remove('show');
      }

      // Reset Sort selection
      if (sortBtn) {
        sortBtn.setAttribute('data-selected', 'name-asc');
        sortBtn.classList.remove('active');
        sortBtn.setAttribute('aria-expanded', 'false');
        const sortText = sortBtn.querySelector('.sort-text');
        if (sortText) sortText.textContent = sortLabelMap['name-asc'];
      }
      if (sortMenu) {
        sortMenu.querySelectorAll('.sort-option').forEach((o) => {
          o.classList.toggle('active', o.getAttribute('data-sort') === 'name-asc');
        });
        sortMenu.classList.remove('show');
      }
    });
  });

  // 8. Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.industry-dropdown-menu.show, .category-dropdown-menu.show, .sort-dropdown-menu.show').forEach((m) => m.classList.remove('show'));
    document.querySelectorAll('.btn-head-industry.active, .btn-head-category.active, .btn-head-sort.active').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   Report Broken Link Modal Handler
   ========================================================================== */
function initReportBrokenLink() {
  const reportBtns = document.querySelectorAll('.btn-report-broken');
  if (!reportBtns.length) return;

  // Build modal elements if not already in DOM
  let modalOverlay = document.getElementById('reportModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'reportModalOverlay';
    modalOverlay.className = 'report-modal-overlay';
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalOverlay.innerHTML = `
      <div class="report-modal-card" role="dialog" aria-modal="true" aria-labelledby="reportModalTitle">
        <button type="button" class="report-modal-close" id="reportModalCloseBtn" aria-label="Close modal">&times;</button>
        <div class="report-modal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 class="report-modal-title" id="reportModalTitle">লিংক কাজ করছে না?</h3>
        <p class="report-modal-subtitle">
          কোনো সাবটাইটেল বা মিডিয়া ডাউনলোড লিংকে সমস্যা হলে সরাসরি এডমিনকে জানান। অতি দ্রুত লিংক ফিক্স করা হবে।<br>
          <span class="report-modal-target" id="reportModalTargetName">Title</span>
        </p>
        <div class="report-modal-actions">
          <a href="#" target="_blank" rel="noopener noreferrer" class="report-action-wa" id="reportModalWaBtn">
            <span>💬 Report to Admin on WhatsApp</span>
          </a>
          <a href="https://t.me/FOBS_Team" target="_blank" rel="noopener noreferrer" class="report-action-tg">
            <span>✈️ Report on Telegram Community</span>
          </a>
          <a href="#" class="report-action-page" id="reportModalContactBtn">
            <span>📝 Open Contact & Support Page</span>
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = document.getElementById('reportModalCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeReportModal());
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeReportModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeReportModal();
      }
    });
  }

  function closeReportModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  function openReportModal(itemTitle, contactHref) {
    const targetSpan = document.getElementById('reportModalTargetName');
    const waBtn = document.getElementById('reportModalWaBtn');
    const contactBtn = document.getElementById('reportModalContactBtn');

    if (targetSpan) targetSpan.textContent = itemTitle;

    const waMsg = encodeURIComponent(`Hello FOBS Team Admin, I found a broken download link on the website:\nTitle: ${itemTitle}\nPage URL: ${window.location.href}`);
    if (waBtn) {
      waBtn.href = `https://wa.me/qr/5DRWLEEBITSXA1?text=${waMsg}`;
    }
    if (contactBtn) {
      contactBtn.href = contactHref || (typeof getRelativePathToRoot === 'function' ? getRelativePathToRoot() : '') + 'contact.html';
    }

    if (modalOverlay) {
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  reportBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const titleElem = document.querySelector('.details-heading-title') || document.querySelector('h1');
      const itemTitle = titleElem ? titleElem.textContent.trim() : document.title.replace(' | FOBS Subtitles', '').trim();
      const contactHref = btn.getAttribute('href') || 'contact.html';
      openReportModal(itemTitle, contactHref);
    });
  });
}





