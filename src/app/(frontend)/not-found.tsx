'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [dots, setDots] = useState(1)

  // Blinking trail-marker dots — the cairn "searching" effect
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d % 3) + 1), 600)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap');

        .pn-404-root {
          min-height: 100vh;
          background: #3D7A5A;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          font-family: 'Source Sans 3', Arial, sans-serif;
        }

        /* Mountain silhouette SVG fills the bottom */
        .pn-mountains {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          pointer-events: none;
          user-select: none;
        }

        /* Pill nav — matches brand nav */
        .pn-nav {
          position: relative;
          z-index: 10;
          padding: 1.25rem 1.5rem 0;
        }
        .pn-nav-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(61, 122, 90, 0.80);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
          padding: 10px 10px 10px 14px;
          height: 54px;
        }
        .pn-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .pn-nav-wordmark {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .pn-nav-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.2px;
        }
        .pn-nav-name em {
          font-style: normal;
          color: #E8501A;
        }
        .pn-nav-sub {
          font-family: 'Space Mono', monospace;
          font-size: 7.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          margin-top: 3px;
        }
        .pn-nav-home {
          font-family: 'Source Sans 3', Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          background: #ffffff;
          color: #2E5C43;
          padding: 8px 18px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .pn-nav-home:hover {
          background: #F6F5F1;
        }

        /* Main content */
        .pn-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem 10rem;
        }

        /* The elevation-marker 404 */
        .pn-elevation-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 1.5px;
          color: #E8501A;
          border: 1px solid rgba(232, 80, 26, 0.45);
          padding: 6px 14px;
          border-radius: 2px;
          margin-bottom: 1.75rem;
        }
        .pn-elevation-badge .arrow {
          color: rgba(232, 80, 26, 0.6);
        }

        /* The headline */
        .pn-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(48px, 10vw, 96px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -1px;
          margin-bottom: 0.25rem;
        }

        .pn-subheadline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(18px, 3vw, 26px);
          font-weight: 400;
          font-style: italic;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 1.5rem;
        }

        /* Trail marker dots (the animated cairn) */
        .pn-cairn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 1.75rem;
          height: 18px;
        }
        .pn-cairn-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          transition: background 0.2s;
        }
        .pn-cairn-dot.active {
          background: #E8501A;
        }

        /* Body copy */
        .pn-body {
          font-size: 17px;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto 2.5rem;
        }
        .pn-body strong {
          color: #ffffff;
          font-weight: 600;
        }

        /* CTA group */
        .pn-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .pn-btn-primary {
          font-family: 'Source Sans 3', Arial, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: #ffffff;
          color: #2E5C43;
          padding: 14px 32px;
          border-radius: 2px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          display: inline-block;
        }
        .pn-btn-primary:hover {
          background: #F6F5F1;
        }
        .pn-btn-ghost {
          font-family: 'Source Sans 3', Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: transparent;
          color: rgba(255, 255, 255, 0.85);
          padding: 14px 28px;
          border-radius: 2px;
          text-decoration: none;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          display: inline-block;
        }
        .pn-btn-ghost:hover {
          border-color: rgba(255, 255, 255, 0.65);
          color: #ffffff;
        }

        /* Elevation data strip along the bottom */
        .pn-elev-strip {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 2rem;
          align-items: center;
          white-space: nowrap;
        }
        .pn-elev-item {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.38);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .pn-elev-item span {
          color: rgba(232, 80, 26, 0.55);
          font-size: 13px;
        }

        @media (max-width: 600px) {
          .pn-elev-strip { display: none; }
          .pn-nav-pill { padding: 10px 10px 10px 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pn-cairn-dot { transition: none; }
        }
      `}</style>

      <div className="pn-404-root">
        {/* Background mountain range */}
        <svg
          className="pn-mountains"
          viewBox="0 0 1440 420"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Far-back range — lightest */}
          <polygon
            points="0,420 180,200 320,280 480,140 620,240 760,110 900,210 1040,130 1200,220 1440,160 1440,420"
            fill="rgba(255,255,255,0.05)"
          />
          {/* Mid range */}
          <polygon
            points="0,420 100,300 260,200 400,310 560,180 700,280 840,170 1000,260 1160,190 1320,270 1440,210 1440,420"
            fill="rgba(255,255,255,0.07)"
          />
          {/* Near range — most visible */}
          <polygon
            points="0,420 80,360 200,270 340,340 460,240 580,310 700,220 820,300 960,235 1100,310 1240,255 1380,320 1440,290 1440,420"
            fill="rgba(255,255,255,0.10)"
          />
          {/* Closest ridge */}
          <polygon
            points="0,420 140,380 300,330 460,370 620,320 780,360 960,330 1140,370 1300,340 1440,360 1440,420"
            fill="rgba(46,92,67,0.55)"
          />
        </svg>

        {/* Nav */}
        <nav className="pn-nav" aria-label="Site navigation">
          <div className="pn-nav-pill">
            <Link href="/" className="pn-nav-left" aria-label="PinNepal home">
              {/* Logo mark */}
              <svg width="28" height="34" viewBox="0 0 58 70" fill="none" aria-hidden="true">
                <path
                  d="M29 0C13 0 0 13 0 29C0 45 29 70 29 70C29 70 58 45 58 29C58 13 45 0 29 0Z"
                  fill="rgba(255,255,255,0.18)"
                />
                <path d="M10 42 L22 18 L29 28 L36 16 L48 42Z" fill="white" />
                <path
                  d="M29 34 Q24 38 20 50 Q26 46 29 46 Q32 46 38 50 Q34 38 29 34Z"
                  fill="#E8501A"
                />
                <path
                  d="M20 50 Q18 56 17 62 L29 70 L41 62 Q40 56 38 50 Q34 46 29 46 Q26 46 20 50Z"
                  fill="#E8501A"
                />
              </svg>
              <div className="pn-nav-wordmark">
                <span className="pn-nav-name">
                  Pin<em>Nepal</em>
                </span>
                <span className="pn-nav-sub">Travel &amp; Adventure</span>
              </div>
            </Link>
            <Link href="/" className="pn-nav-home">
              Back to home
            </Link>
          </div>
        </nav>

        {/* Main 404 content */}
        <main className="pn-content">
          {/* Elevation-style 404 marker */}
          <div className="pn-elevation-badge" aria-hidden="true">
            <span className="arrow">▲</span>
            404m · TRAIL NOT FOUND
          </div>

          <h1 className="pn-headline">Off the path.</h1>
          <p className="pn-subheadline">Even the best guides take a wrong turn.</p>

          {/* Animated cairn — trail-marker dots */}
          <div className="pn-cairn" role="status" aria-label="Searching for the trail">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`pn-cairn-dot${i <= dots ? ' active' : ''}`} />
            ))}
          </div>

          <p className="pn-body">
            This page doesn&apos;t exist — but <strong>Nepal does</strong>, and it&apos;s waiting.
            The route you were looking for may have moved, or you may have taken a fork that leads
            nowhere. Happens above 4,000m. Head back to base.
          </p>

          <div className="pn-cta-group">
            <Link href="/" className="pn-btn-primary">
              Return to base camp
            </Link>
            <Link href="/packages" className="pn-btn-ghost">
              Browse packages →
            </Link>
          </div>
        </main>

        {/* Ambient elevation data strip */}
        <div className="pn-elev-strip" aria-hidden="true">
          <div className="pn-elev-item">
            <span>8,849m</span>
            Sagarmatha
          </div>
          <div className="pn-elev-item">
            <span>5,364m</span>
            Base Camp
          </div>
          <div className="pn-elev-item">
            <span>5,416m</span>
            Thorong La
          </div>
          <div className="pn-elev-item">
            <span>340 km</span>
            Moto Route
          </div>
          <div className="pn-elev-item">
            <span>8,091m</span>
            Annapurna I
          </div>
        </div>
      </div>
    </>
  )
}
