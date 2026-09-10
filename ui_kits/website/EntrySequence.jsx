// Native page scrolling drives the curtain; no wheel/touch interception.
function EntrySequence({ onActiveChange }) {
  const [enabled, setEnabled] = React.useState(() =>
    !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const track = React.useRef(null);
  const curtain = React.useRef(null);

  React.useEffect(() => {
    if (!enabled) { onActiveChange(false); return; }
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastActive;
    let lastHeight = track.current?.offsetHeight || 1;
    const update = () => {
      frame = 0;
      if (!track.current || !curtain.current) return;
      const height = track.current.offsetHeight || lastHeight;
      lastHeight = height;
      const progress = Math.max(0, Math.min(1, -track.current.getBoundingClientRect().top / height));
      curtain.current.style.setProperty('--entry-progress', progress);
      curtain.current.style.setProperty('--entry-reveal', Math.max(0, (progress - 0.25) / 0.75));
      const active = progress < 0.999;
      curtain.current.style.visibility = active ? 'visible' : 'hidden';
      if (lastActive !== active) { onActiveChange(active); lastActive = active; }
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const reduceMotion = () => {
      if (!preference.matches) return;
      const offset = lastHeight;
      const position = Math.max(0, window.scrollY - offset);
      setEnabled(false);
      requestAnimationFrame(() => window.scrollTo({ top: position, behavior: 'instant' }));
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    preference.addEventListener('change', reduceMotion);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      preference.removeEventListener('change', reduceMotion);
    };
  }, [enabled, onActiveChange]);

  if (!enabled) return null;
  const skip = () => {
    window.scrollTo({ top: track.current.offsetTop + track.current.offsetHeight, behavior: 'instant' });
    onActiveChange(false);
    requestAnimationFrame(() => document.getElementById('hero')?.focus({ preventScroll: true }));
  };
  return (
    <React.Fragment>
      <div ref={track} className="entry-track" aria-hidden="true" />
      <section ref={curtain} className="entry-curtain" aria-label="Willkommen bei FlexB Solutions">
        <div className="entry-scene" aria-hidden="true" />
        <div className="entry-top"><span>FlexB Solutions</span></div>
        <svg className="entry-circuit" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
          <g className="entry-circuit__base" stroke="currentColor" strokeWidth="1">
            <path d="M0 225H225L340 340H360M0 675H225L340 560H360M1440 225H1215L1100 340H1080M1440 675H1215L1100 560H1080" />
            <path d="M180 0V160L360 340V560L180 740V900M1260 0V160L1080 340V560L1260 740V900" />
          </g>
          <g className="entry-circuit__signal" stroke="#74d69a" strokeWidth="2" pathLength="1">
            <path pathLength="1" d="M0 225H225L340 340H360"/><path pathLength="1" d="M1440 675H1215L1100 560H1080"/>
          </g>
          <g fill="#74d69a"><circle cx="360" cy="340" r="4"/><circle cx="1080" cy="560" r="4"/></g>
        </svg>
        <div className="entry-center">
          <p className="entry-eyebrow">AUTOMATISIERUNG & PROZESSOPTIMIERUNG</p>
          <div className="entry-wordmark" aria-label="FlexB"><span>F</span><span>l</span><span>e</span><span>x</span><span>B</span></div>
          <div className="entry-rule" />
          <p className="entry-signature">SOLUTIONS</p>
        </div>
        <div className="entry-bottom"><button onClick={skip}>Scrollen & entdecken <span className="entry-arrow" aria-hidden="true">↓</span></button></div>
      </section>
    </React.Fragment>
  );
}
Object.assign(window, { EntrySequence });
