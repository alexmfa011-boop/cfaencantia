import { supabase } from '../lib/supabase'

export default function Login() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-12 rounded-2xl shadow-xl w-full max-w-md text-center">
        {/* Logo Encantia */}
        <img
          src="https://encantia.xyz/icons/logo.webp"
          alt="Encantia Logo"
          className="mx-auto w-20 h-20 mb-6"
        />

        {/* Título */}
        <h1 className="text-white text-2xl font-semibold mb-2">
          Bienvenido a CFA NGL
        </h1>

        <p className="text-gray-400 mb-8">
          Inicia sesión con Google para empezar a recibir mensajes anónimos.
        </p>

        {/* Botón con tu icono Google */}
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center w-full py-3 bg-blue-300 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
        >
          <img
            src="https://encantia.xyz/icons/google.webp"
            alt="Google Icon"
            className="w-6 h-6 mr-3"
          />
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
