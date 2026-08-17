'use client';

import React, { useState, useEffect } from 'react';

const AVATAR_DEFECTO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2364748b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';

const ADMIN_EMAIL = 'yedrofausto31@gmail.com';

interface Changa {
  id: number;
  usuarioNombre: string;
  usuarioEmail?: string;
  titulo: string;
  categoria: string;
  barrio: string;
  pago: string;
  tipoPago: 'hora' | 'dia' | 'servicio';
  montoPago: string;
  telefono: string;
  email: string;
  descripcion: string;
  avatar: string;
  fijadoHasta?: number;
}

interface ItemGuardado {
  changa: Changa;
  eliminado: boolean;
  timestampEliminado?: number;
}

export default function ChangasCampana() {
  const [categoriaSel, setCategoriaSel] = useState('');
  const [barrioSel, setBarrioSel] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [changaDetalle, setChangaDetalle] = useState<Changa | null>(null);

  // Modales
  const [modalAyuda, setModalAyuda] = useState(false);
  const [modalPublicar, setModalPublicar] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalAjustes, setModalAjustes] = useState(false);
  const [modalGuardados, setModalGuardados] = useState(false);
  const [modalMisPublicaciones, setModalMisPublicaciones] = useState(false);
  const [modalAdminPanel, setModalAdminPanel] = useState(false);
  const [modalPremium, setModalPremium] = useState(false);
  const [mensajeAuthReq, setMensajeAuthReq] = useState<string | null>(null);

  // Modal Reporte
  const [changaReportando, setChangaReportando] = useState<Changa | null>(null);
  const [razonReporte, setRazonReporte] = useState('Contenido inapropiado o engañoso');
  const [descReporte, setDescReporte] = useState('');

  const [menuDesplegableActivo, setMenuDesplegableActivo] = useState<number | null>(null);

  // Estado para Edición
  const [changaEditando, setChangaEditando] = useState<Changa | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editBarrio, setEditBarrio] = useState('');
  const [editTipoPago, setEditTipoPago] = useState<'hora' | 'dia' | 'servicio'>('hora');
  const [editPago, setEditPago] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Estados persistentes
  const [changas, setChangas] = useState<Changa[]>([]);
  const [guardados, setGuardados] = useState<ItemGuardado[]>([]);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<{
    nombre: string;
    email: string;
    barrio: string;
    fechaNac: string;
    avatar: string;
  } | null>(null);

  // Flags de hidratación y carga
  const [isLoaded, setIsLoaded] = useState(false);
  const [ahora, setAhora] = useState<number>(Date.now());

  // Form Errores
  const [errorLogin, setErrorLogin] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');

  // Form Registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regFechaNac, setRegFechaNac] = useState('');
  const [regBarrio, setRegBarrio] = useState('Centro');

  // Form Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Form Nueva Changa
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Albañilería');
  const [nuevoBarrio, setNuevoBarrio] = useState('Centro');
  const [tipoPagoSel, setTipoPagoSel] = useState<'hora' | 'dia' | 'servicio'>('hora');
  const [nuevoPago, setNuevoPago] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');

  const esAdmin = usuario?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const categoriasDisponibles = [
    'Albañilería',
    'Poda de césped',
    'Limpieza de terreno',
    'Servicios Informáticos',
    'Servicios Técnicos',
    'Mecánica',
    'Cuidador',
    'Niñera',
    'Mensajero',
    'Repartidor',
    'Gastronomía y Eventos',
    'Mantenimiento General',
    'Varios',
  ];

  const barriosCampana = [
    'Centro',
    'Ariel del Plata',
    'Dallera',
    'Del Pino',
    'Don Francisco',
    'El Destino',
    'Malvinas',
    'La Argentina',
    'La Esperanza',
    'La Josefa',
    'Las Acacias',
    'Las Campanas',
    'Las Praderas',
    'Lubo',
    'San Cayetano',
    'San Felipe',
    'San Jacinto',
    'San Jorge',
    'San Luciano',
    'Santa Brígida',
    'Santa Florentina',
    'Santa Lucía',
    'Siderca',
    'Urquiza',
    'Villanueva',
    '9 de Julio',
    'Otamendi',
  ];

  const obtenerUrlGmail = (email: string, titulo: string) => {
    const asunto = encodeURIComponent(`Consulta por changa: ${titulo}`);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${asunto}`;
  };

  useEffect(() => {
    try {
      const changasLocal = localStorage.getItem('changas_campana_v3');
      if (changasLocal) {
        const parsed = JSON.parse(changasLocal);
        setChangas(Array.isArray(parsed) ? parsed : []);
      } else {
        setChangas([]);
      }

      const usuariosLocal = localStorage.getItem('usuarios_campana_v3');
      if (usuariosLocal) setUsuariosRegistrados(JSON.parse(usuariosLocal));

      const sesionLocal = localStorage.getItem('usuario_sesion_v3');
      if (sesionLocal) {
        const u = JSON.parse(sesionLocal);
        setUsuario(u);
      }
    } catch (error) {
      console.error('Error cargando localStorage:', error);
      setChangas([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (usuario?.email) {
      const key = `anuncios_guardados_v3_${usuario.email.trim().toLowerCase()}`;
      const guardadosLocal = localStorage.getItem(key);
      if (guardadosLocal) {
        try {
          setGuardados(JSON.parse(guardadosLocal));
        } catch (e) {
          setGuardados([]);
        }
      } else {
        setGuardados([]);
      }
    } else {
      setGuardados([]);
    }
  }, [usuario, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('changas_campana_v3', JSON.stringify(changas));
    } catch (e) {
      console.error('Error guardando changas:', e);
    }
  }, [changas, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !usuario?.email) return;
    try {
      const key = `anuncios_guardados_v3_${usuario.email.trim().toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(guardados));
    } catch (e) {}
  }, [guardados, usuario, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('usuarios_campana_v3', JSON.stringify(usuariosRegistrados));
    } catch (e) {}
  }, [usuariosRegistrados, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (usuario) {
        localStorage.setItem('usuario_sesion_v3', JSON.stringify(usuario));
      } else {
        localStorage.removeItem('usuario_sesion_v3');
      }
    } catch (e) {}
  }, [usuario, isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      const tiempoActual = Date.now();
      setAhora(tiempoActual);

      setGuardados((prev) =>
        prev.filter((item) => {
          if (item.eliminado && item.timestampEliminado) {
            return tiempoActual - item.timestampEliminado < 3600000;
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAbrirPublicar = () => {
    if (!usuario) {
      setMensajeAuthReq(
        '¡Tenés que estar registrado/a para publicar! ¿Qué estás esperando para hacerlo? ¡No toma más de 5 segundos!'
      );
      return;
    }
    setModalPublicar(true);
  };

  const handleVerMas = (changa: Changa) => {
    if (!usuario) {
      setMensajeAuthReq(
        '¡Por favor, iniciá sesión o registrate para ver más información sobre esta changuita!'
      );
      return;
    }
    setChangaDetalle(changa);
  };

  const handleContactarChanga = (e: React.MouseEvent, url: string) => {
    if (!usuario) {
      e.preventDefault();
      setMensajeAuthReq(
        '¡Por favor, iniciá sesión o registrate para ver más información sobre esta changuita!'
      );
      return;
    }
    window.open(url, '_blank');
  };

  const handleToggleGuardarChanga = (changa: Changa) => {
    if (!usuario) {
      setMensajeAuthReq(
        '¡Por favor, iniciá sesión o registrate para guardar esta publicación!'
      );
      setMenuDesplegableActivo(null);
      return;
    }
    toggleGuardarChanga(changa);
  };

  const handleAbrirReporte = (changa: Changa) => {
    if (!usuario) {
      setMensajeAuthReq('¡Debes estar registrado e iniciar sesión para reportar una publicación!');
      setMenuDesplegableActivo(null);
      return;
    }
    setChangaReportando(changa);
    setRazonReporte('Contenido inapropiado o engañoso');
    setDescReporte('');
    setMenuDesplegableActivo(null);
  };

  const handleEnviarReporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changaReportando || !usuario) return;

    const asunto = encodeURIComponent(`[REPORTE DE ANUNCIO] ${changaReportando.titulo}`);
    const cuerpo = encodeURIComponent(
      `REPORTE DE PUBLICACIÓN EN CHANGAS CAMPANA\n` +
        `-----------------------------------------\n` +
        `📌 Título del Anuncio: ${changaReportando.titulo} (ID: ${changaReportando.id})\n` +
        `👤 Publicado por: ${changaReportando.usuarioNombre} (${changaReportando.usuarioEmail || 'Sin mail'})\n` +
        `📍 Barrio: ${changaReportando.barrio}\n\n` +
        `⚠️ Razón del reporte: ${razonReporte}\n` +
        `📝 Descripción del problema: ${descReporte}\n\n` +
        `👤 Reportado por: ${usuario.nombre} (${usuario.email})`
    );

    const urlGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${ADMIN_EMAIL}&su=${asunto}&body=${cuerpo}`;
    window.open(urlGmail, '_blank');

    setChangaReportando(null);
    setRazonReporte('Contenido inapropiado o engañoso');
    setDescReporte('');
  };

  const abrirEditarAviso = (changa: Changa) => {
    setChangaEditando(changa);
    setEditTitulo(changa.titulo);
    setEditCategoria(changa.categoria);
    setEditBarrio(changa.barrio);
    setEditTipoPago(changa.tipoPago || 'hora');
    setEditPago(changa.montoPago || '');
    setEditTelefono(changa.telefono || '');
    setEditEmail(changa.email || '');
    setEditDesc(changa.descripcion);
    setMenuDesplegableActivo(null);
  };

  const guardarEdicionAviso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changaEditando) return;

    let pagoTexto = '';
    if (editTipoPago === 'servicio') {
      pagoTexto = 'ANUNCIO DE SERVICIO';
    } else {
      const textoTipoPago = editTipoPago === 'hora' ? 'Hora' : 'Día';
      pagoTexto = `$${editPago} / ${textoTipoPago}`;
    }

    const changaActualizada: Changa = {
      ...changaEditando,
      titulo: editTitulo.toUpperCase(),
      categoria: editCategoria,
      barrio: editBarrio,
      tipoPago: editTipoPago,
      montoPago: editTipoPago === 'servicio' ? '0' : editPago,
      pago: pagoTexto,
      telefono: editTelefono,
      email: editEmail,
      descripcion: editDesc,
    };

    setChangas((prev) =>
      prev.map((c) => (c.id === changaEditando.id ? changaActualizada : c))
    );

    setGuardados((prev) =>
      prev.map((item) =>
        item.changa.id === changaEditando.id
          ? { ...item, changa: changaActualizada }
          : item
      )
    );

    if (changaDetalle?.id === changaEditando.id) {
      setChangaDetalle(changaActualizada);
    }

    setChangaEditando(null);
  };

  const agregarChanga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo || (tipoPagoSel !== 'servicio' && !nuevoPago) || !nuevaDesc || (!nuevoTelefono && !nuevoEmail))
      return;

    let pagoTexto = '';
    if (tipoPagoSel === 'servicio') {
      pagoTexto = 'ANUNCIO DE SERVICIO';
    } else {
      const textoTipoPago = tipoPagoSel === 'hora' ? 'Hora' : 'Día';
      pagoTexto = `$${nuevoPago} / ${textoTipoPago}`;
    }

    const nueva: Changa = {
      id: Date.now(),
      usuarioNombre: usuario ? usuario.nombre : 'Usuario de Campana',
      usuarioEmail: usuario ? usuario.email : 'anonimo@campana.com',
      titulo: nuevoTitulo.toUpperCase(),
      categoria: nuevaCategoria,
      barrio: nuevoBarrio,
      pago: pagoTexto,
      tipoPago: tipoPagoSel,
      montoPago: tipoPagoSel === 'servicio' ? '0' : nuevoPago,
      telefono: nuevoTelefono,
      email: nuevoEmail || (usuario ? usuario.email : ''),
      descripcion: nuevaDesc,
      avatar: usuario?.avatar || AVATAR_DEFECTO,
    };

    setChangas((prevChangas) => [nueva, ...prevChangas]);

    setNuevoTitulo('');
    setNuevoPago('');
    setNuevoTelefono('');
    setNuevoEmail('');
    setNuevaDesc('');
    setModalPublicar(false);
  };

  const eliminarMiPublicacion = (id: number) => {
    setChangas((prev) => prev.filter((c) => c.id !== id));
    setGuardados((prev) => prev.filter((g) => g.changa.id !== id));

    if (changaDetalle?.id === id) setChangaDetalle(null);
  };

  const fijarChangaAdmin = (id: number, dias: number) => {
    const timestampHasta = Date.now() + dias * 24 * 60 * 60 * 1000;
    setChangas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, fijadoHasta: timestampHasta } : c))
    );
  };

  const desfijarChangaAdmin = (id: number) => {
    setChangas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, fijadoHasta: undefined } : c))
    );
  };

  const eliminarUsuarioAdmin = (email: string) => {
    setUsuariosRegistrados((prev) => prev.filter((u) => u.email !== email));
    setChangas((prev) => prev.filter((c) => c.usuarioEmail !== email));
  };

  const toggleGuardarChanga = (changa: Changa) => {
    setGuardados((prev) => {
      const existe = prev.find((item) => item.changa.id === changa.id);
      if (existe) {
        return prev.filter((item) => item.changa.id !== changa.id);
      } else {
        return [...prev, { changa: { ...changa }, eliminado: false }];
      }
    });
    setMenuDesplegableActivo(null);
  };

  const marcarComoEliminado = (id: number) => {
    setGuardados((prev) =>
      prev.map((item) =>
        item.changa.id === id ? { ...item, eliminado: true, timestampEliminado: Date.now() } : item
      )
    );
  };

  const restaurarAnuncio = (id: number) => {
    setGuardados((prev) =>
      prev.map((item) =>
        item.changa.id === id ? { ...item, eliminado: false, timestampEliminado: undefined } : item
      )
    );
  };

  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorRegistro('');
    if (!regNombre || !regEmail || !regPass || !regFechaNac) return;

    const existe = usuariosRegistrados.some(
      (u) => u.email.trim().toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (existe) {
      setErrorRegistro('¡Este mail ya está registrado!');
      return;
    }

    const nuevoUsuario = {
      nombre: regNombre.trim(),
      email: regEmail.trim().toLowerCase(),
      pass: regPass,
      barrio: regBarrio,
      fechaNac: regFechaNac,
      avatar: AVATAR_DEFECTO,
    };

    setUsuariosRegistrados((prev) => [...prev, nuevoUsuario]);
    const { pass, ...datosSesion } = nuevoUsuario;
    setUsuario(datosSesion);

    setModalRegistro(false);
    setRegNombre('');
    setRegEmail('');
    setRegPass('');
    setRegFechaNac('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');

    const cuentaEncontrada = usuariosRegistrados.find(
      (u) => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase() && u.pass === loginPass
    );

    if (!cuentaEncontrada) {
      setErrorLogin('Email o contraseña incorrectos.');
      return;
    }

    const { pass, ...datosSesion } = cuentaEncontrada;
    setUsuario(datosSesion);

    setModalLogin(false);
    setLoginEmail('');
    setLoginPass('');
  };

  const handleCerrarSesion = () => {
    setUsuario(null);
    setGuardados([]);
    setModalAjustes(false);
    setModalMisPublicaciones(false);
    setModalAdminPanel(false);
    setModalGuardados(false);
    setModalPremium(false);
  };

  const handleCambiarAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const archivo = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 80;
          canvas.height = 80;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, 80, 80);

          const base64Avatar = canvas.toDataURL('image/jpeg', 0.5);

          if (usuario) {
            const usuarioActualizado = { ...usuario, avatar: base64Avatar };
            setUsuario(usuarioActualizado);

            setUsuariosRegistrados((prev) =>
              prev.map((u) =>
                u.email.toLowerCase() === usuario.email.toLowerCase() ? { ...u, avatar: base64Avatar } : u
              )
            );

            setChangas((prev) =>
              prev.map((ch) =>
                ch.usuarioEmail === usuario.email || ch.usuarioNombre === usuario.nombre
                  ? { ...ch, avatar: base64Avatar }
                  : ch
              )
            );
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  };

  const changasFiltradas = changas
    .filter((c) => {
      const coincideCat = categoriaSel === '' || c.categoria === categoriaSel;
      const coincideBarrio = barrioSel === '' || c.barrio === barrioSel;
      const coincideTexto =
        busqueda === '' ||
        c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.usuarioNombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCat && coincideBarrio && coincideTexto;
    })
    .sort((a, b) => {
      const aFijada = a.fijadoHasta && a.fijadoHasta > ahora ? 1 : 0;
      const bFijada = b.fijadoHasta && b.fijadoHasta > ahora ? 1 : 0;
      if (aFijada !== bFijada) return bFijada - aFijada;
      return b.id - a.id;
    });

  const misPublicaciones = changas.filter(
    (c) => usuario && (c.usuarioEmail === usuario.email || c.usuarioNombre === usuario.nombre)
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <style>{`
        @keyframes premiumGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.6), 0 0 5px rgba(245, 158, 11, 0.3);
            border-color: #f59e0b;
          }
          50% {
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.9), 0 0 10px rgba(251, 191, 36, 0.6);
            border-color: #fbbf24;
          }
        }
        .animate-premium-glow {
          animation: premiumGlow 2.2s infinite ease-in-out;
        }
      `}</style>

      {/* HEADER ELEGANTE Y TOTALMENTE RESPONSIVO */}
      <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-xl border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0 group transition-transform active:scale-95"
            onClick={() => {
              setCategoriaSel('');
              setBarrioSel('');
              setBusqueda('');
            }}
          >
            <div className="bg-blue-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-white font-bold text-lg sm:text-xl shadow-md group-hover:rotate-6 transition-transform">
              📍
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                CHANGAS<span className="text-sky-400">CAMPANA</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Portal Local
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            {esAdmin && (
              <button
                onClick={() => setModalAdminPanel(true)}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-red-900/20 border border-red-400/30 animate-pulse transition-all"
              >
                <span>🛡️</span>
                <span className="hidden sm:inline">PANEL ADMIN</span>
              </button>
            )}

            <button
              onClick={() => setModalAyuda(true)}
              className="bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white active:scale-95 font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <span>❓</span>
              <span className="hidden md:inline">¿CÓMO USAR?</span>
            </button>

            {/* Guardados sólo aparece si hay usuario logueado */}
            {usuario && (
              <button
                onClick={() => setModalGuardados(true)}
                className="bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white active:scale-95 font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition-all relative"
              >
                <span>📌</span>
                <span className="hidden sm:inline">GUARDADOS</span>
                {guardados.filter((g) => !g.eliminado).length > 0 && (
                  <span className="bg-blue-500 text-white font-black rounded-full text-[10px] w-4 h-4 flex items-center justify-center shadow-sm">
                    {guardados.filter((g) => !g.eliminado).length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleAbrirPublicar}
              className="bg-blue-600 hover:bg-blue-500 text-white active:scale-95 font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all shrink-0"
            >
              PUBLICAR
            </button>

            {usuario ? (
              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-800 pl-1.5 sm:pl-3">
                <button
                  onClick={() => setModalPremium(true)}
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <span>👑</span>
                  <span className="hidden xl:inline">PREMIUM - ¡IMPULSÁ TUS ANUNCIOS!</span>
                  <span className="xl:hidden">PREMIUM</span>
                </button>

                <button
                  onClick={() => setModalMisPublicaciones(true)}
                  className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs border border-slate-700 transition-all active:scale-95"
                  title="Mis publicaciones"
                >
                  <span>📋</span>
                  <span className="hidden md:inline">MIS PUBLICACIONES</span>
                  <span className="bg-blue-600 text-white rounded-full text-[10px] px-1.5 py-0.5 font-black shadow-sm">
                    {misPublicaciones.length}
                  </span>
                </button>

                <button
                  onClick={() => setModalAjustes(true)}
                  className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-700 transition-all active:scale-95 shrink-0"
                >
                  <img src={usuario.avatar} alt="Perfil" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover bg-slate-300 border border-slate-500" />
                  <span className="text-[11px] sm:text-xs font-bold text-white max-w-[60px] sm:max-w-[80px] truncate">{usuario.nombre}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-800 pl-1.5 sm:pl-3">
                <button
                  onClick={() => setModalLogin(true)}
                  className="text-[11px] sm:text-xs font-bold text-white border border-slate-700 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-slate-800 active:scale-95 transition-all"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setModalRegistro(true)}
                  className="text-[11px] sm:text-xs font-bold bg-white text-slate-900 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full hover:bg-slate-200 shadow-sm active:scale-95 transition-all"
                >
                  Registro
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO RESPONSIVO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 sm:py-14 px-4 shadow-inner">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            CONECTÁ CON VECINOS DE CAMPANA
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl font-normal leading-relaxed">
            Ofrecé tus servicios o encontrá trabajos en tu barrio rápidamente y sin intermediarios.
          </p>
          <div className="flex gap-2 max-w-md pt-1 sm:pt-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar por trabajo, profesional o rubro..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-md text-slate-900 pl-4 pr-10 py-3 rounded-2xl text-xs sm:text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm sm:text-base">🔍</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT RESPONSIVO */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 flex-1">
        
        {/* FILTROS EN MOBILE PRIMERO O ASIDE */}
        <aside className="lg:col-span-1 space-y-6 lg:order-2">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4 lg:sticky lg:top-20">
            <h4 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>⚙️</span> FILTRAR
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Categoría</label>
              <select
                value={categoriaSel}
                onChange={(e) => setCategoriaSel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Todas las categorías</option>
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Barrio</label>
              <div className="space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto pr-1 select-none custom-scrollbar">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="barrio"
                    checked={barrioSel === ''}
                    onChange={() => setBarrioSel('')}
                    className="accent-blue-600"
                  />
                  Todos los barrios
                </label>
                {barriosCampana.map((b, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="barrio"
                      checked={barrioSel === b}
                      onChange={() => setBarrioSel(b)}
                      className="accent-blue-600"
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PUBLICACIONES */}
        <section className="lg:col-span-3 space-y-6 lg:order-1">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">PUBLICACIONES DE LA COMUNIDAD</h3>
            <span className="text-xs bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-full border border-slate-300 shadow-sm shrink-0">
              {changasFiltradas.length} avisos
            </span>
          </div>

          {!isLoaded ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-500 text-sm font-medium">Cargando publicaciones...</p>
            </div>
          ) : changasFiltradas.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl text-center border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl sm:text-3xl shadow-inner">📢</div>
              <h4 className="text-base sm:text-lg font-black text-slate-800">Todavía no hay publicaciones</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Sé el primero en ofrecer un servicio o buscar trabajadores en la zona de Campana.
              </p>
              <button
                onClick={handleAbrirPublicar}
                className="bg-blue-600 text-white font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs shadow-md hover:bg-blue-500 hover:shadow-lg active:scale-95 transition-all mt-2"
              >
                CREAR LA PRIMERA PUBLICACIÓN
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {changasFiltradas.map((changa) => {
                const estaGuardada = guardados.some((g) => g.changa.id === changa.id && !g.eliminado);
                const esMio =
                  usuario &&
                  (changa.usuarioEmail === usuario.email || changa.usuarioNombre === usuario.nombre);
                const esFijada = changa.fijadoHasta && changa.fijadoHasta > ahora;

                return (
                  <div
                    key={changa.id}
                    className={`group relative bg-white rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                      esFijada
                        ? 'animate-premium-glow border-2 border-amber-400 bg-amber-50/10'
                        : esMio
                        ? 'border border-blue-500 ring-2 ring-blue-500/20 shadow-sm hover:shadow-xl hover:-translate-y-1'
                        : 'border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuDesplegableActivo(menuDesplegableActivo === changa.id ? null : changa.id);
                        }}
                        className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {menuDesplegableActivo === changa.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 py-1.5 z-20 transition-all duration-200">
                          <button
                            onClick={() => handleToggleGuardarChanga(changa)}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                          >
                            <span>{estaGuardada ? '📌 Quitar de Guardados' : '🔖 Guardar aviso'}</span>
                          </button>

                          <button
                            onClick={() => handleAbrirReporte(changa)}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 border-t border-slate-100 flex items-center gap-2 transition-colors"
                          >
                            <span>⚠️ Reportar Anuncio</span>
                          </button>

                          {(esMio || esAdmin) && (
                            <>
                              <button
                                onClick={() => abrirEditarAviso(changa)}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 border-t border-slate-100 flex items-center gap-2 transition-colors"
                              >
                                <span>✏️ Editar aviso</span>
                              </button>
                              <button
                                onClick={() => {
                                  eliminarMiPublicacion(changa.id);
                                  setMenuDesplegableActivo(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-slate-100 flex items-center gap-2 transition-colors"
                              >
                                <span>🗑️ Eliminar aviso</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      {esFijada && (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full mb-2 shadow-sm tracking-wider uppercase">
                          👑 PREMIUM
                        </span>
                      )}

                      {esMio && !esFijada && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full mb-2 shadow-2xs">
                          🏷️ MI PUBLICACIÓN
                        </span>
                      )}

                      <div className="flex items-center gap-2.5 sm:gap-3 mb-3 pr-8">
                        <img
                          src={changa.avatar}
                          alt={changa.usuarioNombre}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-300 bg-slate-100 shrink-0 shadow-sm"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">👤 {changa.usuarioNombre}</p>
                          <span className="text-[10px] font-bold text-slate-700 uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md inline-block truncate max-w-full">
                            🔨 {changa.categoria}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors">{changa.titulo}</h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{changa.descripcion}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-2.5 flex items-center gap-1">📍 Barrio: {changa.barrio}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="bg-blue-50 border border-blue-200/80 rounded-xl px-3 py-2 text-center shadow-2xs">
                        <span className="text-xs font-black text-blue-900 uppercase tracking-wide">
                          {changa.tipoPago === 'servicio' || changa.pago.includes('ANUNCIO')
                            ? 'ANUNCIO DE SERVICIO'
                            : `PAGO: ${changa.pago}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleVerMas(changa)}
                          className="w-full text-xs font-bold text-blue-700 border border-blue-200 py-2.5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all"
                        >
                          VER MÁS
                        </button>
                        {changa.telefono ? (
                          <button
                            onClick={(e) =>
                              handleContactarChanga(
                                e,
                                `https://wa.me/549${changa.telefono.replace(/\D/g, '')}`
                              )
                            }
                            className="w-full text-center text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
                          >
                            WHATSAPP
                          </button>
                        ) : (
                          <button
                            onClick={(e) =>
                              handleContactarChanga(
                                e,
                                obtenerUrlGmail(changa.email, changa.titulo)
                              )
                            }
                            className="w-full text-center text-xs font-bold bg-slate-900 text-white py-2.5 rounded-xl hover:bg-slate-800 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1"
                          >
                            GMAIL
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* MODAL PREMIUM INFORMACIÓN */}
      {modalPremium && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[75] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-amber-600 flex items-center gap-2">
                <span>👑</span> Anuncios Premium
              </h3>
              <button
                onClick={() => setModalPremium(false)}
                className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              La función Premium está pensada para dar mucha más visibilidad a tus publicaciones, fijándolas al inicio de la página principal con un impresionante brillo animado.
            </p>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Planes de Fijación</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-amber-50 border border-amber-200/80 p-2.5 sm:p-3 rounded-2xl text-center">
                  <p className="text-xs font-black text-amber-900">3 DÍAS</p>
                  <p className="text-xs sm:text-sm font-black text-amber-600 mt-1">$1.500</p>
                </div>
                <div className="bg-amber-50 border border-amber-200/80 p-2.5 sm:p-3 rounded-2xl text-center relative overflow-hidden">
                  <span className="absolute top-0 right-0 bg-amber-500 text-[8px] font-black text-slate-950 px-1 py-0.2 rounded-bl">POPULAR</span>
                  <p className="text-xs font-black text-amber-900">1 SEMANA</p>
                  <p className="text-xs sm:text-sm font-black text-amber-600 mt-1">$3.000</p>
                </div>
                <div className="bg-amber-50 border border-amber-200/80 p-2.5 sm:p-3 rounded-2xl text-center">
                  <p className="text-xs font-black text-amber-900">1 MES</p>
                  <p className="text-xs sm:text-sm font-black text-amber-600 mt-1">$6.500</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600">Método de Pago:</span>
                <span className="font-black text-blue-600">MercadoPago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600">Alias MP:</span>
                <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 select-all">changas.campana</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-400/40 p-3.5 rounded-2xl text-xs text-amber-900 leading-snug">
              <p className="font-bold">
                ¡Una vez abonado el pago, enviar comprobante al siguiente número para acreditar el premium y mantener tu publicación fijada!
              </p>
            </div>

            <a
              href="https://wa.me/543489488970"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>💬 Enviar comprobante al +54 3489 488970</span>
            </a>

            <button
              onClick={() => setModalPremium(false)}
              className="w-full text-xs font-bold border border-slate-300 py-2.5 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* MODAL REPORTAR ANUNCIO */}
      {changaReportando && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[85] overflow-y-auto">
          <form onSubmit={handleEnviarReporte} className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg text-amber-600 flex items-center gap-2">
                <span>⚠️</span> Reportar Anuncio
              </h3>
              <button
                type="button"
                onClick={() => setChangaReportando(null)}
                className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-2xl text-xs text-amber-900 font-medium">
              Anuncio: <strong>{changaReportando.titulo}</strong>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Razón del reporte</label>
              <select
                value={razonReporte}
                onChange={(e) => setRazonReporte(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="Contenido inapropiado o engañoso">Contenido inapropiado o engañoso</option>
                <option value="Información falsa o estafa">Información falsa o estafa</option>
                <option value="Servicio/Changa no permitido">Servicio/Changa no permitido</option>
                <option value="Spam o publicación duplicada">Spam o publicación duplicada</option>
                <option value="Otro motivo">Otro motivo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Descripción detallada</label>
              <textarea
                placeholder="Explicá brevemente el motivo del reporte..."
                value={descReporte}
                onChange={(e) => setDescReporte(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs h-24 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setChangaReportando(null)}
                className="w-full text-xs font-bold border border-slate-200 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white py-3 rounded-xl transition-all shadow-md shadow-amber-600/20"
              >
                ENVIAR REPORTE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL PANEL ADMIN */}
      {modalAdminPanel && esAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[90] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col border border-slate-100 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-red-600 flex items-center gap-2">
                <span>🛡️</span> Panel de Administración
              </h3>
              <button
                onClick={() => setModalAdminPanel(false)}
                className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{changas.length}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider">Publicaciones Totales</p>
              </div>
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{usuariosRegistrados.length}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider">Usuarios Registrados</p>
              </div>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs custom-scrollbar">
              <h4 className="font-black text-slate-800 uppercase text-xs border-b pb-2">
                Gestionar Publicaciones / Asignar Premium
              </h4>
              {changas.map((ch) => {
                const fijada = ch.fijadoHasta && ch.fijadoHasta > ahora;
                return (
                  <div key={ch.id} className="border border-slate-200 rounded-2xl p-3.5 space-y-2 bg-slate-50/50">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {ch.titulo} {fijada && <span className="text-amber-500 font-black">👑 (PREMIUM)</span>}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          Por: {ch.usuarioNombre} ({ch.usuarioEmail})
                        </p>
                      </div>
                      <button
                        onClick={() => eliminarMiPublicacion(ch.id)}
                        className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-red-100 active:scale-95 transition-all shrink-0"
                      >
                        ELIMINAR
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">
                        {fijada ? `👑 Fijada Premium` : `Fijar publicación:`}
                      </span>
                      {fijada ? (
                        <button
                          onClick={() => desfijarChangaAdmin(ch.id)}
                          className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-amber-200 transition-colors"
                        >
                          QUITAR PREMIUM
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => fijarChangaAdmin(ch.id, 3)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black px-2 py-1 rounded-lg transition-colors shadow-2xs"
                          >
                            +3 Días
                          </button>
                          <button
                            onClick={() => fijarChangaAdmin(ch.id, 7)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black px-2 py-1 rounded-lg transition-colors shadow-2xs"
                          >
                            +1 Sem
                          </button>
                          <button
                            onClick={() => fijarChangaAdmin(ch.id, 30)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black px-2 py-1 rounded-lg transition-colors shadow-2xs"
                          >
                            +1 Mes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <h4 className="font-black text-slate-800 uppercase text-xs border-b pb-2 pt-2">
                Gestionar Usuarios Registrados
              </h4>
              {usuariosRegistrados.map((u, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-3.5 flex justify-between items-center gap-2 bg-slate-50/50">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{u.nombre}</p>
                    <p className="text-[10px] text-slate-500 truncate">{u.email} - Barrio: {u.barrio}</p>
                  </div>
                  {u.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() && (
                    <button
                      onClick={() => eliminarUsuarioAdmin(u.email)}
                      className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-red-100 active:scale-95 transition-all shrink-0"
                    >
                      BLOQUEAR
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalAdminPanel(false)}
              className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl transition-all shadow-md active:scale-95"
            >
              CERRAR PANEL
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDITAR AVISO */}
      {changaEditando && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[70] overflow-y-auto">
          <form onSubmit={guardarEdicionAviso} className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-3 shadow-2xl my-auto border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-slate-900">✏️ Editar Aviso</h3>
              <button
                type="button"
                onClick={() => setChangaEditando(null)}
                className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Título</label>
              <input
                type="text"
                placeholder="Ej: Pintor, Reparación de Techos..."
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Categoría</label>
              <select
                value={editCategoria}
                onChange={(e) => setEditCategoria(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Barrio</label>
              <select
                value={editBarrio}
                onChange={(e) => setEditBarrio(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {barriosCampana.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setEditTipoPago('hora')}
                className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 ${
                  editTipoPago === 'hora' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                POR HORA
              </button>
              <button
                type="button"
                onClick={() => setEditTipoPago('dia')}
                className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 ${
                  editTipoPago === 'dia' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                POR DÍA
              </button>
              <button
                type="button"
                onClick={() => setEditTipoPago('servicio')}
                className={`py-2 text-[9px] sm:text-[10px] font-bold rounded-xl border transition-all active:scale-95 ${
                  editTipoPago === 'servicio' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                SERVICIO
              </button>
            </div>

            {editTipoPago !== 'servicio' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Monto Estimado ($)</label>
                <input
                  type="number"
                  placeholder="Ej: 4000"
                  value={editPago}
                  onChange={(e) => setEditPago(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required={editTipoPago !== 'servicio'}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Teléfono / WhatsApp</label>
              <input
                type="tel"
                placeholder="Ej: 3489123456"
                value={editTelefono}
                onChange={(e) => setEditTelefono(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Email de contacto</label>
              <input
                type="email"
                placeholder="Ej: mi-contacto@gmail.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Descripción</label>
              <textarea
                placeholder="Detalle del trabajo..."
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setChangaEditando(null)}
                className="w-full text-xs font-bold border border-slate-200 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                CANCELAR
              </button>
              <button type="submit" className="w-full text-xs font-bold bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md">
                GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ALERTA DE AUTENTICACIÓN REQUERIDA */}
      {mensajeAuthReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[80] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 text-center my-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-xl sm:text-2xl font-bold shadow-inner">
              🔒
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed px-1">
              {mensajeAuthReq}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setMensajeAuthReq(null);
                  setModalLogin(true);
                }}
                className="w-full text-xs font-black bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md uppercase tracking-wider"
              >
                INICIAR SESIÓN
              </button>
              <button
                onClick={() => {
                  setMensajeAuthReq(null);
                  setModalRegistro(true);
                }}
                className="w-full text-xs font-black bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 active:scale-95 transition-all shadow-md uppercase tracking-wider"
              >
                REGISTRARSE
              </button>
              <button
                onClick={() => setMensajeAuthReq(null)}
                className="w-full text-xs font-bold text-slate-500 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AYUDA / TUTORIAL */}
      {modalAyuda && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[70] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col border border-slate-100 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                <span>❓</span> Guía de Uso - Changas Campana
              </h3>
              <button
                onClick={() => setModalAyuda(false)}
                className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs text-slate-700 leading-relaxed custom-scrollbar">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <span>1️⃣</span> ¿Cómo buscar servicios o trabajos?
                </h4>
                <p>
                  Podés escribir lo que buscás en la barra superior o filtrar por <strong>Categoría</strong> y <strong>Barrio</strong> en el panel lateral para encontrar publicaciones cerca tuyo.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <span>2️⃣</span> ¿Cómo contactar a quien publica?
                </h4>
                <p>
                  Al hacer clic en <strong>VER MÁS</strong> en cualquier anuncio, verás el teléfono y mail del anunciante. Podés presionar <strong>WHATSAPP</strong> para mandarle un mensaje directo o <strong>ENVIAR MAIL</strong> para escribirle por correo.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <span>3️⃣</span> ¿Cómo publicar una changa o servicio?
                </h4>
                <p>
                  Tocá el botón azul <strong>PUBLICAR</strong> arriba. Completá el título, rubro, barrio, modalidad (Por Hora, Por Día o Anuncio de Servicio) y tus datos de contacto.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <span>4️⃣</span> Registro y gestión de tu cuenta
                </h4>
                <p>
                  Podés crear una cuenta o iniciar sesión para asociar tus anuncios a tu perfil, cambiar tu foto de avatar y administrarlos fácilmente desde el botón <strong>MIS PUBLICACIONES</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <span>5️⃣</span> Guardar publicaciones favoritas
                </h4>
                <p>
                  Si ves una publicación que te interesa pero querés revisar después, tocá los tres puntos (⋮) en la esquina del aviso y elegí <strong>Guardar aviso</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalAyuda(false)}
              className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl transition-all active:scale-95 shadow-md uppercase tracking-wide"
            >
              ¡Entendido, volver a la página!
            </button>
          </div>
        </div>
      )}

      {/* MODAL MIS PUBLICACIONES */}
      {modalMisPublicaciones && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col border border-slate-100 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                <span>📋</span> Mis Publicaciones ({misPublicaciones.length})
              </h3>
              <button onClick={() => setModalMisPublicaciones(false)} className="text-slate-400 font-bold hover:text-slate-600 rounded-full w-7 h-7 flex items-center justify-center">✕</button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 custom-scrollbar">
              {misPublicaciones.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-slate-500 text-xs">No tenés publicaciones activas actualmente.</p>
                  <button
                    onClick={() => {
                      setModalMisPublicaciones(false);
                      handleAbrirPublicar();
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-2.5 rounded-full text-xs shadow-md active:scale-95 transition-all"
                  >
                    PUBLICAR CHANGA AHORA
                  </button>
                </div>
              ) : (
                misPublicaciones.map((ch) => (
                  <div key={ch.id} className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-slate-50/50">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-800 text-xs truncate">{ch.titulo}</h4>
                      <p className="text-[11px] text-slate-500 truncate">📍 {ch.barrio} | 🔨 {ch.categoria}</p>
                      <p className="text-[11px] font-black text-blue-700">
                        {ch.tipoPago === 'servicio' || ch.pago.includes('ANUNCIO') ? 'ANUNCIO DE SERVICIO' : ch.pago}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setModalMisPublicaciones(false);
                          abrirEditarAviso(ch);
                        }}
                        className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-blue-100 active:scale-95 transition-all"
                      >
                        EDITAR
                      </button>
                      <button
                        onClick={() => eliminarMiPublicacion(ch.id)}
                        className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-red-100 active:scale-95 transition-all"
                      >
                        ELIMINAR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setModalMisPublicaciones(false)}
              className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl transition-all shadow-md active:scale-95"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETALLES AMPLIADO */}
      {changaDetalle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[60] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 my-auto">
            <div className="flex items-center gap-3 border-b pb-3">
              <img
                src={changaDetalle.avatar}
                alt={changaDetalle.usuarioNombre}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-slate-900 shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">👤 {changaDetalle.usuarioNombre}</h4>
                <span className="inline-block text-[10px] font-bold text-slate-700 uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md mt-0.5 truncate max-w-full">
                  🔨 {changaDetalle.categoria}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug">{changaDetalle.titulo}</h3>
              
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">📍 Barrio: {changaDetalle.barrio}</span>
                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                  💼 Modalidad:{' '}
                  {changaDetalle.tipoPago === 'hora'
                    ? 'Por hora'
                    : changaDetalle.tipoPago === 'dia'
                    ? 'Por día'
                    : 'Servicio'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Descripción del trabajo</p>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200">
                {changaDetalle.descripcion}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-center">
              <p className="text-xs font-black text-blue-900 uppercase tracking-wide">
                {changaDetalle.tipoPago === 'servicio' || changaDetalle.pago.includes('ANUNCIO')
                  ? 'ANUNCIO DE SERVICIO'
                  : `PAGO ESTIMADO: ${changaDetalle.pago}`}
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contactar al anunciante</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex flex-col gap-1 text-center">
                  {changaDetalle.telefono ? (
                    <>
                      <p className="text-xs font-bold text-slate-700 truncate" title={changaDetalle.telefono}>
                        📱 {changaDetalle.telefono}
                      </p>
                      <a
                        href={`https://wa.me/549${changaDetalle.telefono.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        💬 WHATSAPP
                      </a>
                    </>
                  ) : (
                    <span className="text-center text-xs text-slate-400 py-2.5 bg-slate-100 rounded-xl font-medium">
                      Sin WhatsApp
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-center">
                  {changaDetalle.email ? (
                    <>
                      <p className="text-xs font-bold text-slate-700 truncate" title={changaDetalle.email}>
                        ✉️ {changaDetalle.email}
                      </p>
                      <a
                        href={obtenerUrlGmail(changaDetalle.email, changaDetalle.titulo)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-center text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm truncate px-2 active:scale-95 transition-all"
                      >
                        ✉️ ENVIAR MAIL
                      </a>
                    </>
                  ) : (
                    <span className="text-center text-xs text-slate-400 py-2.5 bg-slate-100 rounded-xl font-medium">
                      Sin Mail
                    </span>
                  )}
                </div>
              </div>
            </div>

            {(esAdmin ||
              (usuario &&
                (changaDetalle.usuarioEmail === usuario.email ||
                  changaDetalle.usuarioNombre === usuario.nombre))) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const c = changaDetalle;
                      setChangaDetalle(null);
                      abrirEditarAviso(c);
                    }}
                    className="w-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    ✏️ EDITAR
                  </button>
                  <button
                    onClick={() => eliminarMiPublicacion(changaDetalle.id)}
                    className="w-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    🗑️ ELIMINAR
                  </button>
                </div>
              )}

            <button
              onClick={() => setChangaDetalle(null)}
              className="w-full text-xs font-bold border border-slate-300 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* MODAL PUBLICAR */}
      {modalPublicar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <form onSubmit={agregarChanga} className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-3 shadow-2xl my-auto border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-black text-lg sm:text-xl text-slate-900">Publicar Changa en Campana</h3>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Título</label>
              <input
                type="text"
                placeholder="Ej: Pintor, Reparación de Techos..."
                value={nuevoTitulo}
                onChange={(e) => setNuevoTitulo(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Categoría</label>
              <select
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Barrio</label>
              <select
                value={nuevoBarrio}
                onChange={(e) => setNuevoBarrio(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {barriosCampana.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setTipoPagoSel('hora')}
                className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 ${
                  tipoPagoSel === 'hora' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                POR HORA
              </button>
              <button
                type="button"
                onClick={() => setTipoPagoSel('dia')}
                className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 ${
                  tipoPagoSel === 'dia' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                POR DÍA
              </button>
              <button
                type="button"
                onClick={() => setTipoPagoSel('servicio')}
                className={`py-2 text-[9px] sm:text-[10px] font-bold rounded-xl border transition-all active:scale-95 ${
                  tipoPagoSel === 'servicio' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                SERVICIO
              </button>
            </div>

            {tipoPagoSel !== 'servicio' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Monto Estimado ($)</label>
                <input
                  type="number"
                  placeholder="Ej: 4000"
                  value={nuevoPago}
                  onChange={(e) => setNuevoPago(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required={tipoPagoSel !== 'servicio'}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Teléfono / WhatsApp</label>
              <input
                type="tel"
                placeholder="Ej: 3489123456"
                value={nuevoTelefono}
                onChange={(e) => setNuevoTelefono(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Email de contacto</label>
              <input
                type="email"
                placeholder="Ej: mi-contacto@gmail.com"
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Descripción</label>
              <textarea
                placeholder="Detalle del trabajo..."
                value={nuevaDesc}
                onChange={(e) => setNuevaDesc(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalPublicar(false)}
                className="w-full text-xs font-bold border border-slate-200 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                CANCELAR
              </button>
              <button type="submit" className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl active:scale-95 transition-all shadow-md">
                PUBLICAR Y GUARDAR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL GUARDADOS */}
      {modalGuardados && usuario && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col border border-slate-100 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                <span>📌</span> Guardados
              </h3>
              <button onClick={() => setModalGuardados(false)} className="text-slate-400 font-bold hover:text-slate-600 rounded-full w-7 h-7 flex items-center justify-center">✕</button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 custom-scrollbar">
              {guardados.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-xs">No tenés guardados actualmente.</p>
              ) : (
                guardados.map((item) => {
                  const transcurrido = item.timestampEliminado ? ahora - item.timestampEliminado : 0;
                  const restanteMs = Math.max(0, 3600000 - transcurrido);

                  const horas = Math.floor(restanteMs / (1000 * 60 * 60));
                  const minutos = Math.floor((restanteMs / (1000 * 60)) % 60);
                  const segundos = Math.floor((restanteMs / 1000) % 60);

                  const hsStr = String(horas).padStart(2, '0');
                  const minStr = String(minutos).padStart(2, '0');
                  const segStr = String(segundos).padStart(2, '0');

                  return (
                    <div
                      key={item.changa.id}
                      className={`border rounded-2xl p-3.5 sm:p-4 transition-all ${
                        item.eliminado ? 'bg-red-50/30 border-red-200' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div
                          onClick={() => handleVerMas(item.changa)}
                          className="space-y-1 flex-1 min-w-0 cursor-pointer"
                        >
                          <h4
                            className={`font-bold text-xs truncate ${
                              item.eliminado ? 'text-slate-400 line-through' : 'text-slate-800'
                            }`}
                          >
                            {item.changa.titulo}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            📍 {item.changa.barrio} | 🔨 {item.changa.categoria}
                          </p>
                        </div>

                        {item.eliminado ? (
                          <button
                            onClick={() => restaurarAnuncio(item.changa.id)}
                            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 sm:px-4 py-2 rounded-xl shrink-0 shadow-sm active:scale-95 transition-all"
                          >
                            RESTAURAR
                          </button>
                        ) : (
                          <button
                            onClick={() => marcarComoEliminado(item.changa.id)}
                            className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 sm:px-3 py-1.5 rounded-xl shrink-0 hover:bg-red-100 active:scale-95 transition-all"
                          >
                            BORRAR
                          </button>
                        )}
                      </div>

                      {item.eliminado && (
                        <div className="mt-3 pt-2.5 border-t border-red-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-red-600 font-semibold">
                          <span>¡Tiempo hasta borrado!</span>
                          <span className="font-mono font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-md border border-red-200">
                            ⏱️ {hsStr}:{minStr}:{segStr}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setModalGuardados(false)}
              className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl transition-all shadow-md active:scale-95"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* MODAL REGISTRO */}
      {modalRegistro && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <form onSubmit={handleRegistro} className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-3 shadow-2xl border border-slate-100 my-auto">
            <h3 className="font-black text-lg sm:text-xl text-slate-900">Crear Cuenta</h3>
            {errorRegistro && <p className="text-red-600 text-xs text-center font-bold bg-red-50 py-1.5 rounded-lg border border-red-200">{errorRegistro}</p>}

            <input
              type="text"
              placeholder="Nombre y Apellido"
              value={regNombre}
              onChange={(e) => setRegNombre(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <input
              type="date"
              value={regFechaNac}
              onChange={(e) => setRegFechaNac(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalRegistro(false)}
                className="w-full text-xs font-bold border border-slate-200 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                CANCELAR
              </button>
              <button type="submit" className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl active:scale-95 transition-all shadow-md">
                REGISTRARME
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL LOGIN */}
      {modalLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <form onSubmit={handleLogin} className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 my-auto">
            <h3 className="font-black text-lg sm:text-xl text-slate-900">Iniciar Sesión</h3>
            {errorLogin && <p className="text-red-600 text-xs text-center font-bold bg-red-50 py-1.5 rounded-lg border border-red-200">{errorLogin}</p>}

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalLogin(false)}
                className="w-full text-xs font-bold border border-slate-200 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl active:scale-95 transition-all shadow-md"
              >
                INGRESAR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL AJUSTES / MI PERFIL */}
      {modalAjustes && usuario && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-100 my-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                <span>⚙️</span> Mi Perfil
              </h3>
              <button
                onClick={() => setModalAjustes(false)}
                className="text-slate-400 font-bold hover:text-slate-600 rounded-full w-7 h-7 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative group">
                <img
                  src={usuario.avatar}
                  alt={usuario.nombre}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-md"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-transform active:scale-90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCambiarAvatar}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center">
                <h4 className="font-black text-slate-900 text-base">{usuario.nombre}</h4>
                <p className="text-xs text-slate-500">{usuario.email}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Barrio:</span>
                <span className="font-semibold text-slate-800">{usuario.barrio || 'Centro'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Nacimiento:</span>
                <span className="font-semibold text-slate-800">{usuario.fechaNac || '-'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCerrarSesion}
                className="w-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 py-3 rounded-2xl hover:bg-red-100 active:scale-95 transition-all"
              >
                CERRAR SESIÓN
              </button>
              <button
                onClick={() => setModalAjustes(false)}
                className="w-full text-xs font-bold border border-slate-300 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                VOLVER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-300">CHANGAS CAMPANA &copy; {new Date().getFullYear()} - Todos los derechos reservados</p>
          <p className="text-slate-500 text-[11px]">Plataforma comunitaria de anuncios y ofertas laborales para la ciudad de Campana, Buenos Aires.</p>
        </div>
      </footer>
    </div>
  );
}
