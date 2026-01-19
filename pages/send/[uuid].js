import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function Send() {
  const router = useRouter()
  const { uuid: toUser } = router.query
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Debes iniciar sesión')
      setLoading(false)
      return
    }

    const fromUser = session.user.id

    const { error } = await supabase.from('messages').insert({
      from_user: fromUser,
      to_user: toUser,
      content: message.trim()
    })

    if (error) {
      console.error(error)
      alert('No se pudo enviar el mensaje')
    } else {
      alert('Mensaje enviado!')
      setMessage('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-2xl mb-4">Enviar mensaje</h1>
      <textarea
        className="w-full max-w-md p-3 mb-4 rounded bg-gray-800 text-white"
        placeholder="Escribe tu mensaje..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 p-3 rounded w-full max-w-md font-semibold"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  )
}
