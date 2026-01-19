import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Users({ users, myId }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users
          .filter(u => u.id !== myId)
          .map(user => (
            <li
              key={user.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition"
            >
              <span className="font-semibold">@{user.name}</span>
              <Link
                href={`/send/${user.id}`}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
              >
                Enviar mensaje
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  // Supón que tienes sesión y tu uuid está en session.user.id
  const myId = req.cookies['supabase-auth-token'] ? JSON.parse(req.cookies['supabase-auth-token'])[0].user.id : null

  const { data } = await supabase.from('profiles2').select('id,name')
  return { props: { users: data, myId } }
}
