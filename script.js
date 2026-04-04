// =============================================================================
// GEOLOGIC PORTFOLIO — script.js
// Renders dynamic content from data/ files and handles all UX interactions.
// Dependencies: profile.js, services.js, projects.js (loaded before this file)
// =============================================================================

// ─── TECH STACK CONFIGURATION ────────────────────────────────────────────────
// Each tool: logo filename (in assets/logos/) and display label.
// SVG preferred; fallback emoji shown if image fails to load.

const techStack = [
  { file: "python.svg",    label: "Python",     fallback: "🐍" },
  { file: "arcgis.svg",    label: "ArcGIS",     fallback: "🌍" },
  { file: "qgis.svg",      label: "QGIS",       fallback: "🗺️" },
  { file: "sqlite.svg",    label: "SQL",        fallback: "💾" },
  { file: "streamlit.svg", label: "Streamlit",  fallback: "📊" },
  { file: "metashape.svg", label: "Metashape",  fallback: "🛰️" },
];

// ─── HELPER: Generate mailto URL ─────────────────────────────────────────────
function emailLink(email, subject, body) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ─── INTERACTION: Scroll to CTA form + auto-fill project type ────────────────
// Called by service card "Get a Quote" buttons.
function openServiceForm(serviceName) {
  const select = document.getElementById("projectType");
  if (select) {
    for (const option of select.options) {
      if (option.value === serviceName) {
        select.value = serviceName;
        break;
      }
    }
  }
  document.getElementById("cta").scrollIntoView({ behavior: "smooth" });
}

// ─── INTERACTION: Scroll to CTA from hero button ─────────────────────────────
function scrollToCTA() {
  document.getElementById("cta").scrollIntoView({ behavior: "smooth" });
}

// ─── RENDER: Populate static profile text ────────────────────────────────────
function renderProfile() {
  // Badge / tagline
  const badgeEl = document.getElementById("hero-badge");
  if (badgeEl) badgeEl.textContent = profile.tagline;

  // Hero headline
  const heroStaticEl = document.getElementById("hero-title-static");
  if (heroStaticEl) heroStaticEl.textContent = profile.heroTitle + " ";

  const heroAccentEl = document.getElementById("hero-title-accent");
  if (heroAccentEl) heroAccentEl.textContent = profile.heroAccent;

  // Hero subtext
  const heroSubEl = document.getElementById("hero-sub");
  if (heroSubEl) heroSubEl.textContent = profile.heroSub;

  // Projects count stat
  const statEl = document.getElementById("projects-count");
  if (statEl) statEl.textContent = profile.projectsCount;

  // Trust badge
  const trustEl = document.getElementById("trust-badge");
  if (trustEl) trustEl.textContent = profile.trustBadge;

  // Footer
  const footerEl = document.getElementById("footer-text");
  if (footerEl) {
    footerEl.innerHTML = `&copy; ${new Date().getFullYear()} ${profile.companyName}. ${profile.footerText}`;
  }

  // Page title
  document.title = `${profile.tagline} | ${profile.companyName}`;
}

// ─── RENDER: Service Cards ────────────────────────────────────────────────────
function renderServices() {
  const container = document.getElementById("services-container");
  if (!container) return;

  container.innerHTML = services.map(s => `
    <article class="service-card">
      <span class="service-icon">${s.icon}</span>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.desc}</p>
      <div class="service-meta">
        <div>${s.price}</div>
        <div>Delivery: <strong>${s.delivery}</strong></div>
      </div>
      <button class="btn-secondary" onclick="openServiceForm('${s.title.replace(/'/g, "\\'")}')">
        Get a Quote →
      </button>
    </article>
  `).join("");
}

// ─── RENDER: Project Cards ────────────────────────────────────────────────────
function renderProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.innerHTML = projects.map(proj => `
    <div class="project-card">
      <span class="project-tag">${proj.tag}</span>
      <h3>${proj.title}</h3>
      <p>${proj.desc}</p>
    </div>
  `).join("");
}

// ─── RENDER: Tech Stack Logos ─────────────────────────────────────────────────
// Images load from assets/logos/. If a file fails, the fallback emoji is shown.
function renderTechStack() {
  const container = document.getElementById("tech-logos-container");
  if (!container) return;

  container.innerHTML = techStack.map(tool => `
    <div class="tech-logo-item" title="${tool.label}">
      <img
        src="assets/logos/${tool.file}"
        alt="${tool.label}"
        width="36"
        height="36"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
      />
      <span class="logo-fallback" style="display:none;font-size:26px;">${tool.fallback}</span>
      <span>${tool.label}</span>
    </div>
  `).join("");
}

// ─── RENDER: Populate form dropdown from services data ────────────────────────
function renderFormDropdown() {
  const select = document.getElementById("projectType");
  if (!select) return;

  // Clear existing options except the placeholder
  const placeholder = select.querySelector('option[disabled]');
  select.innerHTML = "";

  // Re-add placeholder
  const def = document.createElement("option");
  def.value = "";
  def.disabled = true;
  def.selected = true;
  def.textContent = "Select a service...";
  select.appendChild(def);

  // Add one option per service
  services.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.title;
    opt.textContent = s.title;
    select.appendChild(opt);
  });

  // Add a generic fallback
  const other = document.createElement("option");
  other.value = "Other / Not Sure";
  other.textContent = "Other / Not Sure";
  select.appendChild(other);
}

// ─── FORM: Submit handler → mailto ───────────────────────────────────────────
function initForm() {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name  = document.getElementById("clientName").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const type  = document.getElementById("projectType").value;
    const desc  = document.getElementById("projectDesc").value.trim();

    if (!name || !email || !type || !desc) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const subject = `Project Inquiry: ${type}`;
    const body =
`Hello,

I would like to inquire about a project.

Name / Company: ${name}
Email: ${email}
Project Type: ${type}

Project Description:
${desc}

Looking forward to your proposal.`;

    window.location.href = emailLink(profile.email, subject, body);
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  renderProfile();
  renderServices();
  renderProjects();
  renderTechStack();
  renderFormDropdown();
  initForm();
});
