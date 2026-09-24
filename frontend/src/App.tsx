import Navbar from "./components/Navbar/Navbar.tsx";
import styles from './App.module.css'
import ApplicationsPage from "./features/applications/ApplicationsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Navigate, Route, Routes } from 'react-router'
import ApplicationDetailPage from "./features/applications/ApplicationDetailPage.tsx";

function App() {
  return (
      <div className={styles.layout}>
          <Navbar />

          <main className={styles.main}>
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
              </Routes>
          </main>

          <Footer/>
      </div>
  )
}

export default App