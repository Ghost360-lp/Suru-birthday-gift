import { useState, useMemo } from "react";
import "./photo-gallery.css";

// ─────────────────────────────────────────────
//  Add your photos here. Each photo needs:
//  - id       : Google Drive file ID
//  - caption  : short label shown on hover & in lightbox
//  - date     : display string, e.g. "March 2023"
//  - group    : section header, e.g. "The memories" — photos are grouped by this
//  - aspect   : "sq" | "tall" | "wide"  (controls tile shape in the grid)
// ─────────────────────────────────────────────
const ALL_PHOTOS = [
  // ── The memories ──────────────────────────────
  { id: "1nyi2OUueLCsdHh0nWtVv7GbY0pbozz8c", caption: "Ujjain temple trip 🛕", date: "2023-2026", group: "The memories", aspect: "tall" },
  { id: "1r84R5zKmqvygmc_NlrmN1jSUigtRLkyf", caption: "Just need a long break for everything",date: "2023-2026",     group: "The memories",   aspect: "sq"   },
  { id: "19XL9kePW8gUiGK5ZOMUzqGAT52_dO0Oo", caption: "The rakhi we made together that one time 👫 and we will never forget",date: "2023-2026",     group: "The memories",   aspect: "wide"},
  { id: "1GAIlBbpWti83dl_EAIPLAsUlrXDDWPTM", caption: "Younger brothers birthday treat✨",date: "2023-2026",   group: "The memories",   aspect: "sq"},
  { id: "1Czl-fUoJ1DNcM8kvccZuX2OddMDl8js6", caption: "The lemion mojito fun time🍹",date: "2023-2026",   group: "The memories",   aspect: "wide"},
  { id: "1_GwVwtjx-I0I0PkyJ27YwbXvih0J8Aw4", caption : "Ghar par fun time", date: "2023-2026",   group: "The memories",   aspect: "sq"},
  { id: "113CZ-hGCSq_t58gNVRhzMyhEK5n6pnzr", caption: "The sibling time", date: "2023-2026",   group: "The memories",   aspect: "wide"},
  { id: "1qg0y3Wxdg7ZmyvQxv2bgkiUlwlWOLt5S", caption: "When you stay away from cayous and actually looked good 😂", date: "2023-2026",   group: "The memories",   aspect: "tall"},
  { id: "1mkPPd7eiU-Rw3trniLLkWnDiP-HoDasc", caption: "Just My gray tone", date: "2023-2026",   group: "The memories",   aspect: "sq"},
  { id: "19yABJjSdE22giDn_0U32Wxx05w2pAAiI", caption: "Oh khana sojasara Ohh khana sojasara", date: "2023-2026",   group: "The memories",   aspect: "tall"},
  { id: "14nn2tX4S0Cg8V8Yluz1yavb5aPuBPASh", caption: "The Corporate Lunch", date: "2023-2026",   group: "The memories",   aspect: "tall"},
  { id: "1yb0sTvZDXIW9b6nLTTfCc9Hr5slsP8R3", caption: "The solo inosant portrait", date: "2023-2026",   group: "The memories",   aspect: "wide"},
  { id: "1hHzb_1031vz4jQlKnjkyfE9NDDn9smMi", caption: "The Family weadding time", date: "2023-2026",   group: "The memories",   aspect: "tall"},
  { id: "1bKXtVRFU6AnPJvjy2uDlileQkVfFVQmz", caption: "The Temple trip with friend", date: "2023-2026",   group: "The memories",   aspect: "sq"},
  { id: "18ttCme9hZGN4BAHwpqF7WETEeseDH9bD", caption: "Birthday with Mataji", date: "2023-2026",   group: "The memories",   aspect: "tall"},
  { id: "1ZvzRONuHdRJwohTZjJwzxNQvhZK-EfJ9", caption: "The Unfiltered Me", date: "2023-2026",   group: "The memories",   aspect: "sq"},
  { id: "1itKSQrWbXwC4HMSTC96WCtV3owC4Obwi", caption: "The office Birthday surprise", date: "2023-2026",   group: "The memories",   aspect: "tall" },
  { id: "1v_140u1WCaEuu3AK3bSJVkJjunnQzaZA", caption: "The red velvet", date: "2023-2026",   group: "The memories",   aspect: "wide"}
];

const ALL_GROUPS = ["All", ...Array.from(new Set(ALL_PHOTOS.map((p) => p.group)))];

