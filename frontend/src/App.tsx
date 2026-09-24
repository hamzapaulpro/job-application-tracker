import Navbar from "./components/Navbar/Navbar.tsx";
import styles from './App.module.css'
import ApplicationsPage from "./features/applications/ApplicationsPage.tsx";

function App() {
  return (
      <>
        <Navbar />

        <main className={styles.main}>
          <ApplicationsPage />
        </main>
      </>
  )
}

export default App