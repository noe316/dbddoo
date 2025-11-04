// =======================
//  rolling text ticker
// =======================
function rollingText(el) {
  if (!el || el.dataset.rollingInit === '1') return;
  el.dataset.rollingInit = '1';

  const track = el.querySelector('.ticker__track');
  if (!track) return;

  const baseItems = Array.from(track.children).map(n => n.cloneNode(true));
  const speed = Number(el.dataset.speed || 60); // px/s
  let gapPx = parseFloat(getComputedStyle(track).gap || '0');

  // ===== 컨테이너 길이에 맞게 복제 =====
  function fillTrack() {
    track.innerHTML = '';
    baseItems.forEach(n => track.appendChild(n.cloneNode(true)));

    const containerW = el.clientWidth;
    while (track.scrollWidth < containerW * 2) {
      baseItems.forEach(n => track.appendChild(n.cloneNode(true)));
    }
  }

  // ===== 루프 애니메이션 =====
  let x = 0, running = true, last = performance.now(), rafId = null;

  function widthWithGap(node) {
    const rect = node.getBoundingClientRect();
    return rect.width + gapPx;
  }

  function loop(now) {
    if (!running) return;
    const dt = (now - last) / 1000;
    last = now;
    x -= speed * dt;

    const first = track.firstElementChild;
    if (first) {
      const w = widthWithGap(first);
      if (-x >= w) {
        x += w;
        track.appendChild(first);
      }
    }

    track.style.transform = `translateX(${x}px)`;
    rafId = requestAnimationFrame(loop);
  }

  // ===== 컨트롤 =====
  function pause() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }
  function resume() {
    if (running) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  function rebuild() {
    const wasRunning = running;
    pause();
    x = 0;
    track.style.transform = 'translateX(0)';
    gapPx = parseFloat(getComputedStyle(track).gap || '0');
    fillTrack();
    if (wasRunning && !mql.matches) resume();
  }

  // ===== 이벤트 =====
  function onEnter() { pause(); }
  function onLeave() { if (!mql.matches) resume(); }
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 120);
  }

  const mql = matchMedia('(prefers-reduced-motion: reduce)');
  function onPRM() {
    if (mql.matches) {
      pause();
      track.style.transform = 'none';
    } else {
      resume();
    }
  }

  // el.addEventListener('mouseenter', onEnter);
  // el.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', onResize);
  mql.addEventListener?.('change', onPRM);

  // ===== 초기 실행 =====
  fillTrack();
  if (!mql.matches) requestAnimationFrame(loop);
  onPRM();
}

// =======================
//  여러 개 동시에 초기화
// =======================
function rollingTextInit(selector = '.ticker') {
  document.querySelectorAll(selector).forEach(el => rollingText(el));
}

// =======================
//  실행
// =======================
window.addEventListener('DOMContentLoaded', () => {
  rollingTextInit(); // .ticker 전부 자동 시작
});