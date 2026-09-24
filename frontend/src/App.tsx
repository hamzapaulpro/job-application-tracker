import Navbar from "./components/Navbar/Navbar.tsx";
import styles from './App.module.css'
import ApplicationsPage from "./features/applications/ApplicationsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";

function App() {
  return (
      <div className={styles.layout}>
          <Navbar />

          <main className={styles.main}>
              <ApplicationsPage />
          </main>

          <Footer/>
      </div>
  )
}

export default App