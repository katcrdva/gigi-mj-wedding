/* =========================================================
   GILLAN & MERRY JANE — WEDDING INVITATION
   script.js
   ========================================================= */

/* -----------------------------------------------------------
   CONFIG — the only two lines you should need to edit
   ----------------------------------------------------------- */
const CONFIG = {
  // Paste the Google Apps Script Web App URL here after deploying
  // apps-script/Code.gs (see README.md, step "Connect the RSVP form").
  RSVP_ENDPOINT: "https://script.google.com/macros/s/AKfycbwRT6K4ovx1bPEpgYsnefCbS-6EBXQgBIv1eq8iqGlvQzLujIpGo4p3zbNILHcirBRt4g/exec",
  WEDDING_DATE_ISO: "2026-11-28T10:00:00+08:00" // ceremony start, Asia/Manila
};

document.addEventListener("DOMContentLoaded", () => {
  initCurtain();
  initNav();
  initMusic();
  initCountdown();
  initStorySlideshow();
  initReveal();
  initFaq();
  initRsvp();
});

/* ---------------- curtain opening ---------------- */
function initCurtain(){
  const curtain = document.getElementById("curtain-screen");
  const openBtn = document.getElementById("open-invitation");
  const nav = document.getElementById("site-nav");
  const body = document.body;

  function open(){
    curtain.classList.add("open");
    body.classList.remove("lock");
    nav.classList.add("show");
    tryPlayMusic();
    // Curtains stay visible as a stage frame — just stop blocking the
    // page once the opening animation has finished.
    setTimeout(() => curtain.classList.add("settled"), 1650);
  }

  openBtn.addEventListener("click", open, { once: true });
  curtain.addEventListener("click", (e) => {
    if (e.target === curtain) open();
  }, { once: true });
}

/* ---------------- navigation ---------------- */
function initNav(){
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("[data-nav]").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

/* ---------------- music ---------------- */
function tryPlayMusic(){
  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle");
  audio.volume = 0.55;
  audio.play().then(() => {
    musicBtn.textContent = "♫";
    musicBtn.dataset.playing = "true";
  }).catch(() => {
    // Autoplay blocked — the guest can start it manually via the toggle.
    musicBtn.dataset.playing = "false";
  });
}

function initMusic(){
  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle");

  musicBtn.addEventListener("click", () => {
    if (musicBtn.dataset.playing === "true"){
      audio.pause();
      musicBtn.dataset.playing = "false";
      musicBtn.textContent = "♪";
    } else {
      audio.play().then(() => {
        musicBtn.dataset.playing = "true";
        musicBtn.textContent = "♫";
      }).catch(() => {});
    }
  });
}

/* ---------------- Our Story photo slideshow ---------------- */
function initStorySlideshow(){
  const slides = document.querySelectorAll("#story-slideshow img");
  if (!slides.length) return;

  let index = Array.from(slides).findIndex(img => img.classList.contains("active"));
  if (index < 0) { index = 0; slides[0].classList.add("active"); }

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3600);
}

/* ---------------- countdown ---------------- */
function initCountdown(){
  const target = new Date(CONFIG.WEDDING_DATE_ISO).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs")
  };

  function tick(){
    const diff = target - Date.now();
    if (diff <= 0){
      els.days.textContent = "00"; els.hours.textContent = "00";
      els.mins.textContent = "00"; els.secs.textContent = "00";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    els.days.textContent = String(days).padStart(2, "0");
    els.hours.textContent = String(hours).padStart(2, "0");
    els.mins.textContent = String(mins).padStart(2, "0");
    els.secs.textContent = String(secs).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------------- scroll reveal ---------------- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

/* ---------------- FAQ accordion ---------------- */
function initFaq(){
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(other => {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ---------------- RSVP ---------------- */
function initRsvp(){
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("rsvp-status");
  const submitBtn = document.getElementById("rsvp-submit");
  const yesLabel = document.getElementById("attend-yes-label");
  const noLabel = document.getElementById("attend-no-label");

  form.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener("change", () => {
      yesLabel.classList.toggle("active", radio.value === "Yes" && radio.checked);
      noLabel.classList.toggle("active", radio.value === "No" && radio.checked);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (CONFIG.RSVP_ENDPOINT.includes("PASTE_YOUR")){
      showStatus("error", "RSVP Not Connected Yet",
        "The couple hasn't connected the guest book yet. Please try again later.");
      return;
    }

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      attendance: form.attendance.value,
      message: form.message.value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch(CONFIG.RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.status === "duplicate"){
        showStatus("info", "RSVP Already Submitted", "Thank you for confirming your attendance!");
      } else if (result.status === "success" && data.attendance === "No"){
        showStatus("info", "Thank You", "Thank you for letting us know. You will be missed, but we completely understand.");
      } else if (result.status === "success"){
        showStatus("success", "RSVP Successfully Submitted",
          "Thank you for celebrating with Gillan & Merry Jane. We can't wait to share this beautiful day with you.",
          true);
      } else {
        throw new Error(result.message || "Unknown error");
      }
      form.reset();
      yesLabel.classList.remove("active");
      noLabel.classList.remove("active");
      form.style.display = "none";
    } catch (err){
      showStatus("error", "Something Went Wrong", "We couldn't send your RSVP just now. Please try again in a moment.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit RSVP";
    }
  });

  function showStatus(type, title, message, withSeatNote){
    status.className = "rsvp-status show" + (type === "error" ? " error" : "");
    status.innerHTML =
      `<h3 class="heading-sm">${title}</h3>` +
      `<p class="max-prose center-col">${message}</p>` +
      (withSeatNote
        ? `<p class="rsvp-note"><strong>Your Seat Has Been Reserved</strong><br>Kindly note that seating is arranged according to the guests named on each invitation. We sincerely appreciate your understanding.</p>
           <img class="monogram-img" src="images/initials.jpg" alt="Gillan & Merry Jane monogram">`
        : "");
  }
}
