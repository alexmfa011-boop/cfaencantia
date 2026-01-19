import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      // No logueado
      if (!data.session) {
        location.href = '/login'
        return
      }

      const user = data.session.user

      // Ver si tiene profile2
      const { data: profile2 } = await supabase
        .from('profiles2')
        .select('id')
        .eq('id', user.id)
        .single()

      // No tiene name
      if (!profile2) {
        location.href = '/setup-name'
      } else {
        location.href = '/inbox'
      }
    })
  }, [])

  return <p>Cargando...</p>
}
