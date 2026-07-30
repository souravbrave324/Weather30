"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

export interface WeatherMarker {
  id: string
  location: [number, number]
  emoji: string
}

export interface GlobeWeatherProps {
  markers?: WeatherMarker[]
  className?: string
  speed?: number
  targetLat?: number
  targetLon?: number
  onSpinStart?: () => void
  onSpinComplete?: () => void
}

const defaultMarkers: WeatherMarker[] = [
  { id: "weather-1", location: [50.0, -100.0], emoji: "☀️" },
  { id: "weather-2", location: [55.0, 10.0], emoji: "🌧️" },
  { id: "weather-3", location: [25.0, 80.0], emoji: "⛈️" },
  { id: "weather-4", location: [-10.0, -60.0], emoji: "🌤️" },
  { id: "weather-5", location: [65.0, 100.0], emoji: "❄️" },
  { id: "weather-6", location: [35.0, 140.0], emoji: "🌸" },
  { id: "weather-7", location: [-30.0, 25.0], emoji: "🌈" },
  { id: "weather-8", location: [40.0, -5.0], emoji: "☁️" },
  { id: "weather-9", location: [-45.0, 170.0], emoji: "🌊" },
  { id: "weather-10", location: [15.0, -130.0], emoji: "🌴" },
  { id: "weather-11", location: [70.0, -40.0], emoji: "🌨️" },
  { id: "weather-12", location: [-20.0, 130.0], emoji: "🔥" },
  { id: "weather-13", location: [5.0, 40.0], emoji: "🌪️" },
  { id: "weather-14", location: [45.0, 60.0], emoji: "🌙" },
  { id: "weather-15", location: [-35.0, -70.0], emoji: "⭐" },
  { id: "weather-16", location: [20.0, -20.0], emoji: "🌞" },
]

export function GlobeWeather({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
  targetLat,
  targetLon,
  onSpinStart,
  onSpinComplete,
}: GlobeWeatherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  // Target rotation refs
  const targetPhiRef = useRef<number | null>(null)
  const targetThetaRef = useRef<number | null>(null)
  const currentPhiRef = useRef(0)
  const currentThetaRef = useRef(0.2)
  const isRotatingToTarget = useRef(false)
  const prevTargetRef = useRef<string>("")

  // Trigger rotation ONLY when targetLat / targetLon changes
  useEffect(() => {
    if (targetLat !== undefined && targetLon !== undefined) {
      const targetKey = `${targetLat.toFixed(4)},${targetLon.toFixed(4)}`
      if (prevTargetRef.current !== targetKey) {
        prevTargetRef.current = targetKey
        
        // Calculate target angles in radians
        const phiRad = -targetLon * (Math.PI / 180) + Math.PI / 2
        const thetaRad = targetLat * (Math.PI / 180)

        targetPhiRef.current = phiRad
        targetThetaRef.current = thetaRad
        isRotatingToTarget.current = true

        if (onSpinStart) onSpinStart()
      }
    }
  }, [targetLat, targetLon, onSpinStart])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let animTick = 0

    let activeMarkers = [...markers]
    if (targetLat !== undefined && targetLon !== undefined) {
      activeMarkers.push({
        id: "searched-target",
        location: [targetLat, targetLon],
        emoji: "📍",
      })
    }

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: currentPhiRef.current,
        theta: currentThetaRef.current,
        dark: 1,
        diffuse: 1.6,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [0.12, 0.18, 0.28],
        markerColor: [0.35, 0.75, 0.98],
        glowColor: [0.25, 0.45, 0.75],
        markerElevation: 0.12,
        markers: activeMarkers.map((m) => ({ location: m.location, size: 0.035, id: m.id })),
        arcs: [],
        arcColor: [0.5, 0.8, 1],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.9,
      })

      function animate() {
        animTick += 1

        if (isRotatingToTarget.current && targetPhiRef.current !== null && targetThetaRef.current !== null) {
          // Normalize angle difference to take shortest rotation path
          let diffPhi = (targetPhiRef.current - currentPhiRef.current) % (Math.PI * 2)
          if (diffPhi > Math.PI) diffPhi -= Math.PI * 2
          if (diffPhi < -Math.PI) diffPhi += Math.PI * 2

          let diffTheta = targetThetaRef.current - currentThetaRef.current

          const bobPulse = 1 + Math.sin(animTick * 0.25) * 0.35
          currentPhiRef.current += diffPhi * 0.08 * bobPulse
          currentThetaRef.current += diffTheta * 0.08 * bobPulse

          // Precise target arrival check
          if (Math.abs(diffPhi) < 0.012 && Math.abs(diffTheta) < 0.012) {
            currentPhiRef.current = targetPhiRef.current
            currentThetaRef.current = targetThetaRef.current
            isRotatingToTarget.current = false
            targetPhiRef.current = null
            targetThetaRef.current = null
            if (onSpinComplete) onSpinComplete()
          }
        } else if (!isPausedRef.current) {
          currentPhiRef.current += speed
        }

        globe!.update({
          phi: currentPhiRef.current + phiOffsetRef.current + dragOffset.current.phi,
          theta: currentThetaRef.current + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }

      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed, targetLat, targetLon, onSpinComplete])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes weather-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="sticker-outline-weather">
            <feMorphology in="SourceAlpha" result="Dilated" operator="dilate" radius="2" />
            <feFlood floodColor="#ffffff" result="OutlineColor" />
            <feComposite in="OutlineColor" in2="Dilated" operator="in" result="Outline" />
            <feMerge>
              <feMergeNode in="Outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            fontSize: "1.8rem",
            filter: "url(#sticker-outline-weather) drop-shadow(0 2px 6px rgba(100,150,220,0.4))",
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            transition: "opacity 0.3s, filter 0.3s",
            animation: "weather-float 3s ease-in-out infinite",
          }}
        >
          {m.emoji}
        </div>
      ))}
    </div>
  )
}
