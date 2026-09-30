import Navbar from "./components/Navbar/Navbar.tsx";
import styles from './App.module.css'
import ApplicationsPage from "./features/applications/ApplicationsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Navigate, Route, Routes, useLocation } from 'react-router'
import ApplicationDetailPage from "./features/applications/ApplicationDetailPage.tsx";
import NotFoundPage from './pages/NotFoundPage'
import AboutPage from "./pages/AboutPage.tsx";
import CreateCvPage from "./features/cv/CreateCvPage.tsx";
import CreateCoverLetterPage from "./features/coverletter/CreateCoverLetterPage.tsx";

function App() {
    const isCvPage = useLocation().pathname === '/cv'
  return (
      <div className={styles.layout}>
          <a href="#main-content" className={styles.skipLink}>
              Skip to content
          </a>
          <Navbar />

          <main
              id="main-content"
              className={`${styles.main} ${isCvPage ? styles.mainWide : ''}`}
              tabIndex={-1}>
              <Routes>
                  <Route
                      path="/"
                      element={<Navigate to="/applications" replace /> }
                  />
                  <Route
                      path="/applications"
                      element={<ApplicationsPage />}
                  />
                  <Route
                      path="/applications/:id"
                      element={<ApplicationDetailPage />}
                  />
                  <Route
                      path="/cv"
                      element={<CreateCvPage />}
                  />
                  <Route
                      path="*"
                      element={<NotFoundPage />}
                  />
                  <Route
                      path="/about"
                      element={<AboutPage />}
                  />
                  <Route
                      path="/cover-letter/new"
                      element={<CreateCoverLetterPage />}
                  />
              </Routes>
          </main>

          <Footer/>
      </div>
  )
}

export default App