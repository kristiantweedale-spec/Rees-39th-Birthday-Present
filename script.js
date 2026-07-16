const startButton = document.getElementById("startButton");
const revealButton = document.getElementById("revealButton");
const replayButton = document.getElementById("replayButton");
const story = document.getElementById("story");
const destination = document.getElementById("destination");

startButton.addEventListener("click", () => story.scrollIntoView({ behavior: "smooth" }));

revealButton.addEventListener("click", () => {
  destination.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    launchConfetti();
    if (navigator.vibrate) navigator.vibrate([40, 35, 80]);
  }, 650);
});

replayButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
  observer.observe(el);
});

window.addEventListener("load", () => {
  document.querySelector(".hero-content").classList.add("visible");
});

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const pieces = Array.from({ length: 150 }, () => ({
    x: rect.width / 2 + (Math.random() - .5) * 140,
    y: rect.height * .22,
    vx: (Math.random() - .5) * 12,
    vy: -Math.random() * 9 - 4,
    gravity: .16 + Math.random() * .08,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - .5) * .25,
    size: 5 + Math.random() * 8,
    color: ["#d9b36c", "#f5f0e6", "#2d7b66", "#ffffff", "#e68484"][Math.floor(Math.random() * 5)]
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, rect.width, rect.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      ctx.restore();
    });
    frame++;
    if (frame < 240) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, rect.width, rect.height);
  }
  animate();
}
