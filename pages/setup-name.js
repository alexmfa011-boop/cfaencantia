import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function SetupName() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // Opcional: redirigir si ya tienes name
  useEffect(() => {
    const checkName = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const userId = session.user.id
      const { data: profile } = await supabase
        .from('profiles2')
        .select('name')
        .eq('id', userId)
        .single()
      if (profile?.name) {
        router.push('/users') // o a inbox si quieres
      }
    }
    checkName()
  }, [router])

  const saveName = async () => {
    if (!name.trim()) return alert('Escribe un nombre')

    try {
      setLoading(true)

      // Obtener sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Debes iniciar sesión primero')
        setLoading(false)
        return
      }
      const userId = session.user.id

      // Verificar que el nombre no exista
      const { data: existing } = await supabase
        .from('profiles2')
        .select('id')
        .eq('name', name.trim())
        .limit(1)
        .single()

      if (existing) {
        alert('Ese nombre ya existe, elige otro')
        setLoading(false)
        return
      }

      // Insertar en profiles2
      const { error } = await supabase.from('profiles2').insert({
        id: userId,
        name: name.trim()
      })

      if (error) throw error

      setLoading(false)
      router.push('/users') // o inbox
    } catch (err) {
      console.error('Error guardando nombre:', err)
      alert('No se pudo guardar el nombre')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Configura tu nombre</h1>
        <input
          type="text"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe tu nombre..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          className={`w-full p-3 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={saveName}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar nombre'}
        </button>
      </div>
    </div>
  )
}
