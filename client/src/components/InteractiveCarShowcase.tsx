import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Car as CarIcon, ShieldCheck, Zap } from 'lucide-react';

export interface InteractiveCarShowcaseProps {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  variant: 'wash' | 'rental';
  interactionIntensity?: number;
}

export const InteractiveCarShowcase: React.FC<InteractiveCarShowcaseProps> = ({
  title,
  eyebrow,
  description,
  image,
  buttonText,
  buttonLink,
  variant,
  interactionIntensity = 140 // 40% increased sensitivity by default
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseCardRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation state in refs for 60 FPS performance
  const animState = useRef({
    targetRotateX: 0,
    targetRotateY: 0,
    targetTranslateZ: 0,
    targetScale: 1,
    targetSheenX: 50,
    targetSheenY: 50,
    targetSheenOpacity: 0,
    targetShadowSpread: 12,
    targetShadowBlur: 22,
    targetShadowOpacity: 0.25,
    targetShadowSkew: 0,

    currRotateX: 0,
    currRotateY: 0,
    currTranslateZ: 0,
    currScale: 1,
    currSheenX: 50,
    currSheenY: 50,
    currSheenOpacity: 0,
    currShadowSpread: 12,
    currShadowBlur: 22,
    currShadowOpacity: 0.25,
    currShadowSkew: 0,

    isHovered: false
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Main 60 FPS requestAnimationFrame loop
  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateAnimation = (time: number) => {
      const state = animState.current;
      // Increased lerp factor to 0.12 for 40% faster cursor tracking responsiveness
      const lerpFactor = 0.12;

      if (prefersReducedMotion) {
        state.currRotateX = 0;
        state.currRotateY = 0;
        state.currTranslateZ = 0;
        state.currScale = 1;
        state.currSheenOpacity = 0;
        state.currShadowSpread = 12;
        state.currShadowBlur = 22;
        state.currShadowOpacity = 0.25;
        state.currShadowSkew = 0;
      } else if (!state.isHovered) {
        // Continuous ambient floating idle motion when cursor is inactive
        const elapsed = (time - startTime) * 0.0015;
        const ambientFloatZ = Math.sin(elapsed * 1.3) * 8;
        const ambientTiltX = Math.cos(elapsed * 1.1) * 1.8;
        const ambientTiltY = Math.sin(elapsed * 0.95) * 2.2;

        state.targetRotateX = ambientTiltX;
        state.targetRotateY = ambientTiltY;
        state.targetTranslateZ = ambientFloatZ;
        state.targetScale = 1.008;
        state.targetSheenOpacity = 0.15 + Math.sin(elapsed) * 0.1;
        state.targetShadowSpread = 12 + ambientFloatZ * 0.5;
        state.targetShadowBlur = 22 + ambientFloatZ * 0.7;
        state.targetShadowOpacity = 0.25;
        state.targetShadowSkew = ambientTiltY * 0.5;
      }

      // Lerp interpolations
      state.currRotateX = lerp(state.currRotateX, state.targetRotateX, lerpFactor);
      state.currRotateY = lerp(state.currRotateY, state.targetRotateY, lerpFactor);
      state.currTranslateZ = lerp(state.currTranslateZ, state.targetTranslateZ, lerpFactor);
      state.currScale = lerp(state.currScale, state.targetScale, lerpFactor);

      state.currSheenX = lerp(state.currSheenX, state.targetSheenX, lerpFactor);
      state.currSheenY = lerp(state.currSheenY, state.targetSheenY, lerpFactor);
      state.currSheenOpacity = lerp(state.currSheenOpacity, state.targetSheenOpacity, lerpFactor);

      state.currShadowSpread = lerp(state.currShadowSpread, state.targetShadowSpread, lerpFactor);
      state.currShadowBlur = lerp(state.currShadowBlur, state.targetShadowBlur, lerpFactor);
      state.currShadowOpacity = lerp(state.currShadowOpacity, state.targetShadowOpacity, lerpFactor);
      state.currShadowSkew = lerp(state.currShadowSkew, state.targetShadowSkew, lerpFactor);

      // Direct DOM updates
      if (showcaseCardRef.current) {
        showcaseCardRef.current.style.transform = `
          rotateX(${state.currRotateX.toFixed(3)}deg)
          rotateY(${state.currRotateY.toFixed(3)}deg)
        `;
      }

      if (carWrapperRef.current) {
        carWrapperRef.current.style.transform = `
          translateZ(${state.currTranslateZ.toFixed(2)}px)
          scale3d(${state.currScale.toFixed(4)}, ${state.currScale.toFixed(4)}, 1)
        `;
      }

      if (sheenRef.current) {
        const glowColor = variant === 'wash' ? 'rgba(2, 132, 199,' : 'rgba(239, 68, 68,';
        sheenRef.current.style.background = `radial-gradient(
          circle 500px at ${state.currSheenX.toFixed(1)}% ${state.currSheenY.toFixed(1)}%,
          ${glowColor} ${state.currSheenOpacity.toFixed(3)}),
          rgba(255, 255, 255, ${(state.currSheenOpacity * 0.6).toFixed(3)}) 35%,
          transparent 75%
        )`;
      }

      if (shadowRef.current) {
        const glowColor = variant === 'wash' ? 'rgba(2, 132, 199,' : 'rgba(239, 68, 68,';
        shadowRef.current.style.boxShadow = `0 ${state.currShadowSpread.toFixed(1)}px ${state.currShadowBlur.toFixed(1)}px rgba(15, 23, 42, ${state.currShadowOpacity.toFixed(3)}), 0 0 60px ${glowColor} ${(state.currTranslateZ * 0.007).toFixed(3)})`;
        shadowRef.current.style.transform = `scale(${1 + state.currTranslateZ * 0.0045}) skewX(${state.currShadowSkew.toFixed(2)}deg)`;
      }

      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    animationFrameId = requestAnimationFrame(updateAnimation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReducedMotion, variant]);

  // Pointer Movement Math (+40% Sensitivity Boost)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    const distFromCenter = Math.min(1.4, Math.sqrt(normX * normX + normY * normY));
    const intensity = (interactionIntensity / 100);
    const proximity = Math.max(0, 1 - distFromCenter / 1.4);

    const state = animState.current;
    state.isHovered = true;

    // Boosted rotateX: ±8.5° and rotateY: ±11.5° (+40% Sensitivity)
    state.targetRotateX = -normY * 8.5 * intensity;
    state.targetRotateY = normX * 11.5 * intensity;

    // Boosted TranslateZ elevation: up to 75px
    state.targetTranslateZ = (35 + proximity * 40) * intensity;

    // Boosted Scale: up to 1.05x
    state.targetScale = 1 + (0.025 + proximity * 0.025) * intensity;

    // Light Sheen position & opacity
    state.targetSheenX = ((e.clientX - rect.left) / rect.width) * 100;
    state.targetSheenY = ((e.clientY - rect.top) / rect.height) * 100;
    state.targetSheenOpacity = 0.3 + proximity * 0.55;

    // Shadow reactions
    state.targetShadowSpread = 20 + state.targetTranslateZ * 0.6;
    state.targetShadowBlur = 28 + state.targetTranslateZ * 0.8;
    state.targetShadowOpacity = 0.4 - proximity * 0.12;
    state.targetShadowSkew = state.targetRotateY * 0.7;
  };

  const handlePointerLeave = () => {
    const state = animState.current;
    state.isHovered = false;
    state.targetRotateX = 0;
    state.targetRotateY = 0;
    state.targetTranslateZ = 0;
    state.targetScale = 1;
    state.targetSheenOpacity = 0;
    state.targetShadowSpread = 12;
    state.targetShadowBlur = 22;
    state.targetShadowOpacity = 0.25;
    state.targetShadowSkew = 0;
  };

  const isWash = variant === 'wash';

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full py-6 select-none touch-pan-y"
      style={{ perspective: '1200px' }}
      aria-label={`Editorial Interactive Showcase - ${title}`}
    >
      {/* Main Crisp White Luxury Card Frame */}
      <div
        ref={showcaseCardRef}
        className={`relative w-full rounded-[2.5rem] overflow-hidden border transition-all duration-500 p-8 sm:p-12 lg:p-16 flex flex-col justify-between ${
          isWash
            ? 'bg-gradient-to-br from-white via-slate-50 to-sky-50/40 border-slate-200 hover:border-sky-400/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(2,132,199,0.12)]'
            : 'bg-gradient-to-br from-white via-slate-50 to-red-50/40 border-slate-200 hover:border-red-400/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(239,68,68,0.12)]'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        {/* Specular Light Sheen Layer */}
        <div
          ref={sheenRef}
          className="absolute inset-0 pointer-events-none z-20 rounded-[2.5rem] transition-opacity duration-300"
        />

        {/* Ambient Geometric Background Elements */}
        {isWash ? (
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 80%, rgba(2, 132, 199, 0.15), transparent 60%), linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)`,
                backgroundSize: '100% 100%, 48px 48px, 48px 48px',
                transform: 'rotateX(55deg) scale(1.6) translateY(20%)',
                transformOrigin: 'bottom center'
              }}
            />
            <div className="absolute top-0 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 80%, rgba(239, 68, 68, 0.15), transparent 60%), linear-gradient(to right, rgba(239, 68, 68, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)`,
                backgroundSize: '100% 100%, 60px 60px, 30px 30px',
                transform: 'rotateX(65deg) scale(1.7) translateY(25%)',
                transformOrigin: 'bottom center'
              }}
            />
            <div className="absolute top-0 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {/* TOP EDITORIAL HEADER CONTENT */}
        <div className="relative z-30 space-y-4 max-w-xl pointer-events-none">
          <div className="flex items-center gap-3">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase border backdrop-blur-md ${
                isWash
                  ? 'bg-sky-100/80 text-sky-700 border-sky-300/60'
                  : 'bg-red-100/80 text-red-700 border-red-300/60'
              }`}
            >
              {eyebrow}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
              {isWash ? 'HYDRO-SHIELD DETAILING' : 'HIGH PERFORMANCE FLEET'}
            </span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-none">
            {title}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* MIDDLE MASSIVE CAR VISUAL AREA (OCCUPIES ~60-65% OF SECTION VISUAL AREA) */}
        <div className="relative w-full flex-1 flex items-center justify-center my-8 sm:my-12 min-h-[260px] sm:min-h-[380px] lg:min-h-[440px]">
          {/* Dynamic Soft Floor Shadow */}
          <div
            ref={shadowRef}
            className="absolute bottom-4 sm:bottom-8 left-[6%] right-[6%] h-12 sm:h-20 rounded-[100%] bg-slate-900/30 blur-md pointer-events-none transition-all duration-75"
            style={{ transformOrigin: 'center center' }}
          />

          {/* Studio Floor Reflection */}
          <div
            className="absolute bottom-0 left-6 right-6 h-36 pointer-events-none opacity-20 blur-[2px] overflow-hidden"
            style={{ transform: 'scaleY(-1) translateY(-85%)' }}
          >
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>

          {/* Elevated Hero Car Visual Wrapper */}
          <div
            ref={carWrapperRef}
            className="relative z-20 w-full h-full flex items-center justify-center transition-transform duration-75 cursor-grab active:cursor-grabbing"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform'
            }}
          >
            <img
              src={image}
              alt={`${title} vehicle showcase`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full max-h-[300px] sm:max-h-[420px] lg:max-h-[480px] object-contain filter drop-shadow-[0_20px_35px_rgba(15,23,42,0.25)] transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />

            {/* Fallback frame */}
            {imageError && (
              <div className="flex flex-col items-center justify-center text-center space-y-3 p-8 bg-white rounded-3xl border border-slate-200 shadow-lg">
                <CarIcon className={`w-16 h-16 animate-pulse ${isWash ? 'text-sky-600' : 'text-red-600'}`} />
                <span className="text-sm font-bold text-slate-950 uppercase tracking-wider">{title}</span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM EDITORIAL CTA & BADGES */}
        <div className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
          <Link
            to={buttonLink}
            className={`group inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-lg ${
              isWash
                ? 'bg-slate-950 text-white hover:bg-sky-600 shadow-slate-950/20 hover:scale-105'
                : 'bg-red-600 text-white hover:bg-slate-950 shadow-red-600/20 hover:scale-105'
            }`}
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${isWash ? 'text-sky-600' : 'text-red-600'}`} />
              <span>GUARANTEED QUALITY</span>
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>INSTANT RESERVATION</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
