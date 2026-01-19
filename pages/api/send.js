import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { to_user, content } = req.body

    if (!to_user || !content || !content.trim()) {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    // Inserta el mensaje en la tabla 'messages'
    const { error } = await supabase.from('messages').insert([
      {
        to_user,           // ID del usuario receptor (profiles2.id)
        content: content.trim(), // limpia espacios
      },
    ])

    if (error) {
      console.error('Error insertando mensaje:', error)
      return res.status(500).json({ error: 'Error al guardar el mensaje' })
    }

    return res.status(200).json({ message: 'Mensaje enviado' })
  } catch (err) {
    console.error('Error en API /send:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
