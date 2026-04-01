import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ImageCarousel = ({
  images = [],
  altBase = 'Gallery image',
  containerClassName = '',
  imageClassName = '',
  overlay = null,
  placeholder = null,
  showIndicators = true,
  showCount = false,
  intervalMs = 3200,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = images.length > 0
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  useEffect(() => {
    if (!hasMultipleImages) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
    }, intervalMs)

    return () => window.clearInterval(intervalId)
  }, [hasMultipleImages, images.length, intervalMs])

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {hasImages ? (
        <>
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={`${images[activeIndex]}-${activeIndex}`}
              src={images[activeIndex]}
              alt={`${altBase} ${activeIndex + 1}`}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover ${imageClassName}`}
              initial={hasMultipleImages ? { x: 90, opacity: 0.35, scale: 1.03 } : false}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={hasMultipleImages ? { x: -90, opacity: 0.35, scale: 0.98 } : undefined}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              draggable={false}
            />
          </AnimatePresence>

          {overlay}

          {hasMultipleImages && showIndicators && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
              {images.map((image, index) => (
                <span
                  key={`${image}-${index}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}

          {hasMultipleImages && showCount && (
            <span className="absolute top-3 left-3 z-10 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white/80">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </>
      ) : (
        placeholder
      )}
    </div>
  )
}

export default ImageCarousel
