'use client'

import { useState, useEffect, useCallback } from 'react'

interface GalleryImage {
  url: string
  alt?: string | null
}

interface Props {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])

  const prev = useCallback(() =>
    setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length])

  const next = useCallback(() =>
    setOpen((i) => (i === null ? null : (i + 1) % images.length)), [images.length])

  useEffect(() => {
    if (open === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  return (
    <>
      {/* Thumbnail grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: 6,
      }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            style={{
              all: 'unset',
              cursor: 'zoom-in',
              display: 'block',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              borderRadius: 8,
              background: '#e0dff5',
              position: 'relative',
            }}
            aria-label={`Open image ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || `Photo ${i + 1}`}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                transition: 'transform 0.22s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
            />
            {/* Hover overlay */}
            <span style={{
              position: 'absolute', inset: 0,
              background: 'rgba(61,55,133,0)',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: 'white',
              pointerEvents: 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.background = 'rgba(61,55,133,0.28)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.background = 'rgba(61,55,133,0)' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,8,30,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          {/* Content - stop clicks bubbling to backdrop */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw', maxHeight: '90vh',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            }}
          >
            {/* Main image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[open].url}
              alt={images[open].alt || `Photo ${open + 1}`}
              style={{
                maxWidth: '88vw', maxHeight: '80vh',
                objectFit: 'contain', borderRadius: 10,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                display: 'block',
              }}
            />

            {/* Counter */}
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              {open + 1} / {images.length}
            </span>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div style={{
                display: 'flex', gap: 6, flexWrap: 'nowrap', overflowX: 'auto',
                maxWidth: '88vw', paddingBottom: 4,
              }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setOpen(i)}
                    style={{
                      all: 'unset', cursor: 'pointer', flexShrink: 0,
                      width: 52, height: 52, borderRadius: 6, overflow: 'hidden',
                      border: i === open ? '2px solid var(--color-accent)' : '2px solid transparent',
                      transition: 'border-color 0.15s', opacity: i === open ? 1 : 0.55,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  all: 'unset', cursor: 'pointer',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: 'white', backdropFilter: 'blur(4px)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
                aria-label="Previous"
              >‹</button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  all: 'unset', cursor: 'pointer',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: 'white', backdropFilter: 'blur(4px)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
                aria-label="Next"
              >›</button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={close}
            style={{
              position: 'absolute', top: 16, right: 16,
              all: 'unset', cursor: 'pointer',
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: 'white', backdropFilter: 'blur(4px)',
            }}
            aria-label="Close"
          >✕</button>
        </div>
      )}
    </>
  )
}
