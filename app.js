/* Arc Focus Carousel — food offers.
   Edit OFFERS below. To use real photos, drop files into /images and set `img`
   (e.g. images/offer-1.jpg). Until a photo loads, a colour + emoji placeholder shows. */
(() => {
  const OFFERS = [
    {title:'Double Cheese Burger Combo', tag:'Combo Deal',  badge:'30% OFF',      desc:'Two juicy patties, melted cheddar, crispy fries and a chilled drink.',        price:'₹299', old:'₹429', emoji:'🍔', hue:28,  img:'images/offer-1.jpg', link:'#order'},
    {title:'Wood-Fired Margherita',     tag:'Pizza Night', badge:'BUY 1 GET 1',  desc:'Hand-stretched crust, San Marzano tomato, fresh basil and creamy mozzarella.', price:'₹349', old:'₹698', emoji:'🍕', hue:8,   img:'images/offer-2.jpg', link:'#order'},
    {title:'Creamy Alfredo Pasta',      tag:'Chef Special',badge:'20% OFF',      desc:'Silky parmesan cream sauce tossed with al dente penne and garlic butter.',    price:'₹249', old:'₹310', emoji:'🍝', hue:42,  img:'images/offer-3.jpg', link:'#order'},
    {title:'Sizzling Paneer Tikka',     tag:'From the Tandoor', badge:'FLAT ₹100 OFF', desc:'Smoky charred paneer, peppers and onions with mint chutney.',           price:'₹279', old:'₹379', emoji:'🍢', hue:20,  img:'images/offer-4.jpg', link:'#order'},
    {title:'Fresh Sushi Platter',       tag:'Weekend Treat', badge:'25% OFF',    desc:'Twelve hand-rolled pieces with soy, wasabi and pickled ginger.',              price:'₹599', old:'₹799', emoji:'🍣', hue:350, img:'images/offer-5.jpg', link:'#order'},
    {title:'Loaded Tacos Trio',         tag:'Street Food', badge:'COMBO ₹199',   desc:'Three crunchy shells packed with spiced filling, salsa and lime crema.',      price:'₹199', old:'₹279', emoji:'🌮', hue:48,  img:'images/offer-6.jpg', link:'#order'},
    {title:'Chocolate Lava Cake',       tag:'Sweet Finish', badge:'FREE WITH MAIN', desc:'Warm molten centre, dark chocolate and a scoop of vanilla ice cream.',     price:'₹149', old:'₹199', emoji:'🍰', hue:16,  img:'images/offer-7.jpg', link:'#order'}
  ];

  const $ = id => document.getElementById(id);
  const page = $('page'), video = $('camera'), status = $('camera-status'), message = $('camera-message'), messageText = $('camera-message-text'), switchBtn = $('switch-camera'), canvas = $('fx-canvas'), ctx = canvas.getContext('2d'), stage = $('stage'), track = $('track'), dotsEl = $('dots');
  const n = OFFERS.length;
  const mod = (a, b) => ((a % b) + b) % b;
  const wrapOff = d => mod(d + n / 2, n) - n / 2;      // shortest signed distance on the loop
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('total').textContent = String(n).padStart(2, '0');

  /* ---- build cards & dots ---- */
  const cards = OFFERS.map((o, i) => {
    const el = document.createElement('article');
    el.className = 'offer';
    el.dataset.i = i;
    el.style.setProperty('--h', o.hue);
    el.setAttribute('aria-label', `${o.title}, ${o.badge}`);
    el.innerHTML = `
      <div class="photo"><span class="emoji" aria-hidden="true">${o.emoji}</span><img src="${o.img}" alt="${o.title}" draggable="false"></div>
      <div class="shade"></div><div class="dim"></div>
      <span class="badge">${o.badge}</span>
      <span class="num">${String(i + 1).padStart(2, '0')}</span>
      <div class="info">
        <h2>${o.title}</h2>
        <p class="tag">${o.tag}</p>
        <div class="more">
          <p class="desc">${o.desc}</p>
          <div class="row">
            <span class="price"><b>${o.price}</b><s>${o.old}</s></span>
            <a class="cta" href="${o.link}" tabindex="-1">ORDER NOW <span>→</span></a>
          </div>
        </div>
      </div>`;
    const img = el.querySelector('img');
    img.addEventListener('load', () => el.classList.add('has-img'));
    img.addEventListener('error', () => img.remove());
    track.appendChild(el);
    return el;
  });
  const dots = OFFERS.map((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot'; b.setAttribute('aria-label', `Show offer ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(b); return b;
  });

  /* ---- state ---- */
  let pos = 0, target = 0, vel = 0, activeIdx = -1, running = false, dragging = false, last = 0;
  let cw = 260, spacing = 200;

  function measure() {
    const r = stage.getBoundingClientRect();
    cw = Math.max(180, Math.min(360, r.width * 0.68, r.height / 1.5));
    spacing = cw * 0.78;
    stage.style.setProperty('--cw', cw + 'px');
  }

  /* ---- arc layout ---- */
  function render() {
    for (let i = 0; i < n; i++) {
      const el = cards[i], off = wrapOff(i - pos), a = Math.abs(off);
      const x = off * spacing;
      const y = off * off * cw * 0.1 - Math.max(0, 1 - a) * cw * 0.04;   // arc drop + lift for focus
      const rot = off * 8;
      const s = 1 - 0.1 * Math.min(a, 2);
      const o = Math.max(0, 1 - 0.3 * a);
      el.style.transform = `translate3d(-50%,-50%,0) translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${s})`;
      el.style.opacity = o;
      el.style.visibility = a > 3.4 ? 'hidden' : 'visible';
      el.style.zIndex = Math.round(100 - a * 10);
      el.style.setProperty('--dim', Math.min(a, 1) * 0.5);
      el.style.setProperty('--f', Math.max(0, 1 - a * 1.5).toFixed(3));
    }
  }

  function setActive(idx) {
    activeIdx = idx;
    cards.forEach((c, i) => {
      c.classList.toggle('is-active', i === idx);
      c.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      c.querySelector('.cta').tabIndex = i === idx ? 0 : -1;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    $('cur').textContent = String(idx + 1).padStart(2, '0');
    page.style.setProperty('--glow', `hsl(${OFFERS[idx].hue} 85% 55%)`);
    runScan();
  }

  /* ---- spring animation ---- */
  const K = 170, C = 22;                                   // stiffness / damping (slight overshoot)
  function tick(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    if (reduce) { pos = target; vel = 0; }
    else if (!dragging) {
      vel += (-K * (pos - target) - C * vel) * dt;
      pos += vel * dt;
      if (Math.abs(pos - target) < 0.0005 && Math.abs(vel) < 0.001) { pos = target; vel = 0; }
    }
    render();
    if (!dragging && (pos !== target || vel !== 0)) requestAnimationFrame(tick); else running = false;
  }
  function kick() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }
  function setTarget(t) {
    target = t;
    const idx = mod(Math.round(t), n);
    if (idx !== activeIdx) setActive(idx);
    kick();
  }
  const step = d => setTarget(Math.round(target) + d);
  const goTo = i => setTarget(Math.round(target) + wrapOff(i - Math.round(target)));

  /* ---- interactions: arrows, keys, wheel ---- */
  $('prev').addEventListener('click', () => step(-1));
  $('next').addEventListener('click', () => step(1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
  });
  let acc = 0, lastWheel = 0, accTimer = 0;
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    clearTimeout(accTimer); accTimer = setTimeout(() => acc = 0, 160);
    const now = performance.now();
    if (Math.abs(acc) > 50 && now - lastWheel > 320) { step(acc > 0 ? 1 : -1); acc = 0; lastWheel = now; }
  }, { passive: false });

  /* ---- drag / swipe ---- */
  let down = null, samples = [], suppress = false;
  stage.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    down = { x: e.clientX, startPos: pos, moved: false };
    samples = [{ t: performance.now(), p: pos }];
  });
  stage.addEventListener('pointermove', e => {
    if (!down) return;
    if (!down.moved && Math.abs(e.clientX - down.x) > 6) {
      down.moved = true; dragging = true; down.x = e.clientX; down.startPos = pos;
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      stage.classList.add('dragging');
    }
    if (down.moved) {
      pos = down.startPos - (e.clientX - down.x) / spacing;
      const now = performance.now();
      samples.push({ t: now, p: pos });
      while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
      render();
    }
  });
  const release = () => {
    if (!down) return;
    if (down.moved) {
      dragging = false; stage.classList.remove('dragging');
      const now = performance.now(), s0 = samples[0];
      let v = s0 && now - s0.t > 0 ? (pos - s0.p) / ((now - s0.t) / 1000) : 0;
      v = Math.max(-8, Math.min(8, v));
      setTarget(Math.round(pos + v * 0.2));
      suppress = true; setTimeout(() => suppress = false, 60);
    }
    down = null;
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  /* tap a side card to bring it into focus */
  stage.addEventListener('click', e => {
    if (suppress) { e.preventDefault(); e.stopPropagation(); return; }
    const card = e.target.closest('.offer');
    if (!card) return;
    const i = +card.dataset.i;
    if (i !== activeIdx) { e.preventDefault(); goTo(i); }
  });


  /* ---- scan beam on each change ---- */
  function runScan() {
    if (reduce) return;
    page.classList.remove('scan-active'); void page.offsetWidth; page.classList.add('scan-active');
    setTimeout(() => page.classList.remove('scan-active'), 1800);
  }

  /* ---- live camera background ---- */
  let stream = null, front = false;
  async function startCamera() {
    message.hidden = true;
    if (!window.isSecureContext) { status.textContent = 'HTTPS REQUIRED'; messageText.textContent = 'Live camera access requires HTTPS (or localhost). The offers still work without it.'; message.hidden = false; return; }
    if (!navigator.mediaDevices?.getUserMedia) { status.textContent = 'CAMERA UNSUPPORTED'; messageText.textContent = 'This browser does not provide camera access. Try an updated mobile browser.'; message.hidden = false; return; }
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      status.textContent = 'REQUESTING CAMERA';
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: front ? 'user' : { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1920 } } });
      video.srcObject = stream; await video.play();
      status.textContent = 'LIVE CAMERA'; switchBtn.hidden = false; message.hidden = true;
    } catch (e) {
      console.warn(e); status.textContent = 'CAMERA PERMISSION NEEDED';
      messageText.textContent = e?.name === 'NotAllowedError' ? 'Allow camera access in browser/site settings, then tap Retry camera.' : 'Could not start camera. Open the page over HTTPS on a supported mobile browser and retry.';
      message.hidden = false;
    }
  }
  $('retry-camera').addEventListener('click', startCamera);
  switchBtn.addEventListener('click', async () => { front = !front; await startCamera(); });

  /* ---- floating particles ---- */
  let particles = [], raf = 0, lastW = 0, lastH = 0;
  function resizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 1.7), w = innerWidth, h = innerHeight;
    if (w === lastW && h === lastH) return; lastW = w; lastH = h;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = reduce ? 10 : Math.min(38, Math.max(16, Math.round(w * h / 26000)));
    particles = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, r: .5 + Math.random() * 1.3, vx: (Math.random() - .5) * .18, vy: -.08 - Math.random() * .22, a: .12 + Math.random() * .42, ph: Math.random() * Math.PI * 2 }));
  }
  function drawParticles(t) {
    resizeCanvas(); const w = innerWidth, h = innerHeight; ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx + Math.sin(t * .00035 + p.ph) * .035; p.y += p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; } if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
      const sh = .7 + .3 * Math.sin(t * .001 + p.ph);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,215,170,${p.a * sh})`; ctx.fill();
    }
    if (!document.hidden) raf = requestAnimationFrame(drawParticles);
  }
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(drawParticles); });
  addEventListener('resize', resizeCanvas, { passive: true });
  addEventListener('pagehide', () => { stream?.getTracks().forEach(t => t.stop()); cancelAnimationFrame(raf); });

  window.addEventListener('resize', () => { measure(); render(); });
  measure(); setActive(0); render(); resizeCanvas(); raf = requestAnimationFrame(drawParticles); startCamera();
})();
