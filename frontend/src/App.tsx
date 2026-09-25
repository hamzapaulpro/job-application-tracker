import Navbar from "./components/Navbar/Navbar.tsx";
import styles from './App.module.css'
import ApplicationsPage from "./features/applications/ApplicationsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Navigate, Route, Routes } from 'react-router'
import ApplicationDetailPage from "./features/applications/ApplicationDetailPage.tsx";
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
      <div className={styles.layout}>
          <a href="#main-content" className={styles.skipLink}>
              Skip to content
          </a>
          <Navbar />

          <main id="main-content" className={styles.main} tabIndex={-1}>
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
                      path="*"
                      element={<NotFoundPage />}
                  />
              </Routes>
          </main>

          <Footer/>
      </div>
  )
}

export default App