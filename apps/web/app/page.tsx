"use client";

import { useEffect, useRef, CSSProperties, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

import { T } from "../lib/theme";
import { posts, landingAvatarConfigs, orbitConfig } from "../lib/data";
import { Hero } from "../components/landing/Hero";
import { OrbitSection } from "../components/landing/OrbitSection";
import { OutroSection } from "../components/landing/OutroSection";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function HomePage(): ReactElement {
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const isHeroCopyHiddenRef = useRef<boolean>(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleStartSharing = () => {
    if (user) {
      router.push("/feed");
    } else {
      router.push("/signup");
    }
  };

  useEffect((): (() => void) => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number): void => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context((): void => {
      const heroCopyH3 = heroCopyRef.current?.querySelector<HTMLHeadingElement>("h3");
      if (!heroCopyH3) return;

      const split = new SplitText(heroCopyH3, { type: "words" });
      const words: Element[] = split.words;
      gsap.set(words, { opacity: 0 });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: (): string => `+=${window.innerHeight * 3.5}`,
        pin: true,
        pinSpacing: false,
        scrub: 1,
        onUpdate(self: ScrollTrigger): void {
          const p: number = self.progress;

          gsap.set(heroHeaderRef.current, {
            yPercent: -Math.min(p / 0.29, 1) * 120,
          });

          const wp: number = Math.min(Math.max((p - 0.29) / 0.21, 0), 1);
          words.forEach((word: Element, i: number): void => {
            const s: number = i / words.length;
            const e: number = (i + 1) / words.length;
            gsap.set(word, { opacity: Math.min(Math.max((wp - s) / (e - s), 0), 1) });
          });

          if (p > 0.64 && !isHeroCopyHiddenRef.current) {
            isHeroCopyHiddenRef.current = true;
            gsap.to(heroCopyH3, { opacity: 0, duration: 0.3 });
          } else if (p <= 0.64 && isHeroCopyHiddenRef.current) {
            isHeroCopyHiddenRef.current = false;
            gsap.to(heroCopyH3, { opacity: 1, duration: 0.3 });
          }

          const ip: number = Math.min(Math.max((p - 0.71) / 0.29, 0), 1);
          gsap.set(heroImageRef.current, {
            width: gsap.utils.interpolate(window.innerWidth, 280, ip),
            height: gsap.utils.interpolate(window.innerHeight, 200, ip),
            borderRadius: gsap.utils.interpolate(0, 20, ip),
          });
        },
      });

      posts.forEach((post, i: number): void => {
        const orbit = orbitConfig[i] ?? orbitConfig[0]!;
        gsap.to(`#post-card-${post.id}`, {
          y: -orbit.travel,
          ease: "none",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return (): void => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <main style={{ background: T.bg }}>
      <Hero
        ref={heroRef}
        imageRef={heroImageRef}
        headerRef={heroHeaderRef}
        copyRef={heroCopyRef}
      />

      <OrbitSection
        ref={aboutRef}
        posts={posts}
        avatarConfigs={landingAvatarConfigs}
        orbitConfig={orbitConfig}
        onStartSharing={handleStartSharing}
      />

      <OutroSection />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
      `}</style>
    </main>
  );
}