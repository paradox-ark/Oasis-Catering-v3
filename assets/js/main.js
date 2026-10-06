/* ============================================================
   OASIS CATERING & EVENT MANAGEMENT — Master Interactions & Menu Engine
   ============================================================ */
(function() {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  /* ---------- Header Scrolled State ---------- */
  const header = $(".site-header");
  const fabTop = $("#fabTop");

  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
    if (fabTop) {
      fabTop.style.display = window.scrollY > 600 ? "grid" : "none";
    }
  }, { passive: true });

  /* ---------- Mobile Navigation Drawer ---------- */
  const drawer = $("#drawer");
  const burger = $("[data-open-drawer]");
  const drawerCloseButtons = $$("[data-close-drawer]");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
    if (burger) burger.setAttribute("aria-expanded", "true");
    const firstLink = $("a, button", drawer);
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.focus();
    }
  }

  if (burger) {
    burger.setAttribute("aria-expanded", "false");
    burger.addEventListener("click", openDrawer);
  }

  drawerCloseButtons.forEach(btn => btn.addEventListener("click", closeDrawer));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  /* ---------- Active Nav Links ---------- */
  const currentPath = (location.pathname.split("/").pop() || "").toLowerCase();
  $$(".nav-links a, .drawer-panel a.dlink").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase().replace(/^\//, "");
    if (href === currentPath || (currentPath === "" && (href === "index.html" || href === ""))) {
      a.classList.add("active");
    }
  });

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    $$(".reveal").forEach(el => observer.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
  }

  /* ---------- Hero Video Reel Switcher (index.html) ---------- */
  const heroVideo = $("#heroVideo");
  const heroReelBtns = $$(".hero-reel-btn");

  if (heroVideo && heroReelBtns.length) {
    heroReelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        heroReelBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const nextSrc = btn.dataset.src;
        const nextPoster = btn.dataset.poster;

        if (nextSrc && heroVideo.getAttribute("src") !== nextSrc) {
          heroVideo.src = nextSrc;
          if (nextPoster) heroVideo.poster = nextPoster;
          heroVideo.load();
          heroVideo.play().catch(() => {});
        }
      });
    });
  }

  /* ---------- Back to Top Button ---------- */
  if (fabTop) {
    fabTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Minimum Date for Booking Forms ---------- */
  const dateInput = $("#f-date");
  if (dateInput) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }

  /* ---------- Universal Lightbox (Homepage Rail + Gallery) ---------- */
  const lightbox = $("#lightbox");
  const lightboxItems = $$(".g-item");

  if (lightbox && lightboxItems.length) {
    const lbImg = $("#lbImg");
    const lbCap = $("#lbCap");
    let currentIndex = 0;

    const visibleItems = () => lightboxItems.filter(item => item.style.display !== "none");

    function displayLightboxImage(index) {
      const items = visibleItems();
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      const targetItem = items[currentIndex];
      const img = $("img", targetItem);
      const cap = $("figcaption", targetItem);

      if (img && lbImg) {
        lbImg.src = img.src;
        lbImg.alt = img.alt || "Oasis setup preview";
      }
      if (lbCap) {
        lbCap.textContent = cap ? cap.textContent : (img ? img.alt : "");
      }
    }

    function openLightbox(item) {
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      const index = visibleItems().indexOf(item);
      displayLightboxImage(index >= 0 ? index : 0);
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    lightboxItems.forEach(item => {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", "View larger image");

      item.addEventListener("click", () => openLightbox(item));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    const closeBtn = $("[data-lb-close]", lightbox);
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

    const prevBtn = $(".lb-prev", lightbox);
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        displayLightboxImage(currentIndex - 1);
      });
    }

    const nextBtn = $(".lb-next", lightbox);
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        displayLightboxImage(currentIndex + 1);
      });
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") displayLightboxImage(currentIndex + 1);
      if (e.key === "ArrowLeft") displayLightboxImage(currentIndex - 1);
    });
  }

  /* ---------- Gallery Filtering (gallery.html) ---------- */
  const galleryFilterButtons = $$("[data-gfilter]");
  if (galleryFilterButtons.length) {
    galleryFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        galleryFilterButtons.forEach(b => b.classList.remove("on"));
        btn.classList.add("on");
        const category = btn.dataset.gfilter;
        $$(".g-grid .g-item").forEach(item => {
          const match = category === "all" || item.dataset.cat === category;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------- Gallery Video Playback (Single Play Guard) ---------- */
  const galleryVideos = $$(".film-card video");
  if (galleryVideos.length) {
    galleryVideos.forEach(video => {
      video.addEventListener("play", () => {
        galleryVideos.forEach(other => {
          if (other !== video && !other.paused) {
            other.pause();
          }
        });
      });
    });
  }

  /* ---------- Accessible FAQ Accordion ---------- */
  const faqItems = $$(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = $(".faq-q", item);
    if (!questionBtn) return;

    questionBtn.setAttribute("aria-expanded", "false");

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Accordion mode: collapse others
      faqItems.forEach(other => {
        other.classList.remove("open");
        const otherBtn = $(".faq-q", other);
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ============================================================
     FULL OASIS MENU DATA REPOSITORY
     ============================================================ */
  const MENU = [
    ["Rice & Pulao", "From the deg & the dum", [
      "Chicken Biryani", "Mutton Biryani", "Sindhi Biryani", "Delhi Biryani",
      "Hyderabadi Biryani", "Chicken Pulao", "Vegetable Pulao", "Mutton Pulao",
      "Brown Rice", "Afghani Pulao", "Peas Pulao", "Buttered Rice", "Fried Rice",
      "Tehri Pulao", "Royal Prawn Biryani", "Sweet Kashmiri Pulao"
    ]],
    ["Pakistani Selection", "Desi heritage favourites", [
      "Chicken Qorma", "Mutton Qorma", "Mutton Ginger", "Mutton Khara Masala",
      "Mutton Qeema", "Qeema Gurday", "Chicken Dahiwala", "Chicken Karahi",
      "Qeema Makhanay", "Mutton Dahiwala", "Mutton Karahi Palak", "Mutton Karahi",
      "Palak Maghaz", "Chicken Ginger", "Chicken Khara Masala"
    ]],
    ["Chicken Specialties", "Crowd-pleasers, wedding style", [
      "Sajji Roast", "Chargha Roast", "Chicken Shawarma", "Chicken Kiev",
      "Crispy Broast Chicken", "Steamed Chicken Roast", "Chicken Chapli Kabab",
      "Creamy Handi Chicken", "Chicken Kofta Curry", "Chicken Stew",
      "Ala King Chicken", "Whole Spice Chicken", "Chili Chicken Toss",
      "Chicken Mushroom Bake", "Herb Chicken Curry", "Foil Chicken Roast",
      "Cheesy Chicken Fingers", "Chicken Cordon Bleu", "Butter Cream Chicken",
      "Dynamite Chicken Bites", "Balochi Chicken Tikka", "Ottoman Turkish Kabab"
    ]],
    ["Mutton Specialties", "Slow, rich & celebratory", [
      "Whole Stuffed Lamb", "Mutton Roast", "Foil Mutton Roast", "Multani Kunna",
      "Tawa Khata Khat", "Whole Spice Mutton", "Creamy Handi Mutton", "Makhani Mutton",
      "Achari Gosht", "Do Piyaza Mutton", "Palak Mutton", "Mutton Paya",
      "Mutton Joint Roast", "Surf & Turf (Mutton-Prawn)", "Mutton Raan (Upon Request)"
    ]],
    ["Beef Selections", "Deep flavour, generous cuts", [
      "Mughlai Gola Kabab", "Beef Seekh Kabab", "Behari Strip Kabab", "Beef Chapli Kabab",
      "Beef Shami Kabab", "Beef Kofta Curry", "Nargisi Kofta", "Beef Shashlik",
      "Beef Shawarma", "Beef Stir-Fry", "Bohri Beef Cutlets", "Mughlai Beef Qorma",
      "Tawa Beef Kabab", "BBQ Beef Boti", "Beef Nihari", "Pasanda Beef Curry",
      "Beef Lasagna", "Beef Haleem"
    ]],
    ["Ocean Specials", "Fresh seafood & sizzlers", [
      "Prawn Sizzlers", "Tempura Prawns", "Fish Tempura", "Fish Cakes",
      "Crumb Fried Fish", "Fish Orly", "Whole Pomfret", "Fish Cheese Crispers",
      "Fish Karahi", "Tawa Surmai", "Dynamite Prawns", "BBQ Crab", "Shrimp Curry"
    ]],
    ["Barbecue", "Live fire & smoke", [
      "Chicken Tikka", "Kidney / Liver", "Ribs", "Chicken Shashlyk",
      "Seekh Kebab", "Prawns", "Chicken Boti", "Bihari Kebab",
      "Fish Tikka", "Mutton Boti", "Gola Kebab", "Hot Dogs", "Lamb Chops", "T-Bone Steak"
    ]],
    ["Vegetables & Daal", "Garden-fresh & desi", [
      "Vegetable Bhujia", "Palak Paneer", "Aloo Achari", "Mirchay Ka Salan",
      "Baghary Baingan", "Vegetables Sautee", "Khata Tamatar", "Aloo Methi",
      "Potato Bhujia with Puri", "Mixed Vegetable Medley", "Veggie Cutlets",
      "Veg Spring Rolls", "Palak Aloo", "Vegetable Biryani", "Tadka Dal",
      "Daal Mash", "Daal Chana", "Bhindi Masala (Seasonal)", "Malai Kofta",
      "Paneer Skewers", "Paneer Karahi", "Sarson Saag & Makki Roti"
    ]],
    ["Soups", "To open the appetite", [
      "Chicken Corn Soup", "Cream of Chicken", "Hot & Sour Soup", "Thai Coconut Soup",
      "Cream of Mushroom", "Roasted Tomato Soup", "Masala Lentil Soup",
      "Chicken Consommé", "Spanish Gazpacho"
    ]],
    ["Exotic Additions", "Crisp, sizzling & special", [
      "Finger Fish", "Lahori Fried Fish", "Tempura", "Fried Prawns", "Haleem",
      "Dahi Baray", "Chicken Lollipops", "Chicken Nuggets", "Chicken Croquettes",
      "Chicken Wontons", "Sizzling Tawa Chicken"
    ]],
    ["Snacks & Hi-Tea", "Evening tables & tea-time", [
      "Alfredo Pasta", "Tea Sandwiches", "Chicken Puff", "Vol-au-Vent",
      "Pizza Bites", "Chicken Samosa", "Mince Samosa", "Cheese Samosa",
      "Veg Samosa", "Spring Rolls", "Fish Fingers", "French Fries",
      "Dahi Phulki", "Chana Chaat", "Mini Sliders", "Tea Cake",
      "Marble Cake", "Fruit Loaf", "Cookie Medley", "Pastry Assortment",
      "Pani Puri (Live)", "Chicken Wings", "Zesty Drumsticks", "Chicken Cheese Bites"
    ]],
    ["Salads & Raita", "Fresh & bright", [
      "Fresh Green Salad", "Kachumar Salad", "Russian Salad", "Macaroni Salad",
      "Beet Root Salad", "Mint Raita", "Egg & Potato Salad", "Cole Slaw", "Kidney Beans Salad"
    ]],
    ["Desserts", "A sweet farewell", [
      "Kheer", "Gulab Jaman", "Ras Malai", "Firni", "Chocolate Mousse",
      "Fruit Trifle", "Ice Cream", "Jalebi", "Cheese Cake", "Apricot with Cream",
      "Halwa Gajar", "Halwa Akhrot", "Shahi Tukra", "Kulfi Falooda",
      "Caramel Custard", "Saffron Phirni", "Golap Jamun Brownie", "Doodh Dulari", "Royal Motanjan"
    ]],
    ["Hot Beverages", "Served steaming", [
      "Tea", "Green Tea", "Kashmiri Tea", "Coffee"
    ]],
    ["Cold Drinks & Refreshments", "Cool & celebratory", [
      "Fresh Lime Soda", "Mint Margarita", "Virgin Mojito", "Pina Colada",
      "Blue Lagoon Mocktail", "Fruit Smoothies", "Fresh Juices", "Falooda Shake"
    ]]
  ];

  /* ---------- Shortlist Storage & Operations ---------- */
  const STORAGE_KEY = "oasis_shortlist_v1";

  function getShortlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveShortlist(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  let shortlist = getShortlist();

  function syncShortlistUI() {
    $$("#shortCount, .short-badge").forEach(el => {
      el.textContent = shortlist.length;
    });

    const box = $("#shortBox");
    if (box) {
      if (shortlist.length) {
        box.innerHTML = shortlist.map(item => `
          <span class="pill">
            ${escapeHTML(item)}
            <button data-rm="${escapeHTML(item)}" aria-label="Remove ${escapeHTML(item)}" style="border:none;background:none;cursor:pointer;color:var(--maroon);font-weight:700;margin-left:0.3rem">✕</button>
          </span>
        `).join("");

        $$("[data-rm]", box).forEach(btn => {
          btn.addEventListener("click", () => {
            const item = btn.dataset.rm;
            shortlist = shortlist.filter(x => x !== item);
            saveShortlist(shortlist);
            syncShortlistUI();
            updateAddButtons();
          });
        });
      } else {
        box.innerHTML = `<p class="form-note">Tap “+ Add” on any dish to build your enquiry list. Your shortlisted dishes travel with you to the quote form.</p>`;
      }
    }

    // Floating Shortlist Dock on menu page
    const floatBar = $("#shortlistFloat");
    if (floatBar) {
      floatBar.style.display = shortlist.length ? "flex" : "none";
    }
  }

  function updateAddButtons() {
    $$("[data-add]").forEach(btn => {
      const dish = btn.dataset.add;
      const isSelected = shortlist.includes(dish);
      btn.classList.toggle("added", isSelected);
      btn.textContent = isSelected ? "✓ Added" : "+ Add";
    });
  }

  function toggleDish(name) {
    if (shortlist.includes(name)) {
      shortlist = shortlist.filter(x => x !== name);
    } else {
      shortlist.push(name);
    }
    saveShortlist(shortlist);
    syncShortlistUI();
    updateAddButtons();
  }

  /* ---------- Render Menu Page (menu.html) ---------- */
  const menuRoot = $("#menuRoot");
  const catNav = $("#catNav");

  if (menuRoot) {
    const searchInput = $("#menuSearch");
    const filterSelect = $("#menuFilter");

    // Build Category Navigation Pills
    if (catNav) {
      const allBtn = document.createElement("button");
      allBtn.className = "cat on";
      allBtn.textContent = "All Categories";
      allBtn.dataset.cat = "";
      allBtn.addEventListener("click", () => {
        $$(".cat", catNav).forEach(b => b.classList.remove("on"));
        allBtn.classList.add("on");
        if (filterSelect) filterSelect.value = "";
        renderMenu();
      });
      catNav.appendChild(allBtn);

      MENU.forEach(([catName]) => {
        const btn = document.createElement("button");
        btn.className = "cat";
        btn.textContent = catName;
        btn.dataset.cat = catName;
        btn.addEventListener("click", () => {
          $$(".cat", catNav).forEach(b => b.classList.remove("on"));
          btn.classList.add("on");
          if (filterSelect) filterSelect.value = catName;
          renderMenu();
          const targetSection = $(`#cat-${slugify(catName)}`);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        catNav.appendChild(btn);

        if (filterSelect) {
          const opt = document.createElement("option");
          opt.value = catName;
          opt.textContent = catName;
          filterSelect.appendChild(opt);
        }
      });

      if (filterSelect) {
        filterSelect.insertAdjacentHTML("afterbegin", `<option value="">All categories</option>`);
      }
    }

    function renderMenu() {
      const searchTerm = (searchInput && searchInput.value || "").trim().toLowerCase();
      const activeCatBtn = catNav ? catNav.querySelector(".cat.on") : null;
      const selectedCategory = filterSelect && filterSelect.value ? filterSelect.value : (activeCatBtn ? activeCatBtn.dataset.cat : "");

      let totalMatchedDishes = 0;

      const renderedHTML = MENU
        .filter(([catName]) => !selectedCategory || catName === selectedCategory)
        .map(([catName, subtitle, items], idx) => {
          const matchedItems = items.filter(dish => !searchTerm || dish.toLowerCase().includes(searchTerm));
          if (searchTerm && !matchedItems.length) return "";

          totalMatchedDishes += matchedItems.length;

          return `
            <div class="menu-block" id="cat-${slugify(catName)}">
              <div class="kicker-row" style="margin-bottom:1rem">
                <div>
                  <span class="eyebrow">${String(idx + 1).padStart(2, "0")} · ${escapeHTML(subtitle)}</span>
                  <h2 class="h2">${escapeHTML(catName)}</h2>
                </div>
                <span class="pill">${matchedItems.length} dish${matchedItems.length === 1 ? "" : "es"}</span>
              </div>
              <div class="menu-grid">
                ${matchedItems.map(dish => `
                  <div class="menu-item">
                    <div>
                      <b>${escapeHTML(dish)}</b>
                      <small>${escapeHTML(catName)}</small>
                    </div>
                    <button class="add" data-add="${escapeHTML(dish)}">+ Add</button>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        })
        .join("");

      menuRoot.innerHTML = renderedHTML || `
        <div class="form-card" style="text-align:center;padding:3rem 1.5rem">
          <h3 style="font-family:var(--font-display);color:var(--maroon);font-size:1.5rem">No dishes match “${escapeHTML(searchInput.value)}”.</h3>
          <p class="form-note" style="margin:0.8rem 0 1.2rem">Try searching a different item (e.g. “biryani”, “karahi”, “kebab”) or browse all categories.</p>
          <button class="btn btn-outline btn-sm" id="clearMenuFilter">Reset Search & Filters ✕</button>
        </div>
      `;

      const menuCountEl = $("#menuCount");
      if (menuCountEl) {
        menuCountEl.textContent = searchTerm || selectedCategory
          ? `${totalMatchedDishes} dish${totalMatchedDishes === 1 ? "" : "es"} found`
          : `250+ dishes across ${MENU.length} categories`;
      }

      const clearBtn = $("#clearMenuFilter");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          if (searchInput) searchInput.value = "";
          if (filterSelect) filterSelect.value = "";
          if (catNav) {
            $$(".cat", catNav).forEach(b => b.classList.toggle("on", b.dataset.cat === ""));
          }
          renderMenu();
        });
      }

      $$("#menuRoot [data-add]").forEach(btn => {
        btn.addEventListener("click", () => toggleDish(btn.dataset.add));
      });

      updateAddButtons();
    }

    if (searchInput) searchInput.addEventListener("input", renderMenu);
    if (filterSelect) {
      filterSelect.addEventListener("change", () => {
        if (catNav) {
          $$(".cat", catNav).forEach(b => b.classList.toggle("on", b.dataset.cat === filterSelect.value));
        }
        renderMenu();
      });
    }

    renderMenu();
  }

  syncShortlistUI();
  updateAddButtons();

  /* ---------- Quote & Contact Form Handoff ---------- */
  const WA_NUMBER = "923295977659"; // Waqar Ahmed (Primary Event Bookings)

  // Auto-populate quote requirements field from shortlist
  const quoteReqField = $("#f-req");
  if (quoteReqField && !quoteReqField.value.trim() && shortlist.length) {
    quoteReqField.value = "Selected dishes from Oasis menu:\n• " + shortlist.join("\n• ") + "\n\n";
  }

  function extractQuoteFormData(form) {
    const val = id => ((form.querySelector("#" + id) || {}).value || "").trim();
    const services = $$('input[name="services"]:checked', form).map(cb => cb.value);

    return {
      name: val("f-name"),
      phone: val("f-phone"),
      email: val("f-email"),
      type: val("f-type"),
      date: val("f-date"),
      guests: val("f-guests"),
      loc: val("f-loc"),
      services,
      req: val("f-req"),
      details: val("f-details")
    };
  }

  function formatQuoteMessage(d) {
    let msg = `Assalam-o-Alaikum Oasis Team!\nI would like an event quotation.\n\n`;
    msg += `• Name: ${d.name}\n`;
    msg += `• Phone: ${d.phone}\n`;
    if (d.email) msg += `• Email: ${d.email}\n`;
    if (d.type) msg += `• Event Type: ${d.type}\n`;
    if (d.date) msg += `• Event Date: ${d.date}\n`;
    if (d.guests) msg += `• Expected Guests: ${d.guests}\n`;
    if (d.loc) msg += `• Venue / Location: ${d.loc}\n`;
    if (d.services.length) msg += `• Services: ${d.services.join(", ")}\n`;
    if (d.req) msg += `\nCatering Requirements:\n${d.req}\n`;
    if (d.details) msg += `\nAdditional Notes:\n${d.details}\n`;
    return msg;
  }

  const quoteForm = $("#quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = extractQuoteFormData(quoteForm);

      if (!data.name || !data.phone) {
        showToast("Please provide your name and contact phone number.");
        return;
      }

      const formattedText = formatQuoteMessage(data);
      const encodedWaText = encodeURIComponent(formattedText);
      const emailSubject = encodeURIComponent(`Quotation Request — ${data.name} (${data.type || "Event"})`);
      const emailBody = encodeURIComponent(formattedText);

      const doneBox = $("#quoteDone");
      if (doneBox) {
        doneBox.classList.add("show");
        doneBox.innerHTML = `
          <b style="font-family:var(--font-display);font-size:1.25rem;color:#ffffff;display:block">
            Shukriya, ${escapeHTML(data.name.split(" ")[0])} — your event enquiry is ready!
          </b>
          <p style="margin:0.6rem 0 1.2rem;color:var(--cream-200);font-size:0.95rem">
            Click below to send directly to our event team. We confirm dates and menus promptly.
          </p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <a class="btn btn-gold btn-sm" href="https://wa.me/${WA_NUMBER}?text=${encodedWaText}" target="_blank" rel="noopener">
              <img src="assets/images/icons/whatsapp-maroon.svg" alt="" style="width:18px;height:18px"> Send via WhatsApp
            </a>
            <a class="btn btn-ghost btn-sm" href="mailto:oasiscatering.pk@gmail.com?subject=${emailSubject}&body=${emailBody}">
              <img src="assets/images/icons/email-white.svg" alt="" style="width:18px;height:18px"> Send via Email
            </a>
          </div>
        `;
        doneBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  /* ---------- Toast Notification ---------- */
  function showToast(message) {
    let toast = $("#siteToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "siteToast";
      toast.style.cssText = "position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:var(--maroon-950);color:var(--cream-100);padding:0.9rem 1.4rem;border-radius:var(--r-full);z-index:200;border:1px solid var(--gold);box-shadow:var(--shadow-lg);font-size:0.92rem;text-align:center;max-width:min(480px,90vw)";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = "block";
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.display = "none"; }, 4000);
  }

  /* ---------- Footer Current Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Utilities ---------- */
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function slugify(text) {
    return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, "-");
  }

})();
