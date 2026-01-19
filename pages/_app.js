import '../styles/globals.css'
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar visible en todas las páginas */}
      <Navbar />

      {/* Contenido de cada página */}
      <main className="pt-4 px-4">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
