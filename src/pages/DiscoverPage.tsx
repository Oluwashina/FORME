import { StyleGallery } from '../components/StyleGallery'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function DiscoverPage() {
  useDocumentTitle('Discover — FORME.')
  return (
    <div className="container-x pb-28 pt-12 md:pt-20">
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow mb-4">Discover</p>
        <h1 className="display text-[3rem] sm:text-6xl lg:text-7xl">
          Every look, <em className="italic text-olive">edited.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">
          Filter by aesthetic, occasion, clothing type, colour or formality — or just search for what you have in mind.
        </p>
      </header>
      <StyleGallery syncUrl />
    </div>
  )
}