/* ── Lightbox ── */
function Lightbox({ photo, allFlat, onClose, onNav }) {
  const idx   = allFlat.findIndex((p) => p.id === photo.id);
  const hasPrev = idx > 0;
  const hasNext = idx < allFlat.length - 1;

  return (
    <div className="pg-lightbox">
      <div className="pg-lightbox__topbar">
        <button className="pg-lightbox__close" onClick={onClose} title="Close (Esc)">✕</button>
        <div className="pg-lightbox__info">
          <div className="pg-lightbox__caption">{photo.caption}</div>
          <div className="pg-lightbox__date">{photo.date}</div>
        </div>
        <div className="pg-lightbox__nav">
          <button
            className="pg-lightbox__arrow"
            onClick={() => onNav(allFlat[idx - 1])}
            disabled={!hasPrev}
            title="Previous"
          >‹</button>
          <button
            className="pg-lightbox__arrow"
            onClick={() => onNav(allFlat[idx + 1])}
            disabled={!hasNext}
            title="Next"
          >›</button>
        </div>
      </div>
      <div className="pg-lightbox__stage">
        <iframe
          className="pg-lightbox__iframe"
          src={`https://drive.google.com/file/d/${photo.id}/preview`}
          title={photo.caption}
          allow="autoplay"
        />
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function PhotoGallery({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [favs,         setFavs]         = useState(new Set());
  const [lightbox,     setLightbox]     = useState(null);

  // Filter + search
  const filtered = useMemo(() => {
    return ALL_PHOTOS.filter((p) => {
      const matchGroup = activeFilter === "All" || p.group === activeFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.caption.toLowerCase().includes(q) ||
        p.date.toLowerCase().includes(q) ||
        p.group.toLowerCase().includes(q);
      return matchGroup && matchSearch;
    });
  }, [activeFilter, search]);

  // Group the filtered list
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((p) => {
      if (!map.has(p.group)) map.set(p.group, []);
      map.get(p.group).push(p);
    });
    return Array.from(map.entries()); // [[groupName, [photos]], ...]
  }, [filtered]);

  const toggleFav = (e, id) => {
    e.stopPropagation();
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Keyboard nav
  const handleKeyDown = (e) => {
    if (!lightbox) return;
    const idx = filtered.findIndex((p) => p.id === lightbox.id);
    if (e.key === "ArrowRight" && idx < filtered.length - 1) setLightbox(filtered[idx + 1]);
    if (e.key === "ArrowLeft"  && idx > 0)                   setLightbox(filtered[idx - 1]);
    if (e.key === "Escape")                                   setLightbox(null);
  };

  return (
    <div className="pg-page" onKeyDown={handleKeyDown} tabIndex={-1}>

      {/* ── NAV ── */}
      <nav className="pg-nav">
        <button className="pg-nav__back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Close
        </button>

        <span className="pg-nav__title">All Memories</span>

        <div className="pg-nav__search-wrap">
          <svg className="pg-nav__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="pg-nav__search"
            placeholder="Search memories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </nav>


      {/* ── CONTENT ── */}
      <div className="pg-content">
        {grouped.length === 0 ? (
          <div className="pg-empty">No memories found…</div>
        ) : (
          grouped.map(([groupName, photos]) => (
            <div key={groupName} className="pg-group">
              {/* Group header */}
              <div className="pg-group__header">
                <span className="pg-group__day">{groupName}</span>
                <span className="pg-group__month-year">
                  {photos[0].date.split(" ").slice(1).join(" ")}
                </span>
                <span className="pg-group__count">{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Masonry grid */}
              <div className="pg-grid">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="pg-tile"
                    onClick={() => setLightbox(photo)}
                  >
                    <iframe
                      className={`pg-tile__iframe pg-tile__iframe--${photo.aspect}`}
                      src={`https://drive.google.com/file/d/${photo.id}/preview`}
                      title={photo.caption}
                      allow="autoplay"
                    />

                    {/* Click interceptor */}
                    <div className="pg-tile__hit" />

                    {/* Hover overlay */}
                    <div className="pg-tile__overlay">
                      <div className="pg-tile__caption">{photo.caption}</div>
                      <div className="pg-tile__date">{photo.date}</div>
                    </div>

                    {/* Fav button */}
                    <button
                      className={`pg-tile__fav${favs.has(photo.id) ? " pg-tile__fav--active" : ""}`}
                      onClick={(e) => toggleFav(e, photo.id)}
                      title={favs.has(photo.id) ? "Unfavourite" : "Favourite"}
                    >
                      {favs.has(photo.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <Lightbox
          photo={lightbox}
          allFlat={filtered}
          onClose={() => setLightbox(null)}
          onNav={setLightbox}
        />
      )}
    </div>
  );
}