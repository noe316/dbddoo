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

  function fillTrack() {
    track.innerHTML = '';

    // 1) 기본 세트 한 번 채우고 폭 측정
    baseItems.forEach(n => track.appendChild(n.cloneNode(true)));

    // 컨테이너 폭은 "부모 레이아웃 기준"으로 한 번만 사용
    const containerW = el.clientWidth || window.innerWidth;
    const baseWidth = track.scrollWidth;

    // baseWidth가 0이면(숨겨진 상태 등) 최소 1세트만 유지
    if (baseWidth === 0) return;

    // 2) "컨테이너의 2배" 이상이 되도록 필요한 횟수만큼 반복
    const targetWidth = containerW * 2;
    const repeat = Math.max(1, Math.ceil(targetWidth / baseWidth));

    for (let i = 1; i < repeat; i++) {
      baseItems.forEach(n => track.appendChild(n.cloneNode(true)));
    }
  }

  // 나머지 loop / pause / resume / rebuild 동일, fillTrack만 교체
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

  window.addEventListener('resize', onResize);
  mql.addEventListener?.('change', onPRM);

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