// src/components/ui/ToastContainer.jsx
"use client"

import { useEffect } from "react"

export function ToastContainer({ toasts, removeToast }) {
  useEffect(() => {
    const timers = toasts.map(toast =>
      setTimeout(() => removeToast(toast.id), 3000)
    )
    return () => timers.forEach(t => clearTimeout(t))
  }, [toasts, removeToast])

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 9999
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          padding: "10px 20px",
          borderRadius: "6px",
          color: "#fff",
          background: toast.variant === "success" ? "#16a34a" : "#dc2626",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}>
          <strong>{toast.title}</strong>
          {toast.description && <div>{toast.description}</div>}
        </div>
      ))}
    </div>
  )
}
