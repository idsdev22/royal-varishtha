import React, { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink, MessageSquare, Film, Sparkles } from 'lucide-react';
import { propertyData } from '../data/propertyData';

const DEFAULT_REEL_HEIGHT = 620;

const getFallbackReelHeight = (width) => {
  if (!width || width <= 0) return DEFAULT_REEL_HEIGHT;
  // Instagram embed header (~56px) + portrait video area (~1.45x width) + footer (~84px)
  return Math.max(540, Math.min(720, Math.round(width * 1.45 + 140)));
};

const ensurePlaysInline = (embedUrl) => {
  if (!embedUrl) return embedUrl;
  if (embedUrl.includes('playsinline=')) return embedUrl;
  const separator = embedUrl.includes('?') ? '&' : '?';
  return `${embedUrl}${separator}playsinline=1`;
};

export const VideoShowcase = ({ onOpenEnquiry }) => {
  const { videos, projectInfo } = propertyData;
  const reelWrapRef = useRef(null);
  const hasMeasuredRef = useRef(false);
  const [reelHeight, setReelHeight] = useState(DEFAULT_REEL_HEIGHT);

  // Auto-sync Instagram embed iframe height from Instagram's MEASURE postMessage
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.origin || !event.origin.includes('instagram.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.type === 'MEASURE' && typeof data?.details?.height === 'number') {
          hasMeasuredRef.current = true;
          const clamped = Math.max(520, Math.min(820, Math.ceil(data.details.height)));
          setReelHeight(clamped);
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keep a responsive height before Instagram's MEASURE arrives (no CSS transform scaling)
  useEffect(() => {
    const el = reelWrapRef.current;
    if (!el) return;

    const updateFallbackHeight = () => {
      if (!hasMeasuredRef.current && el.clientWidth > 0) {
        setReelHeight(getFallbackReelHeight(el.clientWidth));
      }
    };
    updateFallbackHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateFallbackHeight);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateFallbackHeight);
    return () => window.removeEventListener('resize', updateFallbackHeight);
  }, []);

  if (!videos) return null;

  const { youtube, instagram } = videos;
  const youtubeEmbedSrc = youtube ? ensurePlaysInline(youtube.embedUrl) : '';

  return (
    <section className="section video-showcase-section" id="videos">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Film size={13} />
            <span>Video Tour &amp; Reels</span>
          </div>
          <h2 className="section-title">
            Experience <span className="text-emerald">{projectInfo.name}</span> in Motion
          </h2>
          <p className="section-description">
            Watch our official walkthrough video and Instagram Reel to explore the layout, surroundings, and community lifestyle firsthand.
          </p>
        </div>

        <div className="video-showcase-grid">
          {/* YouTube Video Card */}
          {youtube && (
            <div className="video-card video-card-youtube">
              <div className="video-card-header">
                <div className="video-platform-badge badge-youtube">
                  <Play size={13} fill="currentColor" />
                  <span>YouTube Video</span>
                </div>
                <a
                  href={youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-external-link"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="youtube-player-wrap">
                <iframe
                  src={youtubeEmbedSrc}
                  title={youtube.title}
                  className="youtube-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="video-card-footer">
                <div className="video-footer-copy">
                  <h3 className="video-card-title">{youtube.title}</h3>
                  <p className="video-card-subtitle">{youtube.subtitle}</p>
                  <div className="video-meta-tags">
                    <span className="video-meta-chip">{projectInfo.totalArea}</span>
                    <span className="video-meta-chip">{projectInfo.plotSizesRange}</span>
                    <span className="video-meta-chip">DTCP Approved</span>
                  </div>
                </div>
                {onOpenEnquiry && (
                  <button
                    type="button"
                    className="btn-primary video-cta-btn"
                    onClick={onOpenEnquiry}
                  >
                    <MessageSquare size={15} />
                    <span>ENQUIRY NOW</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Instagram Reel Card */}
          {instagram && (
            <div className="video-card video-card-instagram">
              <div className="video-card-header">
                <div className="video-platform-badge badge-instagram">
                  <Sparkles size={13} />
                  <span>Instagram Reel</span>
                </div>
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-external-link"
                >
                  <span>Open Reel</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              <div
                ref={reelWrapRef}
                className="instagram-player-wrap"
                style={{ height: `${reelHeight}px` }}
              >
                <iframe
                  src={instagram.embedUrl}
                  title={instagram.title}
                  className="instagram-iframe"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  scrolling="no"
                />
              </div>

              <div className="instagram-card-footer">
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-instagram-watch"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Watch Reel on Instagram</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
