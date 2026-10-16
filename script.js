/**
 * 4 COLLAS - Galvenais Skripts
 * Interaktivitāte, darba laika kalkulators, WhatsApp tāmes ģenerators un nomas aprēķins
 */

document.addEventListener('DOMContentLoaded', () => {
  initStoreStatus();
  initModals();
  initRentalCalculator();
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
 * 2. Modālo Logu Pārvaldība (WhatsApp Tāme & Noma)
 */
function initModals() {
  const quoteModal = document.getElementById('quoteModal');
  const rentalModal = document.getElementById('rentalModal');

  const openQuoteBtns = [
    document.getElementById('openTameBtn'),
    document.getElementById('heroWhatsAppBtn'),
    document.getElementById('ctaWhatsAppModalBtn'),
    document.getElementById('mobileWhatsAppBtn'),
    document.getElementById('warehouseWhatsAppBtn')
  ];

  const closeQuoteBtn = document.getElementById('closeQuoteModalBtn');
  const closeRentalBtn = document.getElementById('closeRentalModalBtn');

  // Atvērt Tāmes modāli
  openQuoteBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(quoteModal);
      });
    }
  });

  // Aizvēršanas pogas
  if (closeQuoteBtn) {
    closeQuoteBtn.addEventListener('click', () => closeModal(quoteModal));
  }
  if (closeRentalBtn) {
    closeRentalBtn.addEventListener('click', () => closeModal(rentalModal));
  }

  // Aizvērt, uzklikšķinot uz fona
  [quoteModal, rentalModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC taustiņš
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(quoteModal);
      closeModal(rentalModal);
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
 * 3. Instrumentu Nomas Kalkulators & Rezervācija
 */
let currentTool = { name: 'REMS Akku-Press', pricePerDay: 15.00 };

window.openRentalModal = function(toolName, priceStr) {
  const rentalModal = document.getElementById('rentalModal');
  const titleEl = document.getElementById('rentalModalTitle');
  const priceEl = document.getElementById('rentalModalPrice');
  const selectedToolInput = document.getElementById('selectedToolInput');
  const rentalDateInput = document.getElementById('rentalDate');

  currentTool.name = toolName;
  currentTool.pricePerDay = parseFloat(priceStr) || 15.00;

  if (titleEl) titleEl.textContent = `Rezervēt: ${toolName}`;
  if (priceEl) priceEl.textContent = `€ ${currentTool.pricePerDay.toFixed(2)}`;
  if (selectedToolInput) selectedToolInput.value = toolName;

  // Iestatīt noklusēto datumu kā rītdienu
  if (rentalDateInput && !rentalDateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    rentalDateInput.value = tomorrow.toISOString().split('T')[0];
    rentalDateInput.min = new Date().toISOString().split('T')[0];
  }

  updateRentalTotal();
  openModal(rentalModal);
};

function initRentalCalculator() {
  const daysInput = document.getElementById('rentalDays');
  if (daysInput) {
    daysInput.addEventListener('input', updateRentalTotal);
  }

  const rentalForm = document.getElementById('rentalForm');
  if (rentalForm) {
    rentalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const days = parseInt(document.getElementById('rentalDays').value, 10) || 1;
      const date = document.getElementById('rentalDate').value;
      const contact = document.getElementById('rentalContact').value.trim();
      const totalSum = (days * currentTool.pricePerDay).toFixed(2);

      const message = `Labdien! Vēlos pieteikt instrumenta nomu Katlakalna ielā 9:
- Instruments: ${currentTool.name}
- Nomas ilgums: ${days} diena(s)
- Vēlamais saņemšanas datums: ${date}
- Orientējošā nomas maksa: € ${totalSum} (ar PVN)
- Kontaktpersona: ${contact}

Lūdzu apstiprināt instrumenta pieejamību.`;

      const waUrl = `https://wa.me/37167530063?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      closeModal(document.getElementById('rentalModal'));
    });
  }
}

function updateRentalTotal() {
  const daysInput = document.getElementById('rentalDays');
  const totalSumEl = document.getElementById('rentalTotalSum');
  if (!daysInput || !totalSumEl) return;

  const days = Math.max(1, parseInt(daysInput.value, 10) || 1);
  const total = days * currentTool.pricePerDay;
  totalSumEl.textContent = `€ ${total.toFixed(2)}`;
}

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

    if (val.includes('noma') || val.includes('rems') || val.includes('prese') || val.includes('īre')) {
      const el = document.getElementById('noma');
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
