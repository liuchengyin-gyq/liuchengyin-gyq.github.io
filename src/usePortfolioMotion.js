import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion() {
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    const opening = root.querySelector('.opening');
    const media = gsap.matchMedia();
    let disposed = false;
    const context = gsap.context(() => {
      media.add({
        all: '(min-width: 0px)',
        desktop: '(min-width: 1000px)',
        reduce: '(prefers-reduced-motion: reduce)',
      }, ({ conditions }) => {
        const { desktop, reduce } = conditions;
        const finishOpening = () => {
          opening.hidden = true;
          root.dataset.motionReady = 'true';
        };
        if (reduce) {
          finishOpening();
          return;
        }

        const hero = root.querySelector('.hero');
        const skipOpening = window.scrollY > hero.offsetHeight * .5 ||
          (window.location.hash && window.location.hash !== '#home');
        const lines = gsap.utils.toArray('.hero-title-line');
        if (skipOpening) {
          finishOpening();
        } else {
          opening.hidden = false;
          root.dataset.motionReady = 'false';
          const intro = gsap.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: finishOpening });
          intro.fromTo('.opening-brand', { yPercent: 115, scaleY: .65 }, { yPercent: 0, scaleY: 1, duration: .95 })
            .fromTo('.opening-rule span', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, .15)
            .to('.opening-brand', { yPercent: -125, duration: .7 }, 1.05)
            .to(opening, { clipPath: 'inset(0 0 100% 0)', duration: 1.35 }, 1.25)
            .fromTo('.hero-media', { scale: 1.16 }, { scale: 1, duration: 2.3, ease: 'power3.out' }, 1.3)
            .fromTo(lines, { yPercent: 120, scaleY: .62, rotation: 3 }, {
              yPercent: 0, scaleY: 1, rotation: 0, duration: 1.7, stagger: .18,
              transformOrigin: '0% 100%', ease: 'power4.out', clearProps: 'transform',
            }, 1.65)
            .fromTo('.hero-content > .eyebrow, .hero-description, .hero-content > .button', {
              y: 28, autoAlpha: 0,
            }, { y: 0, autoAlpha: 1, duration: 1, stagger: .13, ease: 'power3.out', clearProps: 'all' }, 2.2)
            .fromTo('.header', { yPercent: -100 }, {
              yPercent: 0, duration: 1.15, ease: 'power3.out', clearProps: 'transform',
            }, 2.15)
            .fromTo('.hero-bottom', { y: 22, autoAlpha: 0 }, {
              y: 0, autoAlpha: 1, duration: .9, clearProps: 'transform,opacity,visibility',
            }, 2.65);

          // A deliberate navigation or scroll interrupts the opening without delaying access.
          const revealImmediately = () => {
            intro.progress(1);
            finishOpening();
          };
          const onKey = event => {
            if (['Tab', 'Escape', 'ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) revealImmediately();
          };
          window.addEventListener('wheel', revealImmediately, { passive: true, once: true });
          window.addEventListener('touchstart', revealImmediately, { passive: true, once: true });
          window.addEventListener('keydown', onKey);
          intro.eventCallback('onComplete', () => {
            finishOpening();
            window.removeEventListener('wheel', revealImmediately);
            window.removeEventListener('touchstart', revealImmediately);
            window.removeEventListener('keydown', onKey);
          });
          // This timeline also owns listeners when a media change or unmount interrupts it.
          intro.eventCallback('onInterrupt', () => {
            window.removeEventListener('wheel', revealImmediately);
            window.removeEventListener('touchstart', revealImmediately);
            window.removeEventListener('keydown', onKey);
          });
        }

        gsap.utils.toArray('.motion-heading').forEach(heading => {
          gsap.from(heading.querySelectorAll('.motion-word'), {
            yPercent: 115, x: desktop ? -65 : -20, scaleY: .55, rotation: 4,
            transformOrigin: '0% 100%', duration: 1.6, stagger: .16, ease: 'power4.out',
            scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
            clearProps: 'transform',
          });
          gsap.from(heading.querySelector('.motion-heading-rule'), {
            scaleX: 0, transformOrigin: 'left', duration: 1.7, ease: 'power3.inOut',
            scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
          });
        });

        const reveal = (selector, settings = {}) => {
          gsap.utils.toArray(selector).forEach(element => {
            gsap.from(element, {
              y: desktop ? 65 : 35, duration: 1.25, ease: 'power3.out',
              ...settings,
              scrollTrigger: { trigger: element, start: 'top 94%', once: true },
              clearProps: 'transform,opacity,visibility,clipPath',
            });
          });
        };
        reveal('.section-heading, .about-copy > .eyebrow, .about-copy > h2, .contact-main > .eyebrow', {
          clipPath: 'inset(0 0 100% 0)', duration: 1.4,
        });
        reveal('.about-copy > p, .about-links, .experience-list, .contact-actions, .contact-secondary', {
          autoAlpha: 0,
        });
        reveal('.portrait-wrap', { clipPath: 'inset(0 0 100% 0)', duration: 1.65 });
        reveal('.contact-title-line', { yPercent: 112, y: 0, scaleY: .7, duration: 1.6 });

        // Batch only visible siblings so deep links and fast scrolling never wait for prior rows.
        for (const selector of ['.project-card', '.strength-card', '.stats > div']) {
          const elements = gsap.utils.toArray(selector);
          gsap.set(elements, { y: desktop ? 100 : 55, autoAlpha: 0 });
          ScrollTrigger.batch(elements, {
            start: 'top 96%',
            once: true,
            interval: .12,
            onEnter: batch => {
              gsap.to(batch, {
                y: 0, autoAlpha: 1, duration: 1.35, stagger: .18, delay: .18,
                ease: 'power3.out', overwrite: 'auto', clearProps: 'transform,opacity,visibility',
              });
            },
          });
        }

        gsap.utils.toArray('.project-visual').forEach(visual => {
          gsap.from(visual, {
            clipPath: 'inset(0 0 85% 0)', duration: 1.55, ease: 'power3.inOut',
            scrollTrigger: { trigger: visual, start: 'top 96%', once: true },
            clearProps: 'clipPath',
          });
          if (desktop) {
            gsap.fromTo(visual.querySelector('.project-image img'), { yPercent: -2, scale: 1.07 }, {
              yPercent: 3, scale: 1.07, ease: 'none',
              scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            });
          }
        });
        if (desktop) {
          gsap.to('.hero-media', {
            yPercent: 18, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.4 },
          });
        }
      });
    }, root);

    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      media.revert();
      context.revert();
    };
  }, []);
}
