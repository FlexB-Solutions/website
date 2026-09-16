// HeroProof.jsx, "Mehr Zeit, weniger Fehler, mehr Wachstum" als Grafik im Hero.
// Der Aufbau folgt dem Scroll-Fortschritt: der Hero klebt eine Bildschirmhoehe lang,
// waehrenddessen bauen sich die drei Stufen nacheinander auf.
//
// WICHTIG: Die Y-Positionen der drei Zeilen stehen direkt in den Koordinaten,
// NICHT als transform-Attribut. Das CSS setzt auf den Gruppen ein transform fuer
// den Einblend-Versatz, und CSS-Transform ueberschreibt das Praesentationsattribut.
// beides zusammen hat die Zeilen vorher aufeinander geschoben.

const FEHLER_INDEX = [2, 5, 9, 12];
const PUNKTE = 14;

function HeroProof() {
  const wrap = React.useRef(null);

  React.useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Die Variablen sitzen auf dem Hero, damit auch der Text links sie lesen kann.
    const setzen = (s1, s2, s3) => {
      hero.style.setProperty('--s1', s1);
      hero.style.setProperty('--s2', s2);
      hero.style.setProperty('--s3', s3);
      hero.style.setProperty('--dash', 1 - s3);
      // Puls: steigt auf 1 und faellt zurueck, dafuer wird der Text kurz dick und dunkelgruen
      // steigt schnell an und klingt langsamer ab -> setzt zeitgleich mit der Stufe ein
      const puls = (s) => (s <= 0 || s >= 1 ? 0 : s < 0.3 ? s / 0.3 : (1 - s) / 0.7);
      hero.style.setProperty('--p1', puls(s1));
      hero.style.setProperty('--p2', puls(s2));
      hero.style.setProperty('--p3', puls(s3));
    };

    if (reduce.matches) { setzen(1, 1, 1); return undefined; }

    let frame = 0;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const stufe = (p, start, laenge) => clamp((p - start) / laenge);

    const update = () => {
      frame = 0;
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      // Laeuft waehrend der Anfahrt, nicht danach: startet schon bevor der Hero
      // oben andockt (der Vorhang gibt ihn ja von unten her frei) und ist durch,
      // sobald die Schrift vollstaendig steht.
      const vorlauf = vh * 0.32;
      const weg = vh * 0.36;
      const p = clamp((vorlauf - r.top) / weg);
      setzen(stufe(p, 0.00, 0.32), stufe(p, 0.28, 0.32), stufe(p, 0.56, 0.34));
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  return (
    <div className="hero-proof" ref={wrap} aria-hidden="true">
      <svg viewBox="0 0 380 440" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* -------- Mehr Zeit: derselbe Vorgang, kuerzere Dauer -------- */}
        <g className="proof-row proof-row--1">
          <text className="proof-label" x="0" y="12">MEHR ZEIT</text>
          <text className="proof-note" x="0" y="46">vorher</text>
          <rect className="proof-bar-before" x="70" y="34" width="300" height="12" rx="6" />
          <text className="proof-note" x="0" y="78">nachher</text>
          <rect className="proof-bar-after" x="70" y="66" width="300" height="12" rx="6" />
        </g>

        {/* -------- Weniger Fehler: markierte Durchlaeufe fallen weg -------- */}
        <g className="proof-row proof-row--2">
          <text className="proof-label" x="0" y="162">WENIGER FEHLER</text>
          {Array.from({ length: PUNKTE }).map((_, i) => (
            <circle
              key={i}
              className={FEHLER_INDEX.includes(i) ? 'proof-dot proof-dot--fehler' : 'proof-dot'}
              cx={9 + i * 27}
              cy="202"
              r="9"
            />
          ))}
        </g>

        {/* -------- Mehr Wachstum: Linie zeichnet sich -------- */}
        <g className="proof-row proof-row--3">
          <text className="proof-label" x="0" y="286">MEHR WACHSTUM</text>
          <line className="proof-axis" x1="0" y1="424" x2="370" y2="424" />
          <path className="proof-area" d="M4 424 L4 400 L78 392 L152 376 L226 350 L300 320 L366 306 L366 424 Z" />
          <path className="proof-line" d="M4 400 L78 392 L152 376 L226 350 L300 320 L366 306" pathLength="1" />
          <circle className="proof-tip" cx="366" cy="306" r="6" />
        </g>
      </svg>
    </div>
  );
}
Object.assign(window, { HeroProof });
