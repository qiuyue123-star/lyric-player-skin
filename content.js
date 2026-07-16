let globalSwitch = false;
let currentEffect = "purple-gradient";
let particlePool = [];

// 读取配置、更新特效状态
async function updateEffectConfig() {
  const res = await chrome.storage.local.get(["clickEffectSwitch", "activeEffect"]);
  globalSwitch = res.clickEffectSwitch;
  currentEffect = res.activeEffect;
}
updateEffectConfig();

// 接收弹窗发来的配置刷新消息
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "refreshEffectState") updateEffectConfig();
});

// 粒子基类
class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6 - 2;
    this.alpha = 1;
    this.size = Math.random() * 8 + 4;
    this.life = 60;
    this.type = type;
    this.dom = document.createElement("div");
    this.initStyle();
    document.body.appendChild(this.dom);
  }
  initStyle() {
    const el = this.dom;
    el.style.position = "fixed";
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999999";
    el.style.left = this.x + "px";
    el.style.top = this.y + "px";
    el.style.opacity = this.alpha;

    // 原有3种效果
    switch (this.type) {
      case "purple-gradient":
        el.style.borderRadius = "50%";
        el.style.background = `radial-gradient(circle, #e0b8ff, #7a42d8)`;
        el.style.width = this.size + "px";
        el.style.height = this.size + "px";
        break;
      case "bow-pink":
        el.style.width = this.size * 1.8 + "px";
        el.style.height = this.size + "px";
        el.style.background = `linear-gradient(90deg, #ffd6e8 40%, #fff 50%, #ffd6e8 60%)`;
        el.style.borderRadius = "999px";
        break;
      case "water-drop":
        el.style.width = this.size + "px";
        el.style.height = this.size * 1.4 + "px";
        el.style.background = `linear-gradient(#b8e4ff, #ffffff)`;
        el.style.borderRadius = "50% 50% 50% 50% / 30% 30% 70% 70%";
        break;

      // 新增1：不同颜色音符
      case "music-note":
        const noteColors = ["#ff7eb9", "#73b8ff", "#ffdd70", "#88e8a0", "#c9a0ff"];
        const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
        el.style.width = this.size + "px";
        el.style.height = this.size * 1.6 + "px";
        el.style.background = randomColor;
        el.style.borderRadius = "0 0 50% 50%";
        el.style.clipPath = "polygon(40% 0, 60% 0, 60% 70%, 100% 70%, 100% 90%, 60% 90%, 60% 100%, 40% 100%, 40% 90%, 0 90%, 0 70%, 40% 70%)";
        break;

      // 新增2：小柑橘
      case "tangerine":
        el.style.width = this.size + "px";
        el.style.height = this.size + "px";
        el.style.borderRadius = "50%";
        el.style.background = "radial-gradient(circle at 30% 30%, #fff9cc, #ff9c38, #e66a00)";
        el.style.boxShadow = `inset -2px -2px 4px rgba(120,50,0,0.3)`;
        break;

      // 新增3：水花
      case "splash-water":
        el.style.width = this.size * 1.2 + "px";
        el.style.height = this.size * 1.2 + "px";
        el.style.borderRadius = "50%";
        el.style.background = "radial-gradient(circle, #ffffff, #b8e8ff, #60b8ff)";
        el.style.filter = "blur(1px)";
        break;

      // 新增4：渐变橙粒子
      case "orange-gradient":
        el.style.borderRadius = "50%";
        el.style.background = `radial-gradient(circle, #ffe8b8, #ff8822)`;
        el.style.width = this.size + "px";
        el.style.height = this.size + "px";
        break;
    }
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12;
    this.alpha -= 1 / this.life;
    this.life--;
    this.dom.style.left = this.x + "px";
    this.dom.style.top = this.y + "px";
    this.dom.style.opacity = this.alpha;
  }
  remove() {
    this.dom.remove();
  }
}

// 鼠标点击生成粒子
document.addEventListener("mousedown", (e) => {
  if (!globalSwitch) return;
  const count = 12;
  for (let i = 0; i < count; i++) {
    particlePool.push(new Particle(e.clientX, e.clientY, currentEffect));
  }
});

// 粒子动画循环
function animateParticles() {
  for (let i = particlePool.length - 1; i >= 0; i--) {
    const p = particlePool[i];
    p.update();
    if (p.life <= 0) {
      p.remove();
      particlePool.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
