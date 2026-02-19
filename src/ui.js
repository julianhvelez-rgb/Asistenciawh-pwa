// Renderiza la pantalla de login
export function renderLoginScreen(container, onLogin) {
  container.innerHTML = `
    <div class="login-screen">
      <h2>Iniciar sesión</h2>
      <form id="login-form">
        <label>Usuario:<input name="usuario" required></label><br>
        <label>Contraseña:<input name="contrasena" type="password" required></label><br>
        <button type="submit">Entrar</button>
      </form>
      <div id="login-error" style="color:red;"></div>
    </div>
  `;
  document.getElementById('login-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onLogin(data);
  };
}

// ui.js: Renderiza la interfaz principal basada en el diseño Kivy

export function renderMenuScreen(container, onNavigate, onCambiarCred, onLogout) {
  container.innerHTML = `
    <div class="menu-header" style="display:flex;justify-content:flex-end;align-items:center;padding:8px 0 8px 0;gap:10px;">
      <button id="settings-icon" title="Cambiar usuario/contraseña" style="background:none;border:none;cursor:pointer;padding:4px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.14.31.22.65.22 1v.09A1.65 1.65 0 0 0 21 12c0 .35-.08.69-.22 1v.09A1.65 1.65 0 0 0 19.4 15z"/></svg>
      </button>
      <button id="logout-icon" title="Salir" style="background:none;border:none;cursor:pointer;padding:4px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
    <div class="menu-screen">
      <h1>Control de Asistencia</h1>
      <button id="btn-grupos">Gestión de Grupos</button>
      <button id="btn-estudiantes">Registro de Estudiantes</button>
      <button id="btn-asistencia">Control de Asistencia</button>
      <button id="btn-reporte">Reporte Mensual</button>
    </div>
  `;
  document.getElementById('btn-grupos').onclick = () => onNavigate('grupo');
  document.getElementById('btn-estudiantes').onclick = () => onNavigate('registro');
  document.getElementById('btn-asistencia').onclick = () => onNavigate('asistencia');
  document.getElementById('btn-reporte').onclick = () => onNavigate('reporte');
  document.getElementById('settings-icon').onclick = onCambiarCred;
  document.getElementById('logout-icon').onclick = onLogout;
}

// Renderiza la pantalla para cambiar usuario/contraseña
export function renderCambiarCredScreen(container, usuarioActual, onGuardar, onBack) {
  container.innerHTML = `
    <div class="cambiar-cred-screen">
      <h2>Cambiar usuario/contraseña</h2>
      <form id="cred-form">
        <label>Usuario actual:<input name="usuario_actual" value="${usuarioActual}" required></label><br>
        <label>Nuevo usuario:<input name="nuevo_usuario" required></label><br>
        <label>Nueva contraseña:<input name="nuevo_contrasena" type="password" required></label><br>
        <button type="submit">Guardar</button>
      </form>
      <button id="btn-back">Volver al menú</button>
      <div id="cred-error" style="color:red;"></div>
    </div>
  `;
  document.getElementById('btn-back').onclick = onBack;
  document.getElementById('cred-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onGuardar(data);
  };
}

