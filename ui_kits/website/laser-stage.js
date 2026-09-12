/* Variant 2 only. Canvas light compositing and individually arriving whole letters.
   No external renderer, image generation, scroll interception or main-site changes. */
(() => {
  window.createFlexBLaser = function createFlexBLaser(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return { destroy() {}, setActive() {} };
    const clamp = x => Math.max(0, Math.min(1, x));
    const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
    const random = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
    let width = 0, height = 0, ratio = 1, frame = 0, destroyed = false, active = true;
    let elapsed = 0, previous = 0, ready = false, geometry;
    let scrollTint = 0, entryReveal = 0;
    const bColor = () => {
      const from=[116,214,154], to=[24,115,68];
      return `rgb(${from.map((v,i)=>Math.round(v+(to[i]-v)*scrollTint)).join(",")})`;
    };
    const duration = 9;
    const playbackRate = 2;

    function makeLogo(size) {
      const measure = document.createElement('canvas').getContext('2d');
      measure.font = `600 ${size}px Outfit`;
      let offset = 0;
      const letters = [...'FlexB'].map((letter, i) => {
        const advance = measure.measureText(letter).width;
        const buffer = document.createElement('canvas');
        const w = advance + size * .08, h = size * 1.25;
        buffer.width = Math.ceil(w * ratio); buffer.height = Math.ceil(h * ratio);
        const c = buffer.getContext('2d');c.scale(ratio, ratio);
        c.font = `600 ${size}px Outfit`;c.textBaseline = 'alphabetic';
        // Unbroken, clean faces: no textures, bevel strokes or metallic patterns.
        c.fillStyle = i === 4 ? bColor() : '#f4f3eb';
        c.fillText(letter, size * .025, size);
        const item = {buffer, width:w, height:h, x:offset, id:i};
        offset += advance - size * .043;
        return item;
      });
      return {letters, width:offset + size * .08, height:size * 1.25};
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      const size = Math.min(width * .27, height * .39, 310);
      const logo = makeLogo(size);
      const x = (width - logo.width) / 2, y = height * .47 - size * .62;
      const left=Math.max(width*.13,x-size*.2),right=Math.min(width*.87,x+logo.width+size*.2);
      const top=y+size*.24,bottom=y+size*1.03;
      const routes=[
        [[-20,height*.24],[width*.10,height*.24],[left-size*.12,top],[left,top]],
        [[width+20,height*.76],[width*.90,height*.76],[right+size*.12,bottom],[right,bottom]],
        [[width+20,height*.22],[width*.91,height*.22],[right+size*.12,top],[right,top]],
        [[-20,height*.78],[width*.09,height*.78],[left-size*.12,bottom],[left,bottom]],
      ];
      geometry={logo,x,y,size,routes};
      render(elapsed);
    }
    function glow(x,y,radius,alpha) {
      const g=ctx.createRadialGradient(x,y,0,x,y,radius);
      g.addColorStop(0,`rgba(192,255,218,${alpha})`);
      g.addColorStop(.09,`rgba(111,255,166,${alpha*.85})`);
      g.addColorStop(.34,`rgba(45,202,113,${alpha*.23})`);
      g.addColorStop(1,'rgba(24,115,68,0)');
      ctx.fillStyle=g;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
    }
    function partial(points, progress) {
      const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
      let remaining=lengths.reduce((a,b)=>a+b,0)*clamp(progress);
      ctx.beginPath();ctx.moveTo(...points[0]);
      let end=points[0];
      for(let i=0;i<lengths.length;i++) {
        const f=Math.min(1,remaining/lengths[i]);
        end=[points[i][0]+(points[i+1][0]-points[i][0])*f,points[i][1]+(points[i+1][1]-points[i][1])*f];
        ctx.lineTo(...end);remaining-=lengths[i];if(remaining<=0)break;
      }
      return end;
    }
    function render(t) {
      if(!geometry || !width) return;
      const {logo,x,y,size,routes}=geometry;
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
      const charge=smooth(t/2.2),settled=smooth((t-6)/2);
      // A broad, low energy spill gives the beams a volume to illuminate.
      ctx.globalCompositeOperation='screen';
      glow(width*.5,height*.50,width*.42,charge*.10);
      glow(width*.5,height*.74,width*.31,settled*.065);
      // Restrained atmospheric dust, no flashing or random frame-to-frame flicker.
      for(let i=0;i<36;i++) {
        const px=random(i+80)*width,py=(random(i+160)*height+t*(1+random(i+20)*2))%height;
        ctx.fillStyle=`rgba(162,224,185,${.025+random(i+31)*.10*charge})`;
        ctx.beginPath();ctx.arc(px,py,.4+random(i+91)*.65,0,Math.PI*2);ctx.fill();
      }
      routes.forEach((route,i)=>{
        const progress=smooth((t-.35-i*.32)/2.5);
        const energy=(.72+.28*(1-settled))*smooth((t-i*.32)/.8);
        ctx.lineCap='round';ctx.lineJoin='round';
        // Soft scattering, green halo, then a hairline near-white laser core.
        [[20, .018,'59,222,125'],[8,.09,'71,240,140'],[3,.38,'98,255,164'],[.8,.94,'211,255,228']].forEach(([w,a,color])=>{
          ctx.lineWidth=w;ctx.strokeStyle=`rgba(${color},${a*energy})`;partial(route,progress);ctx.stroke();
        });
        const tip=partial(route,progress);
        if(progress>0)glow(tip[0],tip[1],size*.26,energy*.85);
        if(progress>.99){
          const end=route[route.length-1];
          ctx.strokeStyle=`rgba(152,233,181,${.3*charge})`;ctx.lineWidth=.7;
          ctx.beginPath();ctx.arc(...end,5,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle='#d7ffe6';ctx.beginPath();ctx.arc(...end,1.4,0,Math.PI*2);ctx.fill();
        }
      });
      ctx.globalCompositeOperation='source-over';
      // The white page reveals from the bottom. As soon as it reaches the
      // wordmark's lower edge, move only the letters up with that edge.
      const logoBottom = y + size * 1.03;
      const logoLift = Math.min(0, height * (1 - entryReveal) - logoBottom);
      logo.letters.forEach(letter => {
        const isB = letter.id === 4;
        const delay = isB ? 4.9 : .8 + letter.id * .64;
        const p = clamp((t - delay) / (isB ? 2.25 : 2.6));
        if (!p) return;
        const travel = Math.pow(1 - p, 3);
        const side = letter.id % 2 === 0 ? -1 : 1;
        const dx = isB ? 0 : side * width * .8 * travel;
        // The B arrives later, vertically, with one gentle landing and no fragmentation.
        const dy = isB ? -height * .95 * travel - Math.sin(p * Math.PI * 2) * size * .10 * Math.sin(p * Math.PI) : (letter.id % 2 ? 1 : -1) * size * .30 * travel;
        ctx.save();
        ctx.globalAlpha = smooth(p / .2);
        ctx.translate(x + letter.x + dx, y + dy + logoLift);
        ctx.rotate(isB ? 0 : side * .10 * travel);
        ctx.drawImage(letter.buffer, 0, 0, letter.width, letter.height);
        ctx.restore();
      });
      canvas.dataset.phase = t < .8 ? 'charging' : t < 4.9 ? 'letters' : t < 7.15 ? 'b-landing' : 'complete';
    }

    function tick(now) {
      frame=0;
      if(destroyed || !active || document.hidden || !ready)return;
      if(previous)elapsed=Math.min(duration,elapsed+(now-previous)/1000*playbackRate);
      previous=now;render(elapsed);
      if(elapsed<duration)frame=requestAnimationFrame(tick);
    }
    function wake() { previous=0;if(!frame&&ready&&active&&!document.hidden&&elapsed<duration)frame=requestAnimationFrame(tick); }
    function visibility() { if(document.hidden){cancelAnimationFrame(frame);frame=0;previous=0;}else wake(); }
    const observer=new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener('visibilitychange',visibility);
    document.fonts.load('600 160px Outfit').then(()=>{
      if(destroyed)return;ready=true;resize();wake();
    }).catch(()=>{if(!destroyed){ready=true;resize();wake();}});
    return {
      setScrollProgress(progress) {
        const nextTint = clamp(progress * 3);
        const nextReveal = clamp((progress - .25) / .75);
        if (nextTint === scrollTint && nextReveal === entryReveal) return;
        const tintChanged = nextTint !== scrollTint;
        scrollTint = nextTint;
        entryReveal = nextReveal;
        if (!geometry) return;
        if (tintChanged) {
          const letter = geometry.logo.letters[4];
          const c = letter.buffer.getContext('2d');
          c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-in';
          c.fillStyle=bColor();c.fillRect(0,0,letter.buffer.width,letter.buffer.height);c.restore();
        }
        canvas.dataset.bColor=bColor();
        render(elapsed);
      },
      setActive(value){active=value;if(!active){cancelAnimationFrame(frame);frame=0;previous=0;}else wake();},
      destroy(){destroyed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);}
    };
  };
})();
