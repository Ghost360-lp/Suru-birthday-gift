import { useState, useEffect } from "react";
import PhotoGallery from "./PhotoGallery";

// ─────────────────────────────────────────────
//  HOW TO ADD YOUR GOOGLE DRIVE PHOTOS (iframe method):
//  1. Open photo in Google Drive → Share → "Anyone with the link"
//  2. Copy the file ID from the URL:
//     https://drive.google.com/file/d/FILE_ID_HERE/view
//  3. Paste just the FILE_ID_HERE into the `id` field below
// ─────────────────────────────────────────────

const SISTER_NAME = "Srushti"; // ← Change to your sister's name
// https://drive.google.com/file/d//view?usp=sharing
const photos = [
  {
    id: "19XL9kePW8gUiGK5ZOMUzqGAT52_dO0Oo", // ← paste your Google Drive file ID here
    caption: "The rakhi we made together that one time 👫 and we will never forget",
    date: "09/08/2025",
    rotation: -2,
  },
  {
    id: "1SLdaWEOUv_cm1mTRgm9vVI2fGBcpsFLD",
    caption: "Birthday madness last year 🎂",
    date: "04/09/2025",
    rotation: 1.5,
  },
  {
    id: "1bB2ZshgfIfOxqM3I5IABsy8Z2l92_HCa",
    caption: "The Fun with dadi",
    date: "no idea when picture was clicked",
    rotation: -1,
  },
  {
    id: "1nyi2OUueLCsdHh0nWtVv7GbY0pbozz8c",
    caption: "Fun in Ujjain Mahakaleshwar trip 🚗",
    date: "05/06/2025",
    rotation: 2,
  },
  {
    id: "1itKSQrWbXwC4HMSTC96WCtV3owC4Obwi",
    caption: "She always steals the spotlight ✨",
    date: "19/01/2026",
    rotation: -1.5,
  },
  {
    id: "1qg0y3Wxdg7ZmyvQxv2bgkiUlwlWOLt5S",
    caption: "When you stay away from cayous and actually looked good 😂",
    date: "no idea when picture was clicked",
    rotation: 1,
  }
  // ↑ Add more by copying any block above
];

const messages = [
  "To my incredible sister — every memory with you is a treasure.",
  "You light up every room, every photo, every moment.",
  "Here's to the laughs, the chaos, and everything in between.",
  "Happy Birthday! This one's all for you. 🎉",
];

/* ── Lightbox ── */
function LightboxFrame({ fileId, caption, rotation, date, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div
        className="lightbox-card"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `rotate(${rotation * 0.4}deg)` }}
      >
        <iframe
          className="lightbox-iframe"
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          title={caption}
          allow="autoplay"
        />
        <div className="lightbox-caption">{caption}</div>
        <div className="lightbox-date">{date}</div>
        <button className="lightbox-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function BirthdayGallery() {
  const [showGallery, setShowGallery] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [msgIndex, setMsgIndex]   = useState(0);
  const [confetti, setConfetti]   = useState([]);

  // Rotate messages every 4 s
  useEffect(() => {
    const iv = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(iv);
  }, []);

  // Generate confetti pieces once
  useEffect(() => {
    setConfetti(
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 3,
        color: ["#f4c2a1","#e8a87c","#d4956a","#ffd700","#f9e4d4","#c4785a"][i % 6],
        size: 6 + Math.random() * 7,
        round: Math.random() > 0.5,
      }))
    );
  }, []);

  return (
    <>
      {/* ── Confetti ── */}
      <div className="confetti-layer">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              borderRadius: p.round ? "50%" : "2px",
              background: p.color,
              animation: `fall ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      <div className="page">

        {/* ── Header ── */}
        <header className="site-header">
          <div className="divider divider--top" />

          <p className="header-label">Happy Birthday</p>

          <h1 className="header-name">{SISTER_NAME}</h1>

          <p className="header-subtitle">— a celebration in pictures —</p>

          <p key={msgIndex} className="header-message">
            {messages[msgIndex]}
          </p>

          <div className="divider divider--bottom" />
        </header>

        {/* ── Photo Grid ── */}
        <div className="photo-grid">
          {photos.map((photo, i) => (
            <div
              key={photo.id + i}
              className="card"
              onClick={() => setSelected(photo)}
              style={{
                transform: `rotate(${photo.rotation}deg)`,
                animation: `cardIn 0.55s ease ${i * 0.1}s forwards`,
              }}
            >
              <div className="card__frame">
                <iframe
                  className="card__iframe"
                  src={`https://drive.google.com/file/d/${photo.id}/preview`}
                  title={photo.caption}
                  allow="autoplay"
                />
                {/* Transparent overlay so card click works over iframe */}
                <div className="card__overlay" />
              </div>

              <p className="card__caption">{photo.caption}</p>
              <p className="card__date">{photo.date}</p>
            </div>
          ))}
        </div>

        {/* ── View Gallery Button ── */}
        <div className="view-gallery-section">
          <button className="view-gallery-btn" onClick={() => setShowGallery(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            View All Memories
          </button>
        </div>

        <div className="video-section">
          <div className="video-label">
            <span className="video-label__line" />
            <span className="video-label__text">A moment in motion</span>
            <span className="video-label__line" />
          </div>
          <div className="video-frame-wrap">
            <div className="video-frame-glow" />
            <iframe
              className="video-frame"
              src="https://drive.google.com/file/d/1KFw_nFpJJbztttnP4FORNCAoYKR_0-WE/preview"
              title="Birthday video"
              allow="autoplay"
              allowFullScreen
            />
          </div>
          <p className="video-caption">A small gesture of love from a brother and let Mahadev belss her and protect her at any point of time Love You DIDI🎬</p>
        </div>

        {/* ── Footer ── */}
        <div className="footer-section">
          <div className="footer-box">
            <div className="corner corner--tl" />
            <div className="corner corner--tr" />
            <div className="corner corner--bl" />
            <div className="corner corner--br" />

            <p className="footer-quote">
              "Some bonds are written in the stars
              ours is written in a thousand memories, met as a stranger but now become the closest of siblings."
            </p>
            <p className="footer-sign">Made With all my love 🤍 from a brother from another Mother</p>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {selected && (
        <LightboxFrame
          fileId={selected.id}
          caption={selected.caption}
          date={selected.date}
          rotation={selected.rotation}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── Gallery Modal ── */}
      {showGallery && (
        <div className="gallery-modal-backdrop" onClick={() => setShowGallery(false)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <PhotoGallery onBack={() => setShowGallery(false)} />
          </div>
        </div>
      )}
    </>
  );
}