import React, { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink, MessageSquare, Film, Sparkles } from 'lucide-react';
import { propertyData } from '../data/propertyData';

const INSTAGRAM_MIN_WIDTH = 328;
const DEFAULT_REEL_HEIGHT = 620;

export const VideoShowcase = ({ onOpenEnquiry }) => {
  const { videos, projectInfo } = propertyData;
  const reelWrapRef = useRef(null);
  const [reelHeight, setReelHeight] = useState(DEFAULT_REEL_HEIGHT);
  const [reelWrapWidth, setReelWrapWidth] = useState(0);

  // Auto-sync Instagram embed iframe height from Instagram's MEASURE postMessage
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.origin || !event.origin.includes('instagram.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.type === 'MEASURE' && typeof data?.details?.height === 'number') {
          const clamped = Math.max(480, Math.min(780, Math.ceil(data.details.height)));
          setReelHeight(clamped);
        }
      } catch {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Measure Reel container width so ultra-narrow mobile screens (<328px) scale cleanly without clipping
  useEffect(() => {
    const el = reelWrapRef.current;
    if (!el) return;

    const updateWidth = () => {
      setReelWrapWidth(el.clientWidth);
    };
    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!videos) return null;

  const { youtube, instagram } = videos;
  const reelScale =
    reelWrapWidth > 0 && reelWrapWidth < INSTAGRAM_MIN_WIDTH
      ? reelWrapWidth / INSTAGRAM_MIN_WIDTH
      : 1;
  const scaledHeight = Math.round(reelHeight * reelScale);

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
                  src={youtube.embedUrl}
                  title={youtube.title}
                  className="youtube-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
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
                style={{ height: `${scaledHeight}px` }}
              >
                <iframe
                  src={instagram.embedUrl}
                  title={instagram.title}
                  className="instagram-iframe"
                  style={
                    reelScale < 1
                      ? {
                          width: `${INSTAGRAM_MIN_WIDTH}px`,
                          height: `${reelHeight}px`,
                          transform: `scale(${reelScale})`,
                          transformOrigin: 'top left'
                        }
                      : {
                          width: '100%',
                          height: `${reelHeight}px`
                        }
                  }
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  scrolling="no"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
