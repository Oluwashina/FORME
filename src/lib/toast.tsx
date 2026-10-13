import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'

interface ToastApi {
  show: (message: string) => void
}

const Ctx = createContext<ToastApi>({ show: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((msg: string) => {
    setMessage(msg)
    setTick((t) => t + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(null), 2600)
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4"
      >
        {message && (
          <div
            key={tick}
            className="animate-sheet-in flex items-center gap-2.5 rounded-full bg-charcoal px-5 py-3 text-sm text-ivory shadow-[0_12px_40px_-12px_rgba(37,37,34,0.6)]"
          >
            <Check size={15} className="text-[#aab59a]" />
            {message}
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(Ctx)
