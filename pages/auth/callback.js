import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      // Obtener sesión actual del cliente
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error obteniendo sesión:', error)
        router.replace('/login')
        return
      }

      if (!session) {
        router.replace('/login')
        return
      }

      const userId = session.user.id

      // Verificar si el usuario ya tiene nombre
      const { data: profile } = await supabase
        .from('profiles2')
        .select('id,name')
        .eq('id', userId)
        .single()

      // Redirigir según si tiene nombre
      router.replace(profile?.name ? '/users' : '/setup-name')
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <p className="text-lg font-semibold">Redirigiendo...</p>
    </div>
  )
}
