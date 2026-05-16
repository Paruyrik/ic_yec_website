'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type Variant = 'success' | 'error' | 'info' | 'warning'

type Toast = { id: string; message: string; variant: Variant; duration?: number }

type ToastContextType = {
  toast: (message: string, variant?: Variant, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const ICONS: Record<Variant, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

const VARIANT_CLASSES: Record<Variant, string> = {
  success: 'bg-[#EAF3DE] text-[#3B6D11] border-[#c3e0a0]',
  error:   'bg-[#FCEBEB] text-[#A32D2D] border-[#f0bbbb]',
  info:    'bg-[#E6F1FB] text-[#0C447C] border-[#b8d5f0]',
  warning: 'bg-[#FAEEDA] text-[#633806] border-[#f0d0a0]',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={`
        flex items-start gap-2.5 px-4 py-3 rounded-lg border shadow-md
        text-[14px] font-medium min-w-[240px] max-w-[360px]
        animate-in slide-in-from-bottom-2 duration-200
        ${VARIANT_CLASSES[toast.variant]}
      `}
    >
      <span className="shrink-0 font-bold">{ICONS[toast.variant]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-[16px] leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, variant: Variant = 'info', duration?: number) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, variant, duration }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx.toast
}
