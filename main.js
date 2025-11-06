
  // Defensive checks
  try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  } catch (e) {
    console.warn('GSAP/ScrollTrigger registration failed:', e);
  }

  // Safe DOM refs
  const typingText = document.getElementById('typingText');
  const startBtn = document.getElementById('startBtn');
  const intro = document.getElementById('intro');
  const foundersIntro = document.getElementById('foundersIntro');
  const main = document.getElementById('main');
  const nav = document.getElementById('nav');
  const chatBtn = document.getElementById('chatBtn');
  const chatBox = document.getElementById('chatBox');
  const enterSound = document.getElementById('enterSound');
  const bgSound = document.getElementById('bgSound');

  // Provide typed effect optional — kept visible by default.
  // If you want the typing effect uncomment below:
  /*
  const fullMsg = "Ready to dive in?";
  typingText.textContent = "";
  let idx = 0;
  (function type(){ if(idx < fullMsg.length){ typingText.textContent += fullMsg[idx++]; setTimeout(type, 75);} })();
  */

  // start flow
  startBtn.addEventListener('click', () => {
    // play enter sound (user gesture) with graceful rejection handling
    if (enterSound) {
      const p = enterSound.play();
      if (p && p.catch) p.catch(err => console.warn('enterSound play failed (likely blocked):', err));
    }

    // After short pause start founders sequence and background loop
    setTimeout(() => {
      if (bgSound) {
        const q = bgSound.play();
        if (q && q.catch) q.catch(err => console.warn('bgSound play failed (likely blocked):', err));
      }
    }, 1200);

    // Hide intro smoothly
    gsap.to(intro, {opacity:0, y:-120, duration:1.0, ease:"power2.inOut", onComplete(){
      intro.style.display = 'none';

      // Start founder cinematic sequence
      foundersIntro.style.pointerEvents = 'auto';
      foundersIntro.style.opacity = 1;
      foundersIntro.setAttribute('aria-hidden','false');

      const vish = document.getElementById('card-vish');
      const adhi = document.getElementById('card-adhi');
      const mahi = document.getElementById('card-mahi');

      // First founder: enter from left -> pause -> exit left
      gsap.fromTo(vish, {x:-420, opacity:0, scale:0.98}, {x:0, opacity:1, scale:1, duration:1.0, ease:'power3.out'});
      gsap.to(vish, {x:-460, opacity:0, delay:1.6, duration:0.9, ease:'power2.in'});

      // Second founder: enter from right -> pause -> exit right
      gsap.fromTo(adhi, {x:420, opacity:0, scale:0.98}, {x:0, opacity:1, scale:1, duration:1.0, delay:1.9, ease:'power3.out'});
      gsap.to(adhi, {x:460, opacity:0, delay:3.2, duration:0.85, ease:'power2.in'});

      // Third founder: enter from bottom center -> pause -> exit bottom -> reveal main
      gsap.fromTo(mahi, {y:300, opacity:0, scale:0.96}, {y:0, opacity:1, scale:1, duration:1.05, delay:3.6, ease:'power3.out'});
      gsap.to(mahi, {y:320, opacity:0, delay:5.1, duration:0.9, ease:'power2.in', onComplete: finishFounders});
    }});
  });

  function finishFounders(){
    try {
      foundersIntro.style.display = 'none';
      foundersIntro.style.pointerEvents = 'none';
      main.style.visibility = 'visible';

      // reveal main
      gsap.fromTo(main, {opacity:0, y:20}, {opacity:1, y:0, duration:1.1, ease:'power3.out', onComplete: initScrollAnims});
    } catch(err) {
      console.error('finishFounders failed:', err);
    }
  }

  function initScrollAnims(){
    try{
      const sections = document.querySelectorAll('section');
      sections.forEach((sec) => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.fromTo(sec, {opacity:0, y:30}, {
            opacity:1, y:0, duration:1.0, ease:'power3.out',
            scrollTrigger: { trigger: sec, start: "top 82%", toggleActions: "play none none none" }
          });
        } else {
          // fallback if ScrollTrigger not available
          sec.style.opacity = 1; sec.style.transform = 'translateY(0)';
        }
      });
    } catch(e) {
      console.error('initScrollAnims error:', e);
    }
  }

  // nav scroll
  try {
    nav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = document.getElementById(item.dataset.target);
        if (!target) {
          console.warn('Nav target missing:', item.dataset.target);
          return;
        }
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      });
    });
  } catch(e){ console.warn('nav init failed', e); }

  // chat
  chatBtn.addEventListener('click', () => {
    try {
      if (chatBox.style.display === 'block') {
        chatBox.style.display = 'none';
        chatBox.setAttribute('aria-hidden','true');
      } else {
        chatBox.style.display = 'block';
        chatBox.setAttribute('aria-hidden','false');
      }
    } catch(e){ console.warn('chat toggle failed', e); }
  });

  function reply(btn){
    const ans = btn.nextElementSibling;
    const q = (btn && btn.textContent) ? btn.textContent.trim() : '';
    let text = '';
    if (q === 'What is this project?') text = 'A student-built fuel-based rocket prototype with AI-assisted landing.';
    else if (q === 'Who built this?') text = 'Developed by students (Vishwajeeth V, Adikeshav S, Mahilesh) with support from SNP school.';
    else if (q === 'Future goals?') text = 'Refine propulsion, improve safety, enter competitions and scale research collaboration.';
    ans.textContent = text;
    ans.style.opacity = 1;
  }
  window.reply = reply;

  // helpful console hook
  window.addEventListener('error', (ev) => { console.error('JS Error:', ev.error || ev.message); });

  // Accessibility: allow Enter key to trigger start
  startBtn.addEventListener('keyup', (e)=>{ if(e.key === 'Enter') startBtn.click(); });

