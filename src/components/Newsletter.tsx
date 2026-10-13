import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'

const KEY = 'forme.newsletter'

/** Simulated subscription — stores the address locally only. */
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>(() => {
    try {
      return localStorage.getItem(KEY) ? 'done' : 'idle'
    } catch {
      return 'idle'
    }
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState('error')
      return
    }
    setState('loading')
    window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, email.trim())
      } catch {
        /* ignore */
      }
      setState('done')
    }, 900)
  }

  return (
    <section className="bg-ivory-deep">
      <div className="container-x py-24 text-center md:py-32">
        <p className="eyebrow">The FORME. letter</p>
        <h2 className="display mx-auto mt-5 max-w-3xl text-balance text-[2.6rem] sm:text-6xl lg:text-7xl">A better sense of style, delivered.</h2>
        <p className="mx-auto mt-6 max-w-md text-ink/70">One considered email a week: a look worth wearing, a colour worth knowing and one idea to dress better.</p>

        {state === 'done' ? (
          <div className="animate-fade-up mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-full border border-olive/40 bg-olive/10 px-6 py-4 text-olive-deep">
            <Check size={18} /> You’re on the list — welcome to FORME.
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-10 max-w-xl" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (state === 'error') setState('idle')
                  }}
                  placeholder="Your email address"
                  autoComplete="email"
                  aria-invalid={state === 'error'}
                  className="h-[3.25rem] w-full rounded-full border border-charcoal/20 bg-paper px-6 text-[15px] outline-none transition-colors placeholder:text-ink/45 focus:border-charcoal aria-[invalid=true]:border-[#9b3b2f]"
                />
              </label>
              <button type="submit" disabled={state === 'loading'} className="btn btn-dark sm:min-w-40">
                {state === 'loading' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                ) : (
                  <>
                    Subscribe <ArrowRight size={16} className="btn-arrow" />
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 h-5 text-sm text-[#9b3b2f]" role="alert">
              {state === 'error' && 'Please enter a valid email address.'}
            </p>
          </form>
        )}
        <p className="mt-2 text-xs text-ink/50">Prototype only — no email is sent or stored outside this browser.</p>
      </div>
    </section>
  )
}
