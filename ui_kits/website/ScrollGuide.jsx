// ScrollGuide.jsx – ruhige Blickführung über die Seite
const guideStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 68,
    overflow: 'hidden',
  },
  svg: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
};

function getRect(element) {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}

function getCenter(rect) {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function buildGuideLine(target, fromX = 62) {
  const start = { x: fromX, y: clamp(target.y - 120, 92, window.innerHeight - 92) };
  const end = target;
  const midY = start.y + (end.y - start.y) * 0.52;
  return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x - 90} ${midY}, ${end.x} ${end.y}`;
}

function buildSplitLine(origin, leftTarget, rightTarget) {
  return [
    `M ${origin.x} ${origin.y} C ${origin.x} ${origin.y + 42}, ${leftTarget.x} ${leftTarget.y - 42}, ${leftTarget.x} ${leftTarget.y}`,
    `M ${origin.x} ${origin.y} C ${origin.x} ${origin.y + 42}, ${rightTarget.x} ${rightTarget.y - 42}, ${rightTarget.x} ${rightTarget.y}`,
  ].join(' ');
}

function ScrollGuide() {
  const [state, setState] = React.useState({
    glow: null,
    linePath: '',
    splitPath: '',
    railY: null,
  });

  React.useEffect(() => {
    let frame = 0;

    const read = () => {
      const hero = document.getElementById('hero');
      const services = Array.from(document.querySelectorAll('[data-guide-service]'));
      const forWhom = document.getElementById('furwen');
      const audienceCards = [
        document.querySelector('[data-guide-target="audience-b2b"]'),
        document.querySelector('[data-guide-target="audience-private"]'),
        document.querySelector('[data-guide-target="audience-industry"]'),
      ].filter(Boolean);
      const results = document.getElementById('ergebnisse');
      const companyMap = document.querySelector('.company-map');
      const aboutPhoto = document.querySelector('[data-guide-target="about-photo"]');
      const aboutCopy = document.querySelector('[data-guide-target="about-copy"]');
      const contactInfo = document.querySelector('[data-guide-target="contact-info"]');
      const contactForm = document.querySelector('[data-guide-target="contact-form"]');

      const viewportCenter = window.innerHeight * 0.52;
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;

      let glow = null;
      let linePath = '';
      let splitPath = '';
      let railY = null;

      if (heroBottom < window.innerHeight * 0.62) {
        const visibleServices = services
          .map((element) => ({ element, rect: element.getBoundingClientRect() }))
          .filter(({ rect }) => rect.bottom > 90 && rect.top < window.innerHeight - 70);

        const activeService = visibleServices
          .map(({ element, rect }) => ({
            element,
            rect,
            distance: Math.abs((rect.top + rect.height / 2) - viewportCenter),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        if (activeService) {
          const rect = getRect(activeService.element);
          const target = getCenter(rect);
          glow = {
            x: target.x,
            y: target.y,
            rx: Math.min(rect.width * 0.52, 420),
            ry: Math.min(rect.height * 0.64, 210),
            opacity: 0.19,
          };
          linePath = buildGuideLine({ x: rect.x + 28, y: target.y });
          railY = target.y;
        }
      }

      const forWhomRect = forWhom ? forWhom.getBoundingClientRect() : null;
      const resultsRect = results ? results.getBoundingClientRect() : null;
      if (
        forWhomRect &&
        resultsRect &&
        forWhomRect.top < window.innerHeight * 0.34 &&
        resultsRect.top > window.innerHeight * 0.76 &&
        audienceCards.length === 3
      ) {
        const cardRects = audienceCards.map((card) => getRect(card)).filter(Boolean);
        const startCenter = getCenter(cardRects[0]);
        const endCenter = getCenter(cardRects[cardRects.length - 1]);
        const sectionProgress = clamp((window.innerHeight * 0.45 - forWhomRect.top) / Math.max(1, forWhomRect.height * 0.7), 0, 1);
        const activeCenter = lerpPoint(startCenter, endCenter, sectionProgress);
        const activeIndex = clamp(Math.round(sectionProgress * (cardRects.length - 1)), 0, cardRects.length - 1);
        const activeRect = cardRects[activeIndex];
        glow = {
          x: activeCenter.x,
          y: activeRect.y + activeRect.height / 2,
          rx: Math.min(activeRect.width * 0.54, 250),
          ry: Math.min(activeRect.height * 0.62, 170),
          opacity: 0.16,
        };
        linePath = buildGuideLine({ x: activeCenter.x, y: activeCenter.y });
        railY = activeCenter.y;
      }

      const companyRect = getRect(companyMap);
      if (companyRect) {
        const companyCenterY = companyRect.y + companyRect.height / 2;
        if (companyCenterY > window.innerHeight * 0.2 && companyCenterY < window.innerHeight * 0.8) {
          const companyCenter = getCenter(companyRect);
          glow = {
            x: companyCenter.x,
            y: companyCenter.y,
            rx: Math.min(companyRect.width * 0.52, 520),
            ry: Math.min(companyRect.height * 0.56, 260),
            opacity: 0.14,
          };
          linePath = buildGuideLine({ x: companyRect.x + 22, y: companyCenter.y });
          railY = companyCenter.y;
        }
      }

      const aboutPhotoRect = getRect(aboutPhoto);
      const aboutCopyRect = getRect(aboutCopy);
      const contactInfoRect = getRect(contactInfo);
      const contactFormRect = getRect(contactForm);
      if (aboutPhotoRect && aboutCopyRect && contactInfoRect && contactFormRect) {
        const aboutBottom = Math.max(aboutPhotoRect.y + aboutPhotoRect.height, aboutCopyRect.y + aboutCopyRect.height);
        if (aboutBottom < window.innerHeight * 0.82 && contactInfoRect.y < window.innerHeight) {
          const origin = { x: window.innerWidth / 2, y: aboutBottom + 16 };
          const leftTarget = { x: contactInfoRect.x + contactInfoRect.width / 2, y: contactInfoRect.y + 14 };
          const rightTarget = { x: contactFormRect.x + contactFormRect.width / 2, y: contactFormRect.y + 14 };
          splitPath = buildSplitLine(origin, leftTarget, rightTarget);
          glow = {
            x: origin.x,
            y: origin.y + 20,
            rx: 120,
            ry: 42,
            opacity: 0.12,
          };
          railY = origin.y;
        }
      }

      setState({ glow, linePath, splitPath, railY });
      frame = 0;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div style={guideStyles.overlay} aria-hidden="true">
      <svg style={guideStyles.svg} viewBox={`0 0 ${window.innerWidth || 1440} ${window.innerHeight || 900}`} preserveAspectRatio="none">
        <defs>
          <filter id="guideGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="guideSpot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(24,115,68,0.22)" />
            <stop offset="55%" stopColor="rgba(24,115,68,0.10)" />
            <stop offset="100%" stopColor="rgba(24,115,68,0)" />
          </radialGradient>
        </defs>

        {state.glow && (
          <ellipse
            cx={state.glow.x}
            cy={state.glow.y}
            rx={state.glow.rx}
            ry={state.glow.ry}
            fill="url(#guideSpot)"
            opacity={state.glow.opacity}
          />
        )}

        {state.railY !== null && (
          <>
            <line x1="42" y1="88" x2="42" y2={state.railY} stroke="rgba(24,115,68,0.34)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="42" cy={state.railY} r="7" fill="rgba(24,115,68,0.94)" filter="url(#guideGlow)">
              <animate attributeName="r" values="6;8;6" dur="2.2s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {state.linePath && (
          <path
            d={state.linePath}
            fill="none"
            stroke="rgba(24,115,68,0.82)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 14"
            filter="url(#guideGlow)"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="2.4s" repeatCount="indefinite" />
          </path>
        )}

        {state.splitPath && (
          <path
            d={state.splitPath}
            fill="none"
            stroke="rgba(24,115,68,0.74)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 12"
            filter="url(#guideGlow)"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-42" dur="2.3s" repeatCount="indefinite" />
          </path>
        )}
      </svg>
    </div>
  );
}

Object.assign(window, { ScrollGuide });
