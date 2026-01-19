import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [myId, setMyId] = useState(null)
  const [openedMessage, setOpenedMessage] = useState(null)
  const [readMessages, setReadMessages] = useState(() => {
    if (typeof window === 'undefined') return {}
    return JSON.parse(localStorage.getItem('readMessages') || '{}')
  })

  // Guardar leídos en localStorage
  useEffect(() => {
    localStorage.setItem('readMessages', JSON.stringify(readMessages))
  }, [readMessages])

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  // Cargar sesión y mensajes iniciales
  useEffect(() => {
    requestNotificationPermission()

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setMyId(session.user.id)

      const { data: msgs, error } = await supabase
        .from('messages')
        .select('id, content, created_at')
        .eq('to_user', session.user.id)
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else setMessages(msgs)
    }
    init()
  }, [])

  // Suscripción real-time
  useEffect(() => {
    if (!myId) return

    const subscription = supabase
      .channel('realtime-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `to_user=eq.${myId}`
      }, payload => {
        const newMsg = payload.new
        setMessages(prev => [newMsg, ...prev])

        // Notificación push
        if (Notification.permission === 'granted') {
          new Notification('CFA', {
            body: 'Tienes un nuevo mensaje en CFA 📩',
            icon: '/icons/logo.webp'
          })
        }

        // Reproducir sonido
        const audio = new Audio('https://encantia.xyz/sounds/notificacioncfa.mp3')
        audio.play().catch(e => console.log('No se pudo reproducir audio', e))
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [myId])

  const handleReveal = (msg) => {
    setReadMessages(prev => ({ ...prev, [msg.id]: true }))
    setOpenedMessage(msg)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      {messages.length === 0 ? (
        <p className="text-gray-400">No tienes mensajes aún 😶</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {messages.map(msg => {
            const isRead = readMessages[msg.id]
            return (
              <div
                key={msg.id}
                className={`bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition`}
                onClick={() => handleReveal(msg)}
              >
                <span className={isRead ? 'text-gray-200' : 'text-red-500 font-bold'}>
                  {isRead ? msg.content : '* Tienes un nuevo mensaje'}
                </span>
                <span className="text-gray-500 text-xs mt-2 block">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {openedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">De: @usuarioanonimo</h2>
            <p className="text-gray-200 mb-4">{openedMessage.content}</p>
            <p className="text-gray-500 text-sm">
              {new Date(openedMessage.created_at).toLocaleString()}
            </p>
            <button
              className="absolute top-2 right-2 text-red-500 font-bold text-lg"
              onClick={() => setOpenedMessage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
