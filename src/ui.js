// ui.js: Renderiza la interfaz principal basada en el diseño Kivy

export function renderMenuScreen(container, onNavigate) {
  container.innerHTML = `
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
}

export function renderGrupoScreen(container, grupos, onBack, onCrearGrupo) {
  container.innerHTML = `
    <h2>Gestión de Grupos</h2>
    <form id="grupo-form">
      <label>Nombre del grupo:<input name="nombre" required></label><br>
      <label>Día:<input name="dia" required></label><br>
      <label>Hora inicio:<input name="hora_inicio" required></label><br>
      <label>Hora fin:<input name="hora_fin" required></label><br>
      <label>Clases requeridas/mes:<input name="clases_mes" required></label><br>
      <button type="submit">Crear grupo</button>
    </form>
    <h3>Grupos creados:</h3>
    <ul id="grupos-list"></ul>
    <button id="btn-back">Volver al menú</button>
  `;
  document.getElementById('btn-back').onclick = onBack;
  document.getElementById('grupo-form').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    onCrearGrupo(data);
  };
  const ul = document.getElementById('grupos-list');
  ul.innerHTML = grupos.map(g => `<li>${g.nombre} - ${g.dias} ${g.horarios} (${g.clases_mes} clases/mes)</li>`).join('');
}

export function renderRegistroScreen(container, estudiantes, onBack, onRegistrar) {
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
      <label>Grupo:<input name="grupo" required></label><br>
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
