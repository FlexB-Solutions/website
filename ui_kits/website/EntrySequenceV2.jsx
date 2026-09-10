// Native page scrolling drives the curtain; no wheel/touch interception.
function EntrySequenceV2({ onActiveChange }) {
  const [enabled, setEnabled] = React.useState(() =>
    !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const track = React.useRef(null);
  const curtain = React.useRef(null);
  const canvas = React.useRef(null);
  const laser = React.useRef(null);

  React.useEffect(() => {
    if (!enabled || !canvas.current) return;
    laser.current = window.createFlexBLaser(canvas.current);
    return () => { laser.current?.destroy(); laser.current = null; };
  }, [enabled]);

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
      laser.current?.setScrollProgress?.(progress);
      curtain.current.style.setProperty('--entry-reveal', Math.max(0, (progress - 0.25) / 0.75));
      const active = progress < 0.999;
      curtain.current.style.visibility = active ? 'visible' : 'hidden';
      if (lastActive !== active) { onActiveChange(active); laser.current?.setActive(active); lastActive = active; }
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
      <section ref={curtain} className="entry-curtain entry-laser" aria-label="Willkommen bei FlexB Solutions">
        <div className="entry-scene" aria-hidden="true" />
        <div className="entry-top"><span>FlexB Solutions</span></div>
        <canvas ref={canvas} className="entry-laser__canvas" role="img" aria-label="FlexB – einzelne Buchstaben fliegen im grünen Laserlicht ein, das B landet von oben" />
        <p className="entry-laser__caption">AUTOMATISIERUNG & PROZESSOPTIMIERUNG</p>
        <div className="entry-laser__signature">SOLUTIONS</div>
        <div className="entry-bottom"><button onClick={skip}>Scrollen & entdecken <span className="entry-arrow" aria-hidden="true">↓</span></button></div>
      </section>
    </React.Fragment>
  );
}
Object.assign(window, { EntrySequence: EntrySequenceV2 });
