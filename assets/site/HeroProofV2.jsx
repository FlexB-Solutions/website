// All three stages follow native scroll position in both directions.
function HeroProofV2() {
  const wrap = React.useRef(null);
  React.useEffect(() => {
    const node = wrap.current;
    const hero = document.getElementById('hero');
    if (!node || !hero) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const path = node.querySelector('.benefit-growth-line');
    const tip = node.querySelector('.benefit-growth-tip');
    const length = path.getTotalLength();
    const inner = hero.querySelector('.hero-inner');
    let frame = 0;
    const clamp = n => Math.max(0, Math.min(1, n));
    const smooth = n => { n = clamp(n); return n*n*(3-2*n); };
    function paint(a,b,c) {
      [a,b,c].forEach((value,i) => {
        node.style.setProperty(`--benefit-${i+1}`,value);
        hero.style.setProperty(`--p${i+1}`,Math.sin(value*Math.PI));
      });
      const point = path.getPointAtLength(length*c);
      tip.setAttribute('cx',point.x);tip.setAttribute('cy',point.y);
      node.dataset.phase = c===1 ? 'complete' : b===1 ? 'growth' : a===1 ? 'quality' : 'time';
    }
    function update() {
      frame = 0;
      const innerHeight = inner.getBoundingClientRect().height;
      const distance = window.innerHeight * .9;
      hero.style.setProperty('--proof-inner-height', `${innerHeight}px`);
      hero.style.setProperty('--proof-scroll-distance', `${distance}px`);
      if (preference.matches) { paint(1, 1, 1); return; }
      // On narrow screens, first scroll the taller text panel into view.
      // Once the illustration is visible, the panel sticks for the three stages.
      const approach = Math.max(0, innerHeight - window.innerHeight);
      const progress = clamp((-hero.getBoundingClientRect().top - approach) / distance);
      paint(smooth(progress / .3), smooth((progress - .34) / .3), smooth((progress - .68) / .32));
    }
    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(inner);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    preference.addEventListener('change', requestUpdate);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      preference.removeEventListener('change', requestUpdate);
      hero.style.removeProperty('--proof-inner-height');
      hero.style.removeProperty('--proof-scroll-distance');
    };
  },[]);
  return (
    <div className="hero-proof hero-proof-v2" ref={wrap}>
      <svg viewBox="0 0 400 490" role="img" aria-label="Illustration: weniger Zeit für Routine, korrigierte Fehler und mehr Raum für Wachstum. Keine gemessenen Kennzahlen.">
        <line x1="0" y1="1" x2="400" y2="1" className="benefit-rule" />
        <text x="0" y="30" className="benefit-number">01</text><text x="35" y="30" className="benefit-title">Mehr Zeit.</text>
        <circle cx="48" cy="91" r="32" className="benefit-clock-base" />
        <circle cx="48" cy="91" r="38" className="benefit-clock-free" pathLength="1" />
        <path d="M48 69V91L62 100" className="benefit-hand" />
        <circle cx="48" cy="91" r="3" fill="var(--brand)" />
        <text x="112" y="72" className="benefit-note">Routine</text>
        <rect x="112" y="86" width="278" height="12" rx="2" fill="var(--brand-tint)" />
        <rect x="112" y="86" width="278" height="12" rx="2" className="benefit-routine" />
        <g className="benefit-freetime"><path d="M210 106V113H390V106" className="benefit-rule"/><text x="255" y="134" className="benefit-note">Freiraum</text></g>
        <line x1="0" y1="160" x2="400" y2="160" className="benefit-rule" />
        <text x="0" y="190" className="benefit-number">02</text><text x="35" y="190" className="benefit-title">Weniger Fehler.</text>
        <path d="M48 246H348" className="benefit-rule" strokeDasharray="3 5" />
        {[24,124,224,324].map((x,i)=>(
          <g key={x}>
            <rect x={x} y="220" width="48" height="57" rx="3" className="benefit-document" />
            <path d={`M${x+11} 234h26M${x+11} 242h17`} className="benefit-rule" />
            {i%2===0 && <path d={`M${x+20} 255l8 8m0-8l-8 8`} className="benefit-error" />}
            <path d={`M${x+17} 259l5 5 11-12`} pathLength="1" className={i%2===0?'benefit-check benefit-check--corrected':'benefit-check'} />
          </g>
        ))}
        <line x1="0" y1="209" x2="0" y2="286" className="benefit-scanner" />
        <text x="0" y="308" className="benefit-note">Prüfen. Korrigieren. Verlässlich weiter.</text>
        <line x1="0" y1="332" x2="400" y2="332" className="benefit-rule" />
        <text x="0" y="363" className="benefit-number">03</text><text x="35" y="363" className="benefit-title">Mehr Wachstum.</text>
        <path d="M8 466H390M8 429H390M8 392H390" className="benefit-grid" />
        <path d="M8 461C88 461 88 451 132 449S204 446 235 427S305 430 335 405S374 395 389 380" className="benefit-growth-track" />
        <path d="M8 461C88 461 88 451 132 449S204 446 235 427S305 430 335 405S374 395 389 380" pathLength="1" className="benefit-growth-line" />
        <circle cx="8" cy="461" r="5" className="benefit-growth-tip" />
      </svg>
    </div>
  );
}
Object.assign(window,{HeroProof:HeroProofV2});
