/* =====================================================
   ALEX MORGAN — PORTFOLIO JAVASCRIPT
   Handles: navbar, reveal animations, counters,
   skill bars, project filter, testimonial carousel,
   contact form, back-to-top, footer year
   ===================================================== */

"use strict";

/* ===== DOM READY WRAPPER ===== */
document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------
     1. NAVBAR — scroll shrink + active section
  ------------------------------------------------ */
  const navbar   = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  /* Shrink navbar on scroll */
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
    // Show / hide back-to-top
    backTop.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  /* Mobile hamburger toggle */
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
  });

  /* Close mobile menu on link click */
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  const activateNavLink = () => {
    let current = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.remove("active-link");
      if (a.getAttribute("href") === `#${current}`) a.classList.add("active-link");
    });
  };

  window.addEventListener("scroll", activateNavLink, { passive: true });


  /* ------------------------------------------------
     2. SCROLL REVEAL ANIMATION (IntersectionObserver)
  ------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Small stagger for sibling cards
        const card = entry.target;
        const delay = card.dataset.delay || 0;
        setTimeout(() => {
          card.classList.add("in-view");
        }, delay);
        revealObserver.unobserve(card);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  revealEls.forEach((el, i) => {
    // Auto-stagger grid children
    const parent = el.parentElement;
    const siblings = [...parent.querySelectorAll(".reveal")];
    const idx = siblings.indexOf(el);
    el.dataset.delay = idx * 100;
    revealObserver.observe(el);
  });


  /* ------------------------------------------------
     3. ANIMATED STAT COUNTERS (Hero section)
  ------------------------------------------------ */
  const statNums = document.querySelectorAll(".stat-num");

  const countUp = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms
    const step = target / (duration / 16); // ~60fps
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Trigger counters when hero is in view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(num => countUp(num));
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const heroSection = document.getElementById("hero");
  if (heroSection) heroObserver.observe(heroSection);


  /* ------------------------------------------------
     4. SKILL BAR FILL ANIMATION
  ------------------------------------------------ */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".skill-fill");
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById("skills");
  if (skillsSection) skillObserver.observe(skillsSection);


  /* ------------------------------------------------
     5. PROJECT FILTER TABS
  ------------------------------------------------ */
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;

        if (show) {
          card.classList.remove("hidden");
          // Re-trigger fade-in
          card.style.animation = "none";
          void card.offsetHeight; // reflow
          card.style.animation = "";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });


  /* ------------------------------------------------
     6. CONTACT FORM (client-side validation + mock submit)
  ------------------------------------------------ */
  const contactForm   = document.getElementById("contactForm");
  const formSuccess   = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simple validation
      const fields = contactForm.querySelectorAll("input[required], textarea[required]");
      let valid = true;

      fields.forEach(field => {
        field.style.borderColor = "";
        if (!field.value.trim()) {
          field.style.borderColor = "#ff4d4d";
          valid = false;
        }
        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.style.borderColor = "#ff4d4d";
          valid = false;
        }
      });

      if (!valid) return;

      // Mock API call delay
      const submitBtn = contactForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
        formSuccess.hidden = false;
        // Hide success after 5s
        setTimeout(() => { formSuccess.hidden = true; }, 5000);
      }, 1200);
    });

    // Live validation feedback
    contactForm.querySelectorAll("input, textarea").forEach(field => {
      field.addEventListener("input", () => {
        if (field.value.trim()) field.style.borderColor = "";
      });
    });
  }


  /* ------------------------------------------------
     8. BACK TO TOP BUTTON
  ------------------------------------------------ */
  const backTop = document.getElementById("backTop");

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ------------------------------------------------
     9. FOOTER YEAR
  ------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ------------------------------------------------
     10. SMOOTH SCROLL for all anchor links
         (CSS `scroll-behavior: smooth` handles most,
          but this adds offset for fixed navbar)
  ------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });


  /* ------------------------------------------------
     11. HERO GRID PARALLAX (subtle depth effect)
  ------------------------------------------------ */
  const heroGrid = document.querySelector(".hero-grid");

  if (heroGrid && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGrid.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }


  /* ------------------------------------------------
     12. CURSOR GLOW EFFECT (desktop only)
  ------------------------------------------------ */
  if (window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(200,255,0,.06) 0%, transparent 70%);
      transform: translate(-50%, -50%); transition: opacity .3s;
      top: 0; left: 0;
    `;
    document.body.appendChild(glow);

    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top  = e.clientY + "px";
    }, { passive: true });
  }

}); // end DOMContentLoaded
