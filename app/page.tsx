'use client'

import React, { useState, useEffect } from 'react'

interface Changa {
  id: string
  titulo: string
  categoria: string
  descripcion: string
  precio: string
  barrio: string
  contacto: string
  fecha: string
  urgente: boolean
}

const CATEGORIAS = ['Todas', 'Plomería', 'Electricidad', 'Jardinería', 'Pintura', 'Albañilería', 'Limpieza', 'Otros']
const BARRIOS = ['Todos', 'Centro', 'Ariel del Plata', 'Siderca', 'La Josefa', 'Lubo', 'San Cayetano', 'Villanueva']

const CHANGAS_INICIALES: Changa[] = [
  {
    id: '1',
    titulo: 'Reparación de canilla en la cocina',
    categoria: 'Plomería',
    descripcion: 'Pierde agua la canilla monocomando de la cocina. Necesito arreglarlo hoy si es posible.',
    precio: '$15.000',
    barrio: 'Centro',
    contacto: '3489123456',
    fecha: 'Hace 2 horas',
    urgente: true,
  },
  {
    id: '2',
    titulo: 'Corte de pasto y limpieza de jardín',
    categoria: 'Jardinería',
    descripcion: 'Terreno de 10x20. Tengo máquina pero no funciona bien, mejor si traen herramientas.',
    precio: '$25.000',
    barrio: 'Ariel del Plata',
    contacto: '3489654321',
    fecha: 'Hace 5 horas',
    urgente: false,
  },
  {
    id: '3',
    titulo: 'Pintar habitación de 4x4',
    categoria: 'Pintura',
    descripcion: 'Solo mano de obra, las pinturas ya las compré. Paredes en buen estado.',
    precio: '$40.000',
    barrio: 'Siderca',
    contacto: '3489987654',
    fecha: 'Ayer',
    urgente: false,
  },
]

export default function Home() {
  const [changas, setChangas] = useState<Changa[]>(CHANGAS_INICIALES)
  const [categoriaSel, setCategoriaSel] = useState('Todas')
  const [barrioSel, setBarrioSel] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [modalPublicar, setModalPublicar] = useState(false)
  const [modalExito, setModalExito] = useState(false)

  // Formulario
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevaCategoria, setNuevaCategoria] = useState('Plomería')
  const [nuevaDesc, setNuevaDesc] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [nuevoBarrio, setNuevoBarrio] = useState('Centro')
  const [nuevoContacto, setNuevoContacto] = useState('')
  const [esUrgente, setEsUrgente] = useState(false)

  useEffect(() => {
    const guardadas = localStorage.getItem('changas_campana')
    if (guardadas) {
      try {
        setChangas(JSON.parse(guardadas))
      } catch (e) {
        console.error('Error al cargar publicaciones:', e)
      }
    }
  }, [])

  const guardarChangas = (nuevas: Changa[]) => {
    setChangas(nuevas)
    localStorage.setItem('changas_campana', JSON.stringify(nuevas))
  }

  const handlePublicar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoTitulo || !nuevaDesc || !nuevoContacto) return

    const nueva: Changa = {
      id: Date.now().toString(),
      titulo: nuevoTitulo,
      categoria: nuevaCategoria,
      descripcion: nuevaDesc,
      precio: nuevoPrecio || 'A convenir',
      barrio: nuevoBarrio,
      contacto: nuevoContacto,
      fecha: 'Recién',
      urgente: esUrgente,
    }

    const actualizadas = [nueva, ...changas]
    guardarChangas(actualizadas)

    setNuevoTitulo('')
    setNuevaDesc('')
    setNuevoPrecio('')
    setNuevoContacto('')
    setEsUrgente(false)
    setModalPublicar(false)
    setModalExito(true)
  }

  const changasFiltradas = changas.filter((c) => {
    const cumpleCat = categoriaSel === 'Todas' || c.categoria === categoriaSel
    const cumpleBarrio = barrioSel === 'Todos' || c.barrio === barrioSel
    const cumpleBusqueda =
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleCat && cumpleBarrio && cumpleBusqueda
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Encabezado */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-black tracking-tight">🔨 Changas Campana</span>
          <button
            onClick={() => setModalPublicar(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow text-xs sm:text-sm"
          >
            + Publicar Changa
          </button>
        </div>
      </header>

      {/* Portada */}
      <section className="bg-blue-700 text-white py-8 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">
            Encontrá u ofrecé trabajo rápido en Campana
          </h1>
          <p className="text-blue-100 text-xs sm:text-base mb-6">
            Conectamos vecinos para resolver arreglos y servicios del hogar.
          </p>

          <input
            type="text"
            placeholder="¿Qué necesitás arreglar? (ej: canilla, pasto, pintura)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 text-slate-800 rounded-xl focus:outline-none shadow-lg text-sm"
          />
        </div>
      </section>

      {/* Filtros y Contenido */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
          <div className="w-full overflow-x-auto pb-2 flex gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSel(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  categoriaSel === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 min-w-[180px] w-full md:w-auto">
            <label className="text-xs font-bold text-slate-500 uppercase">Barrio:</label>
            <select
              value={barrioSel}
              onChange={(e) => setBarrioSel(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none"
            >
              {BARRIOS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listado de tarjetas */}
        {changasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No hay changas que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {changasFiltradas.map((changa) => (
              <div
                key={changa.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-slate-200 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                      {changa.categoria}
                    </span>
                    {changa.urgente && (
                      <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        🚨 URGENTE
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-base text-slate-900 mb-2">{changa.titulo}</h2>
                  <p className="text-slate-600 text-xs mb-4">{changa.descripcion}</p>
                </div>

                <div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-xs text-slate-500 mb-3">
                    <span>📍 {changa.barrio}</span>
                    <span>🕒 {changa.fecha}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Presupuesto</span>
                      <span className="text-sm font-extrabold text-emerald-600">{changa.precio}</span>
                    </div>

                    <a
                      href={`https://wa.me/549${changa.contacto.replace(/\D/g, '')}?text=Hola!%20Te%20contacto%20por%20la%20changa:%20${encodeURIComponent(changa.titulo)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2 rounded-lg"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pie de página */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 text-xs mt-auto">
        <p>© 2026 Changas Campana</p>
      </footer>

      {/* Modal Publicar */}
      {modalPublicar && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-slate-800">Publicar Changa</h3>
              <button onClick={() => setModalPublicar(false)} className="text-slate-400 text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handlePublicar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Reparar portón de entrada"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría</label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    {CATEGORIAS.filter((c) => c !== 'Todas').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Barrio</label>
                  <select
                    value={nuevoBarrio}
                    onChange={(e) => setNuevoBarrio(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    {BARRIOS.filter((b) => b !== 'Todos').map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detallá el trabajo..."
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Presupuesto</label>
                  <input
                    type="text"
                    placeholder="Ej: $20.000"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 3489123456"
                    value={nuevoContacto}
                    onChange={(e) => setNuevoContacto(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgente"
                  checked={esUrgente}
                  onChange={(e) => setEsUrgente(e.target.checked)}
                />
                <label htmlFor="urgente" className="text-xs font-medium text-slate-700">
                  Marcar como URGENTE
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalPublicar(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Éxito */}
      {modalExito && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">¡Publicado con éxito!</h3>
            <p className="text-xs text-slate-600 mb-4">Tu anuncio ya se puede ver en la lista.</p>
            <button
              onClick={() => setModalExito(false)}
              className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
