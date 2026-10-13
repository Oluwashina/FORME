import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navigation } from './components/Navigation'
import { SavedProvider } from './lib/saved'
import { ToastProvider } from './lib/toast'
import { BuildAroundPage } from './pages/BuildAroundPage'
import { ColorLabPage } from './pages/ColorLabPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { GuideDetailPage, GuidesPage } from './pages/GuidesPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OccasionsPage } from './pages/OccasionsPage'
import { OutfitPage } from './pages/OutfitPage'
import { QaPage } from './pages/QaPage'
import { QuizPage } from './pages/QuizPage'
import { SavedPage } from './pages/SavedPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SavedProvider>
          <ScrollToTop />
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory">
            Skip to content
          </a>
          <Navigation />
          <main id="main" className="min-h-[70vh]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/look/:id" element={<OutfitPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:id" element={<GuideDetailPage />} />
              <Route path="/color-lab" element={<ColorLabPage />} />
              <Route path="/occasions" element={<OccasionsPage />} />
              <Route path="/build" element={<BuildAroundPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/qa" element={<QaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </SavedProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
