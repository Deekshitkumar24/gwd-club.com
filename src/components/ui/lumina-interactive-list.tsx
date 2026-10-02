import React, { useEffect, useRef } from 'react';
import './lumina-interactive-list.css';

declare const gsap: any;
declare const THREE: any;

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isDisposed = false;
    let animFrameId: number | null = null;
    let autoSlideTimer: any = null;
    let progressAnimation: any = null;

    // --- DYNAMIC SCRIPT LOADING ---
    const loadScripts = async () => {
      const loadScript = (src: string, globalName: string) =>
        new Promise<void>((res, rej) => {
          if ((window as any)[globalName]) {
            res();
            return;
          }
          if (document.querySelector(`script[src="${src}"]`)) {
            const check = setInterval(() => {
              if ((window as any)[globalName]) {
                clearInterval(check);
                res();
              }
            }, 50);
            setTimeout(() => {
              clearInterval(check);
              rej(new Error(`Timeout waiting for ${globalName}`));
            }, 10000);
            return;
          }
          const s = document.createElement('script');
          s.src = src;
          s.onload = () => {
            setTimeout(() => res(), 100);
          };
          s.onerror = () => rej(new Error(`Failed to load ${src}`));
          document.head.appendChild(s);
        });

      try {
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
          'gsap'
        );
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
          'THREE'
        );
      } catch (e) {
        console.error('Failed to load base scripts:', e);
      }

      if (!isDisposed) {
        initApplication();
      }
    };

    const initApplication = async () => {
      if (isDisposed) return;

      const SLIDER_CONFIG: any = {
        settings: {
          transitionDuration: 2.2,
          autoSlideSpeed: 5000,
          currentEffect: 'glass',
          currentEffectPreset: 'Default',
          globalIntensity: 1.0,
          speedMultiplier: 1.0,
          distortionStrength: 1.0,
          colorEnhancement: 1.0,
          glassRefractionStrength: 1.0,
          glassChromaticAberration: 1.0,
          glassBubbleClarity: 1.0,
          glassEdgeGlow: 1.0,
          glassLiquidFlow: 1.0,
        },
      };

      // --- GLOBAL STATE ---
      let currentSlideIndex = 0;
      let isTransitioning = false;
      let shaderMaterial: any, renderer: any, scene: any, camera: any;
      const slideTextures: any[] = [];
      let texturesLoaded = false;
      let sliderEnabled = false;

      const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
      const PROGRESS_UPDATE_INTERVAL = 50;
      const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

      // Authentic images from e:\gwd\img
      const slides = [
        {
          title: 'Field Technical Briefing',
          description:
            'GWD student leads and builders coordinating match architecture and squad strategy on the turf.',
          media: '/img/visit-conversation.jpg',
        },
        {
          title: 'Tournament In Action',
          description:
            'Competitive football competition operating on real-time GWD Sports Tournament software.',
          media: '/img/visit-match.jpg',
        },
        {
          title: 'Core Builder Collective',
          description:
            'Cross-disciplinary student talent spanning software engineering, media production, and operations.',
          media: '/img/visit-team.jpg',
        },
        {
          title: 'Athlete Formation & Lineup',
          description:
            'Squad preparation and player verification powered by verified digital player passports.',
          media: '/img/visit-training.jpg',
        },
        {
          title: 'Live Operations Desk',
          description:
            'On-site field operations handling real-time match scoring, player verification, and referee dispatch.',
          media: '/img/visit-workstation.jpg',
        },
        {
          title: 'Tournament Logistics',
          description:
            'Field infrastructure, hardware deployment, and student team leadership powering grassroots sports.',
          media: '/img/visit-behind-scenes.jpg',
        },
      ];

      // --- SHADERS ---
      const vertexShader = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

      const fragmentShader = `
uniform sampler2D uTexture1, uTexture2;
uniform float uProgress;
uniform vec2 uResolution, uTexture1Size, uTexture2Size;
uniform int uEffectType;
uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;

varying vec2 vUv;

vec2 getCoverUV(vec2 uv, vec2 textureSize) {
  vec2 s = uResolution / textureSize;
  float scale = max(s.x, s.y);
  vec2 scaledSize = textureSize * scale;
  vec2 offset = (uResolution - scaledSize) * 0.5;
  return (uv * uResolution - offset) / scaledSize;
}

vec4 glassEffect(vec2 uv, float progress) {
  float time = progress * 5.0 * uSpeedMultiplier;
  vec2 uv1 = getCoverUV(uv, uTexture1Size);
  vec2 uv2 = getCoverUV(uv, uTexture2Size);
  float maxR = length(uResolution) * 0.85;
  float br = progress * maxR;
  vec2 p = uv * uResolution;
  vec2 c = uResolution * 0.5;
  float d = length(p - c);
  float nd = d / max(br, 0.001);
  float param = smoothstep(br + 3.0, br - 3.0, d);

  vec4 img;
  if (param > 0.0) {
    float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
    vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
    vec2 distUV = uv2 - dir * ro;
    distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
    float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
    img = vec4(
      texture2D(uTexture2, distUV + dir * ca * 1.2).r,
      texture2D(uTexture2, distUV + dir * ca * 0.2).g,
      texture2D(uTexture2, distUV - dir * ca * 0.8).b,
      1.0
    );
    if (uGlassEdgeGlow > 0.0) {
      float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
      img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
    }
  } else {
    img = texture2D(uTexture2, uv2);
  }

  vec4 oldImg = texture2D(uTexture1, uv1);
  if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
  return mix(oldImg, img, param);
}

void main() {
  gl_FragColor = glassEffect(vUv, uProgress);
}
`;

      const splitText = (text: string) => {
        return text
          .split('')
          .map(
            (char) =>
              `<span style="display: inline-block; opacity: 0;">${
                char === ' ' ? '&nbsp;' : char
              }</span>`
          )
          .join('');
      };

      const updateContent = (idx: number) => {
        const titleEl = document.getElementById('mainTitle');
        const descEl = document.getElementById('mainDesc');
        if (titleEl && descEl && typeof gsap !== 'undefined') {
          gsap.to(titleEl.children, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: 'power2.in',
          });
          gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: 'power2.in' });

          setTimeout(() => {
            titleEl.innerHTML = splitText(slides[idx].title);
            descEl.textContent = slides[idx].description;

            gsap.set(titleEl.children, { opacity: 0 });
            gsap.set(descEl, { y: 20, opacity: 0 });

            const children = titleEl.children;
            gsap.set(children, { y: 20 });
            gsap.to(children, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.03,
              ease: 'power3.out',
            });
            gsap.to(descEl, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2,
              ease: 'power3.out',
            });
          }, 450);
        }
      };

      const navigateToSlide = (targetIndex: number) => {
        if (isTransitioning || targetIndex === currentSlideIndex || !shaderMaterial) return;

        stopAutoSlideTimer();
        quickResetProgress(currentSlideIndex);

        const currentTexture = slideTextures[currentSlideIndex];
        const targetTexture = slideTextures[targetIndex];
        if (!currentTexture || !targetTexture) return;

        isTransitioning = true;
        shaderMaterial.uniforms.uTexture1.value = currentTexture;
        shaderMaterial.uniforms.uTexture2.value = targetTexture;
        shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

        updateContent(targetIndex);
        currentSlideIndex = targetIndex;
        updateCounter(currentSlideIndex);
        updateNavigationState(currentSlideIndex);

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            shaderMaterial.uniforms.uProgress,
            { value: 0 },
            {
              value: 1,
              duration: TRANSITION_DURATION(),
              ease: 'power2.inOut',
              onComplete: () => {
                if (isDisposed) return;
                shaderMaterial.uniforms.uProgress.value = 0;
                shaderMaterial.uniforms.uTexture1.value = targetTexture;
                shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                isTransitioning = false;
                safeStartTimer(100);
              },
            }
          );
        } else {
          isTransitioning = false;
        }
      };

      const handleSlideChange = () => {
        if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
        navigateToSlide((currentSlideIndex + 1) % slides.length);
      };

      const createSlidesNavigation = () => {
        const nav = document.getElementById('slidesNav');
        if (!nav) return;
        nav.innerHTML = '';
        slides.forEach((slide, i) => {
          const item = document.createElement('div');
          item.className = `slide-nav-item${i === 0 ? ' active' : ''}`;
          item.dataset.slideIndex = String(i);
          item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isTransitioning && i !== currentSlideIndex) {
              stopAutoSlideTimer();
              quickResetProgress(currentSlideIndex);
              navigateToSlide(i);
            }
          });
          nav.appendChild(item);
        });
      };

      const updateNavigationState = (idx: number) =>
        document
          .querySelectorAll('.slide-nav-item')
          .forEach((el, i) => el.classList.toggle('active', i === idx));

      const updateSlideProgress = (idx: number, prog: number) => {
        const el = document.querySelectorAll('.slide-nav-item')[idx]?.querySelector(
          '.slide-progress-fill'
        ) as HTMLElement;
        if (el) {
          el.style.width = `${prog}%`;
          el.style.opacity = '1';
        }
      };

      const fadeSlideProgress = (idx: number) => {
        const el = document.querySelectorAll('.slide-nav-item')[idx]?.querySelector(
          '.slide-progress-fill'
        ) as HTMLElement;
        if (el) {
          el.style.opacity = '0';
          setTimeout(() => {
            if (el) el.style.width = '0%';
          }, 300);
        }
      };

      const quickResetProgress = (idx: number) => {
        const el = document.querySelectorAll('.slide-nav-item')[idx]?.querySelector(
          '.slide-progress-fill'
        ) as HTMLElement;
        if (el) {
          el.style.transition = 'width 0.2s ease-out';
          el.style.width = '0%';
          setTimeout(() => {
            if (el) el.style.transition = 'width 0.1s ease, opacity 0.3s ease';
          }, 200);
        }
      };

      const updateCounter = (idx: number) => {
        const sn = document.getElementById('slideNumber');
        if (sn) sn.textContent = String(idx + 1).padStart(2, '0');
        const st = document.getElementById('slideTotal');
        if (st) st.textContent = String(slides.length).padStart(2, '0');
      };

      const startAutoSlideTimer = () => {
        if (!texturesLoaded || !sliderEnabled || isDisposed) return;
        stopAutoSlideTimer();
        let progress = 0;
        const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
        progressAnimation = setInterval(() => {
          if (!sliderEnabled || isDisposed) {
            stopAutoSlideTimer();
            return;
          }
          progress += increment;
          updateSlideProgress(currentSlideIndex, progress);
          if (progress >= 100) {
            clearInterval(progressAnimation);
            progressAnimation = null;
            fadeSlideProgress(currentSlideIndex);
            if (!isTransitioning) handleSlideChange();
          }
        }, PROGRESS_UPDATE_INTERVAL);
      };

      const stopAutoSlideTimer = () => {
        if (progressAnimation) clearInterval(progressAnimation);
        if (autoSlideTimer) clearTimeout(autoSlideTimer);
        progressAnimation = null;
        autoSlideTimer = null;
      };

      const safeStartTimer = (delay = 0) => {
        stopAutoSlideTimer();
        if (sliderEnabled && texturesLoaded && !isDisposed) {
          if (delay > 0) autoSlideTimer = setTimeout(startAutoSlideTimer, delay);
          else startAutoSlideTimer();
        }
      };

      const loadImageTexture = (src: string) =>
        new Promise<any>((resolve, reject) => {
          if (typeof THREE === 'undefined') {
            reject(new Error('THREE not loaded'));
            return;
          }
          const l = new THREE.TextureLoader();
          l.load(
            src,
            (t: any) => {
              t.minFilter = t.magFilter = THREE.LinearFilter;
              t.userData = { size: new THREE.Vector2(t.image.width || 1920, t.image.height || 1080) };
              resolve(t);
            },
            undefined,
            reject
          );
        });

      const initRenderer = async () => {
        const canvas = containerRef.current?.querySelector('.webgl-canvas') as HTMLCanvasElement;
        if (!canvas || typeof THREE === 'undefined' || isDisposed) return;

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture1: { value: null },
            uTexture2: { value: null },
            uProgress: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTexture1Size: { value: new THREE.Vector2(1, 1) },
            uTexture2Size: { value: new THREE.Vector2(1, 1) },
            uEffectType: { value: 0 },
            uGlobalIntensity: { value: 1.0 },
            uSpeedMultiplier: { value: 1.0 },
            uDistortionStrength: { value: 1.0 },
            uGlassRefractionStrength: { value: 1.0 },
            uGlassChromaticAberration: { value: 1.0 },
            uGlassBubbleClarity: { value: 1.0 },
            uGlassEdgeGlow: { value: 1.0 },
            uGlassLiquidFlow: { value: 1.0 },
          },
          vertexShader,
          fragmentShader,
        });

        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

        for (const s of slides) {
          if (isDisposed) return;
          try {
            slideTextures.push(await loadImageTexture(s.media));
          } catch (e) {
            console.warn('Failed texture load for:', s.media, e);
          }
        }

        if (slideTextures.length >= 2 && !isDisposed) {
          shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
          shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
          shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
          shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
          texturesLoaded = true;
          sliderEnabled = true;
          safeStartTimer(500);
        }

        const render = () => {
          if (isDisposed) return;
          animFrameId = requestAnimationFrame(render);
          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };
        render();
      };

      createSlidesNavigation();
      updateCounter(0);

      // Initial text content
      const tEl = document.getElementById('mainTitle');
      const dEl = document.getElementById('mainDesc');
      if (tEl && dEl && typeof gsap !== 'undefined') {
        tEl.innerHTML = splitText(slides[0].title);
        dEl.textContent = slides[0].description;
        gsap.fromTo(
          tEl.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: 'power3.out', delay: 0.5 }
        );
        gsap.fromTo(
          dEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
        );
      }

      initRenderer();

      const handleResize = () => {
        if (renderer && shaderMaterial) {
          renderer.setSize(window.innerWidth, window.innerHeight);
          shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
      };

      const handleVisibilityChange = () => {
        if (document.hidden) stopAutoSlideTimer();
        else if (!isTransitioning) safeStartTimer();
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('resize', handleResize);
    };

    loadScripts();

    return () => {
      isDisposed = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (autoSlideTimer) clearTimeout(autoSlideTimer);
      if (progressAnimation) clearInterval(progressAnimation);
    };
  }, []);

  return (
    <main className="slider-wrapper" ref={containerRef}>
      <canvas className="webgl-canvas"></canvas>
      <span className="slide-number" id="slideNumber">
        01
      </span>
      <span className="slide-total" id="slideTotal">
        06
      </span>
      <div className="slide-content">
        <h1 className="slide-title" id="mainTitle"></h1>
        <p className="slide-description" id="mainDesc"></p>
      </div>
      <nav className="slides-navigation" id="slidesNav"></nav>
    </main>
  );
}

export default Component;
