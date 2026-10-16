/**
 * 4 COLLAS - Galvenais Skripts
 * Interaktivitāte, darba laika kalkulators, WhatsApp tāmes ģenerators un meistaru B2B atbalsts
 */

document.addEventListener('DOMContentLoaded', () => {
  initStoreStatus();
  initModals();
  initMobileNav();
  initScrollSpy();
  initQuickSearch();
});

/**
 * 1. Dinamiskais Veikala & Noliktavas Darba Laika Indikators
 * Darba laiks: Pirmdiena - Piektdiena 08:00 - 18:00
 */
function initStoreStatus() {
  const statusEl = document.getElementById('storeStatus');
  const statusText = document.getElementById('statusText');
  if (!statusEl || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Svētdiena, 1 = Pirmdiena, ..., 6 = Sestdiena
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTimeVal = hour * 60 + minute;

  const openTimeVal = 8 * 60; // 08:00
  const closeTimeVal = 18 * 60; // 18:00

  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && currentTimeVal >= openTimeVal && currentTimeVal < closeTimeVal;

  const indicator = statusEl.querySelector('.status-indicator');

  if (isOpen) {
    if (indicator) {
      indicator.className = 'status-indicator open';
      indicator.style.backgroundColor = '';
      indicator.style.boxShadow = '';
    }
    statusText.textContent = 'Atvērts līdz 18:00';
  } else {
    if (indicator) {
      indicator.className = 'status-indicator closed';
      indicator.style.backgroundColor = '#EF4444';
      indicator.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.8)';
    }
    if (day === 5 && currentTimeVal >= closeTimeVal) {
      statusText.textContent = 'Slēgts • Pirmdien no 8:00';
    } else if (day === 6 || day === 0) {
      statusText.textContent = 'Brīvdiena • Pirmdien no 8:00';
    } else if (currentTimeVal < openTimeVal) {
      statusText.textContent = 'Atvērts no 08:00';
    } else {
      statusText.textContent = 'Slēgts • Rīt no 08:00';
    }
  }
}

/**
 * 2. Modālo Logu Pārvaldība (WhatsApp Tāme & Meistaru Sadarbība)
 */
function initModals() {
  const quoteModal = document.getElementById('quoteModal');

  const openQuoteBtns = [
    document.getElementById('openTameBtn'),
    document.getElementById('heroWhatsAppBtn'),
    document.getElementById('ctaWhatsAppModalBtn'),
    document.getElementById('mobileWhatsAppBtn'),
    document.getElementById('warehouseWhatsAppBtn')
  ];

  const closeQuoteBtn = document.getElementById('closeQuoteModalBtn');

  // Atvērt Tāmes modāli
  openQuoteBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(quoteModal);
      });
    }
  });

  // Aizvēršanas poga
  if (closeQuoteBtn) {
    closeQuoteBtn.addEventListener('click', () => closeModal(quoteModal));
  }

  // Aizvērt, uzklikšķinot uz fona
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal(quoteModal);
      }
    });
  }

  // ESC taustiņš
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(quoteModal);
    }
  });

  // WhatsApp Tāmes Formas Nosūtīšana
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const topic = document.getElementById('quoteTopic').value;
      const notes = document.getElementById('quoteNotes').value.trim();

      const message = `Labdien, 4 Collas komanda!
Vēlos pieprasīt tāmi / konsultāciju:
- Vārds/Uzņēmums: ${name}
- Tālrunis: ${phone}
- Tēma: ${topic}
- Informācija / materiāli: ${notes || 'Lūdzu sazināties ar mani precizēšanai.'}

Paldies!`;

      // 4 Collas WhatsApp saziņas numurs (+37167530063 / mob)
      const waUrl = `https://wa.me/37167530063?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      closeModal(quoteModal);
    });
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * 3. Meistaru & Tāmes Modāļa atvēršana ar tēmas atlasi
 */
window.openQuoteModal = function(topic) {
  const quoteModal = document.getElementById('quoteModal');
  const topicSelect = document.getElementById('quoteTopic');
  if (topic && topicSelect) {
    topicSelect.value = topic;
  }
  openModal(quoteModal);
};

/**
 * 4. Mobilās Izvēlnes Pārvaldība
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Aizvērt mobilo izvēlni pēc saites nospiešanas
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/**
 * 5. ScrollSpy navigācijai
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const parent = link.parentElement;
        if (link.getAttribute('href') === `#${currentId}`) {
          parent.classList.add('active');
        } else {
          parent.classList.remove('active');
        }
      });
    }
  });
}

/**
 * 6. Ātrā Meklēšana (Pārvirzīšana uz sanpro.lv vai lapas sadaļām)
 */
function initQuickSearch() {
  const searchInput = document.getElementById('quickSearchInput');
  const searchBtn = document.getElementById('searchSubmitBtn');

  function doSearch() {
    const val = (searchInput ? searchInput.value : '').trim().toLowerCase();
    if (!val) return;

    if (val.includes('meistar') || val.includes('sadarb') || val.includes('vairum') || val.includes('b2b')) {
      const el = document.getElementById('sadarbiba');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (val.includes('tiktok') || val.includes('video') || val.includes('padom')) {
      const el = document.getElementById('tiktok');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (val.includes('kontakt') || val.includes('adrese') || val.includes('kur') || val.includes('karte')) {
      const el = document.getElementById('kontakti');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Meklēt sanpro.lv e-veikalā
      window.open(`https://sanpro.lv/index.php?route=product/search&search=${encodeURIComponent(val)}`, '_blank');
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', doSearch);
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }
}
