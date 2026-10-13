import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFoundPage({ title = 'That page isn’t in the collection.' }: { title?: string }) {
  useDocumentTitle('Not found — FORME.')
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow mb-4">404</p>
      <h1 className="display max-w-2xl text-balance text-5xl sm:text-7xl">{title}</h1>
      <div className="mt-10 flex gap-3">
        <Link to="/" className="btn btn-dark">
          Back home
        </Link>
        <Link to="/discover" className="btn btn-line">
          Browse looks
        </Link>
      </div>
    </div>
  )
}
