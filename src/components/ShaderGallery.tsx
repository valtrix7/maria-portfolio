import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ShaderGallery.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Landscape stills (1.6 aspect) — reused/extended from the work set so the
// gallery stays cohesive with the rest of the site. Swap these for real
// renders/exports any time; the plane aspect is fixed at 1.6.
const ITEMS = [
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=750&fit=crop', title: 'Urban Explorer', tag: 'Brand Reveal' },
  { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=750&fit=crop', title: 'Data Narrative', tag: 'Motion System' },
  { img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=750&fit=crop', title: 'Product Film', tag: '3D Animation' },
  { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=750&fit=crop', title: 'Summit Finance', tag: 'Pitch Deck' },
  { img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=750&fit=crop', title: 'Aether Studio', tag: 'Visual Language' },
  { img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&h=750&fit=crop', title: 'Spectrum', tag: 'Title Sequence' },
  { img: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=1200&h=750&fit=crop', title: 'Nightshift', tag: 'Loop Study' },
  { img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=750&fit=crop', title: 'Monolith', tag: 'Brand Film' },
];

const IMG_ASPECT = 1.6;

const vertexShader = /* glsl */ `
  uniform float uScreenX;   // mesh center, normalised to half-viewport (-1..1)
  uniform float uVelocity;  // scroll velocity (world units / frame)
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;

    // Cylinder-style curve: planes recede in Z the further they sit from centre.
    p.z -= pow(abs(uScreenX), 1.8) * 1.15;

    // Velocity bend — the leading edge of each plane curves with motion.
    p.z += sin(uv.x * 3.14159265) * uVelocity * 1.6;

    // Slight horizontal stretch while moving for a sense of speed.
    p.x *= 1.0 + abs(uVelocity) * 0.12;

    // Gentle idle float.
    p.y += sin(uTime * 0.6 + uScreenX * 2.0) * 0.015;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uVelocity;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Chromatic aberration scaled by scroll velocity.
    float a = clamp(abs(uVelocity) * 0.6, 0.0, 0.04);
    float r = texture2D(uTexture, uv + vec2(a, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(a, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // Rounded-corner alpha mask.
    float radius = 0.05;
    vec2 q = abs(uv - 0.5) - (vec2(0.5) - radius);
    float dist = length(max(q, 0.0)) - radius;
    float alpha = smoothstep(0.004, 0.0, dist);

    // Soft vignette + a touch of lift on the focused (centre) plane.
    float vig = smoothstep(1.05, 0.35, distance(uv, vec2(0.5)));
    col *= 0.82 + 0.18 * vig + uHover * 0.12;

    gl_FragColor = vec4(col, alpha);
  }
`;

const ShaderGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pin = pinRef.current;
    if (!canvas || !pin) return undefined;

    const showFallback = () => {
      if (fallbackRef.current) fallbackRef.current.style.display = 'grid';
      canvas.style.display = 'none';
      sectionRef.current?.classList.add('gallery--fallback');
    };

    // Reduced motion → skip WebGL entirely, show the DOM fallback grid.
    if (prefersReducedMotion()) {
      showFallback();
      return undefined;
    }

    let cancelled = false;
    let cleanup = () => {};

    // three.js is heavy — load it on demand so it stays out of the main bundle.
    import('three')
      .then((THREE) => {
        if (cancelled) return;
        cleanup = setup(THREE) || cleanup;
      })
      .catch(showFallback);

    // ---- WebGL scene setup, returns a disposer ----
    function setup(THREE: typeof import('three')) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      // No WebGL → graceful DOM fallback.
      showFallback();
      return undefined;
    }

    let rafId: number | null = null;
    let trigger: ScrollTrigger | null = null;
    let disposed = false;
    const meshes: Array<THREE.Mesh | null> = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 10;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Visible height at z=0 depends only on fov + distance (not aspect),
    // so plane sizing stays stable across resizes.
    const fovRad = (camera.fov * Math.PI) / 180;
    const viewH = 2 * Math.tan(fovRad / 2) * camera.position.z;
    const planeH = viewH * 0.5;
    const planeW = planeH * IMG_ASPECT;
    const gap = planeW * 1.22;
    const trackWidth = gap * (ITEMS.length - 1);

    let viewW = viewH; // updated on resize
    let currentX = 0;
    let lastX = 0;
    let targetX = 0;
    const group = new THREE.Group();
    scene.add(group);

    const sizeRenderer = () => {
      const w = pin.clientWidth;
      const h = pin.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      viewW = viewH * camera.aspect;
    };
    sizeRenderer();

    const geometry = new THREE.PlaneGeometry(planeW, planeH, 48, 1);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const buildMesh = (texture: THREE.Texture, i: number) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uScreenX: { value: 0 },
          uVelocity: { value: 0 },
          uHover: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * gap;
      group.add(mesh);
      meshes[i] = mesh;
    };

    // Load all textures, then start rendering + pin.
    ITEMS.forEach((item, i) => {
      loader.load(
        item.img,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          buildMesh(texture, i);
        },
        undefined,
        () => {
          /* a single failed image just leaves a gap — non-fatal */
        }
      );
    });

    const clock = new THREE.Clock();

    const tick = () => {
      const t = clock.getElapsedTime();
      currentX += (targetX - currentX) * 0.08;
      const velocity = currentX - lastX;
      lastX = currentX;

      group.position.x = currentX;

      for (let i = 0; i < meshes.length; i++) {
        const mesh = meshes[i];
        if (!mesh) continue;
        const worldX = currentX + i * gap;
        const screenX = worldX / (viewW / 2);
        const u = (mesh.material as THREE.ShaderMaterial).uniforms;
        u.uScreenX.value = screenX;
        u.uVelocity.value = velocity;
        u.uTime.value = t;
        // Focused plane (nearest centre) gets a subtle lift.
        const focus = Math.max(0, 1 - Math.abs(screenX) * 2.2);
        u.uHover.value += (focus - u.uHover.value) * 0.1;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Scroll drives the horizontal offset; pin holds the section in frame.
    const endLen = () => Math.round((ITEMS.length - 1) * window.innerHeight * 0.85);

    trigger = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => `+=${endLen()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: sizeRenderer,
      onUpdate(self) {
        targetX = -self.progress * trackWidth;
        const idx = Math.min(
          Math.round(self.progress * (ITEMS.length - 1)),
          ITEMS.length - 1
        );
        if (counterRef.current) counterRef.current.textContent = String(idx + 1).padStart(2, '0');
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    const onResize = () => sizeRenderer();
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      if (trigger) trigger.kill();
      geometry.dispose();
      meshes.forEach((m) => {
        if (!m) return;
        (m.material as THREE.ShaderMaterial).uniforms.uTexture.value?.dispose();
        m.material.dispose();
      });
      renderer.dispose();
    };
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section className="gallery" id="gallery" data-section="gallery" ref={sectionRef}>
      <div className="gallery-pin" ref={pinRef}>
        <div className="gallery-head container">
          <span className="label">Visual Index</span>
          <h2 className="gallery-title">Selected Frames</h2>
        </div>

        <canvas className="gallery-canvas" ref={canvasRef} />

        {/* DOM fallback (reduced-motion / no WebGL) */}
        <div className="gallery-fallback" ref={fallbackRef} aria-hidden="false">
          {ITEMS.map((item) => (
            <figure className="gallery-fb-item" key={item.title}>
              <img src={item.img} alt={item.title} loading="lazy" />
              <figcaption>
                <span className="gallery-fb-tag">{item.tag}</span>
                <span className="gallery-fb-title">{item.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="gallery-hud container">
          <div className="gallery-counter">
            <span ref={counterRef}>01</span>
            <span className="gallery-counter-sep">/</span>
            <span>{String(ITEMS.length).padStart(2, '0')}</span>
          </div>
          <div className="gallery-progress">
            <div className="gallery-progress-fill" ref={progressRef} />
          </div>
          <span className="gallery-hint">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default ShaderGallery;