export function renderGrupoScreen(container, grupos, onBack, onCrearGrupo, onEditarGrupo, grupoEditando, onGuardarEdicion, onCancelarEdicion, errorMsg) {
  // Obtener estudiantes desde localStorage
  let estudiantes = [];
  try {
    estudiantes = JSON.parse(localStorage.getItem('estudiantes') || '[]');
  } catch (e) {}
  container.innerHTML = `
    <h2>Gestión de Grupos</h2>
    <form id="grupo-form">
      <label>Nombre del grupo:<input name="nombre" value="${grupoEditando ? grupoEditando.nombre : ''}" required></label><br>
      <label>Día:<input name="dia" value="${grupoEditando ? grupoEditando.dias : ''}" required></label><br>
      <label>Hora inicio:<input name="hora_inicio" value="${grupoEditando ? (grupoEditando.horarios||'').split('-')[0] : ''}" required></label><br>
      <label>Hora fin:<input name="hora_fin" value="${grupoEditando ? (grupoEditando.horarios||'').split('-')[1] : ''}" required></label><br>
      <label>Clases requeridas/mes:<input name="clases_mes" value="${grupoEditando ? grupoEditando.clases_mes : ''}" required></label><br>
      <button type="submit">${grupoEditando ? 'Guardar cambios' : 'Crear grupo'}</button>
      ${grupoEditando ? '<button type="button" id="btn-cancelar-edicion">Cancelar</button>' : ''}
    </form>
    <div id="grupo-error" style="color:red;">${errorMsg||''}</div>
    <h3>Grupos creados:</h3>
    <ul id="grupos-list"></ul>
    <h3>Estudiantes por grupo:</h3>
    <div id="estudiantes-por-grupo">
      ${grupos.map(g => {
        const ests = estudiantes.filter(e => e.grupo === g.nombre);
        return `<div style='margin-bottom:10px;'><b>${g.nombre}:</b> ${ests.length ? ests.map(e => e.nombre).join(', ') : '<span style=\'color:#888\'>(Sin estudiantes)</span>'}</div>`;
      }).join('')}
    </div>
    <button id="btn-back">Volver al menú</button>
  `;
  document.getElementById('btn-back').onclick = onBack;
  document.getElementById('grupo-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (grupoEditando) {
      onGuardarEdicion(data);
    } else {
      onCrearGrupo(data);
    }
  };
  if (grupoEditando && document.getElementById('btn-cancelar-edicion')) {
    document.getElementById('btn-cancelar-edicion').onclick = onCancelarEdicion;
  }
  const ul = document.getElementById('grupos-list');
  ul.innerHTML = grupos.map((g, i) => `<li>${g.nombre} - ${g.dias} ${g.horarios} (${g.clases_mes} clases/mes) <button data-idx="${i}" class="btn-editar">Editar</button></li>`).join('');
  Array.from(document.getElementsByClassName('btn-editar')).forEach(btn => {
    btn.onclick = () => onEditarGrupo(parseInt(btn.getAttribute('data-idx')));
  });
}

export function renderRegistroScreen(container, estudiantes, grupos, onBack, onRegistrar) {
  container.innerHTML = `
    <h2>Registro de Estudiantes</h2>
    <form id="estudiante-form">
      <label>Tipo:
        <select name="tipo">
          <option value="Menor">Menor</option>
          <option value="Adulto">Adulto</option>
        </select>
      </label><br>
      <label>Nombre completo:<input name="nombre" required></label><br>
      <label>Contacto:<input name="contacto"></label><br>
      <label>Grupo:
        <select name="grupo" required>
          <option value="">Seleccione un grupo</option>
          ${grupos && grupos.length ? grupos.map(g => `<option value="${g.nombre}">${g.nombre}</option>`).join('') : ''}
        </select>
      </label><br>
      <label>Padres:<input name="padres"></label><br>
      <label>Contacto padres:<input name="contacto_padres"></label><br>
      <button type="submit">Registrar estudiante</button>
    </form>
    <h3>Estudiantes registrados:</h3>
    <ul id="estudiantes-list"></ul>
    <button id="btn-back">Volver al menú</button>
  `;
  document.getElementById('btn-back').onclick = onBack;
  document.getElementById('estudiante-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onRegistrar(data);
  };
  const ul = document.getElementById('estudiantes-list');
  ul.innerHTML = estudiantes.map(e => `<li>${e.nombre} (${e.grupo})</li>`).join('');
}

export function renderAsistenciaScreen(container, estudiantes, onBack, onMarcar) {
  container.innerHTML = `
    <h2>Control de Asistencia</h2>
    <form id="asistencia-form">
      <label>Nombre estudiante:<input name="nombre" required></label><br>
      <label>Grupo:<input name="grupo" required></label><br>
      <button type="submit">Marcar asistencia</button>
    </form>
    <div id="resultado-asist"></div>
    <h3>Estudiantes registrados:</h3>
    <ul id="asistencia-list"></ul>
    <button id="btn-back">Volver al menú</button>
  `;
  document.getElementById('btn-back').onclick = onBack;
  document.getElementById('asistencia-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onMarcar(data);
  };
  const ul = document.getElementById('asistencia-list');
  ul.innerHTML = estudiantes.map(e => `<li>${e.nombre} (${e.grupo})</li>`).join('');
}

export function renderReporteScreen(container, estudiantes, asistencias, onBack, onMostrar) {
  container.innerHTML = `
    <h2>Reporte Mensual</h2>
    <form id="reporte-form">
      <label>Mes (1-12):<input name="mes" required></label><br>
      <label>Año:<input name="anio" required></label><br>
      <button type="submit">Mostrar reporte</button>
    </form>
    <textarea id="texto-reporte" readonly style="width:100%;height:120px;"></textarea>
    <button id="btn-back">Volver al menú</button>
  `;
  document.getElementById('btn-back').onclick = onBack;
  document.getElementById('reporte-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onMostrar(data);
  };
}
