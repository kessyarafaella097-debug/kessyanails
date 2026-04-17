/* =============================================
   KESSYA NAILS — script.js
   ============================================= */

// ── CONFIGURAÇÃO ──────────────────────────────
const WHATSAPP_NUMBER = '5500000000000'; // Substitua pelo número real (com código do país, sem + ou espaços)

// ── LOADING SCREEN ────────────────────────────
window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  if (!loading) return;
  setTimeout(() => {
    loading.classList.add('fade-out');
    setTimeout(() => loading.remove(), 500);
  }, 1500);
});

// ── NAVBAR SCROLL ─────────────────────────────
const navbar = document.getElementById('mainNav');

const handleNavScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ── SMOOTH SCROLL (links internos) ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    // Fecha menu mobile se estiver aberto
    const bsCollapse = document.getElementById('navMenu');
    if (bsCollapse && bsCollapse.classList.contains('show')) {
      const bsNav = bootstrap.Collapse.getInstance(bsCollapse);
      if (bsNav) bsNav.hide();
    }

    const navH = navbar ? navbar.offsetHeight : 70;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navH - 10;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

// ── INTERSECTION OBSERVER (animações + contadores) ──
let countersStarted = false;

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-visible');

      // Contadores animados
      if (!countersStarted && entry.target.closest('#estatisticas')) {
        countersStarted = true;
        startCounters();
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ── CONTADORES ANIMADOS ───────────────────────
function startCounters() {
  // Contadores inteiros
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.round(increment * step);
      if (step >= steps) {
        current = target;
        clearInterval(timer);
        el.textContent = target >= 200 ? target + '+' : target + (el.closest('.stat-card').querySelector('.stat-label').textContent.includes('Experiência') ? '+' : '+');
        return;
      }
      el.textContent = current;
    }, duration / steps);
  });

  // Contador float (5.0)
  document.querySelectorAll('.stat-number[data-float]').forEach(el => {
    const target = parseFloat(el.dataset.float);
    const duration = 1800;
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = ((target / steps) * step).toFixed(1);
      el.textContent = current;
      if (step >= steps) {
        el.textContent = target.toFixed(1);
        clearInterval(timer);
      }
    }, duration / steps);
  });
}

// ── GALERIA: FILTROS ──────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        item.classList.add('hidden');
        item.style.animation = '';
      }
    });
  });
});

// ── GALERIA: LIGHTBOX ─────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const bgStyle = item.querySelector('.gallery-img').style.background;
    const title = item.dataset.title || '';

    lightboxImg.style.background = bgStyle;
    lightboxTitle.textContent = title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── SERVIÇOS → AGENDAMENTO (pré-selecionar) ───
function selectService(serviceName) {
  const select = document.getElementById('serviceSelect');
  if (select) {
    for (let opt of select.options) {
      if (opt.value === serviceName) {
        opt.selected = true;
        break;
      }
    }
  }
  // Scroll suave para o formulário
  const section = document.getElementById('agendamento');
  if (section) {
    const navH = navbar ? navbar.offsetHeight : 70;
    const targetY = section.getBoundingClientRect().top + window.scrollY - navH - 10;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }
}

// ── DATA MÍNIMA (não permitir datas passadas) ─
const dateInput = document.getElementById('appointmentDate');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// ── MÁSCARA DE TELEFONE ───────────────────────
const phoneInput = document.getElementById('clientPhone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 2) {
      phoneInput.value = v.length ? `(${v}` : '';
    } else if (v.length <= 6) {
      phoneInput.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length <= 10) {
      phoneInput.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else {
      phoneInput.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    }
  });
}

// ── AGENDAMENTO VIA WHATSAPP ──────────────────
function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function submitBooking() {
  const name    = document.getElementById('clientName')?.value.trim();
  const phone   = document.getElementById('clientPhone')?.value.trim();
  const service = document.getElementById('serviceSelect')?.value;
  const date    = document.getElementById('appointmentDate')?.value;
  const time    = document.getElementById('appointmentTime')?.value;
  const notes   = document.getElementById('clientNotes')?.value.trim();
  const errorEl = document.getElementById('formError');

  // Validação
  if (!name) {
    showError(errorEl, '⚠️ Por favor, informe seu nome completo.');
    return;
  }
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    showError(errorEl, '⚠️ Por favor, informe um número de WhatsApp válido.');
    return;
  }
  if (!service) {
    showError(errorEl, '⚠️ Por favor, selecione o serviço desejado.');
    return;
  }
  if (!date) {
    showError(errorEl, '⚠️ Por favor, selecione a data preferida.');
    return;
  }
  if (!time) {
    showError(errorEl, '⚠️ Por favor, selecione o horário preferido.');
    return;
  }

  // Limpa erro
  if (errorEl) errorEl.textContent = '';

  const dateBR = formatDateBR(date);
  const obsText = notes || 'Sem informações adicionais';

  // Monta mensagem formatada
  const msg =
`🌸 *NOVO AGENDAMENTO — KESSYA NAILS* 🌸

👤 *Nome:* ${name}
📱 *WhatsApp:* ${phone}

💅 *Serviço Desejado:* ${service}
📅 *Data Preferida:* ${dateBR}
⏰ *Horário Preferido:* ${time}

📝 *Informações / Referência:*
${obsText}

---
✨ Agendamento feito pelo site kessyanails.com.br
Aguardo sua confirmação! 💜`;

  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── CAROUSEL: pausa no hover ──────────────────
const carousel = document.getElementById('testimonialCarousel');
if (carousel) {
  carousel.addEventListener('mouseenter', () => {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);
    if (bsCarousel) bsCarousel.pause();
  });
  carousel.addEventListener('mouseleave', () => {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);
    if (bsCarousel) bsCarousel.cycle();
  });
}

// ── ACTIVE NAV LINK ON SCROLL ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(section => sectionObserver.observe(section));
