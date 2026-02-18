
import { renderMenuScreen, renderGrupoScreen, renderRegistroScreen, renderAsistenciaScreen, renderReporteScreen, renderLoginScreen, renderCambiarCredScreen } from './ui.js';


// Estado de la app (simula la estructura de la app Kivy)
let grupos = JSON.parse(localStorage.getItem('grupos') || '[]');
let estudiantes = JSON.parse(localStorage.getItem('estudiantes') || '[]');
let asistencias = JSON.parse(localStorage.getItem('asistencias') || '[]');

// Credenciales (usuario y contraseña) en localStorage
function getCred() {
	let cred = JSON.parse(localStorage.getItem('credenciales'));
	if (!cred) {
		cred = { usuario: 'admin', contrasena: 'admin' };
		localStorage.setItem('credenciales', JSON.stringify(cred));
	}
	return cred;
}
function setCred(usuario, contrasena) {
	localStorage.setItem('credenciales', JSON.stringify({ usuario, contrasena }));
}

let loggedIn = false;


const app = document.getElementById('app');


function navigate(screen) {
	if (!loggedIn) {
		showLogin();
		return;
	}
	if (screen === 'menu') {
		renderMenuScreen(app, navigate, showCambiarCred);
	} else if (screen === 'grupo') {
		renderGrupoScreen(app, grupos, () => navigate('menu'), crearGrupo);
	} else if (screen === 'registro') {
		renderRegistroScreen(app, estudiantes, () => navigate('menu'), registrarEstudiante);
	} else if (screen === 'asistencia') {
		renderAsistenciaScreen(app, estudiantes, () => navigate('menu'), marcarAsistencia);
	} else if (screen === 'reporte') {
		renderReporteScreen(app, estudiantes, asistencias, () => navigate('menu'), mostrarReporte);
	}
}

function showLogin() {
	renderLoginScreen(app, ({ usuario, contrasena }) => {
		const cred = getCred();
		if (usuario === cred.usuario && contrasena === cred.contrasena) {
			loggedIn = true;
			navigate('menu');
		} else {
			document.getElementById('login-error').textContent = 'Usuario o contraseña incorrectos.';
		}
	});
}

function showCambiarCred() {
	const cred = getCred();
	renderCambiarCredScreen(app, cred.usuario, (data) => {
		if (data.usuario_actual !== cred.usuario) {
			document.getElementById('cred-error').textContent = 'Usuario actual incorrecto.';
			return;
		}
		setCred(data.nuevo_usuario, data.nuevo_contrasena);
		alert('Usuario y contraseña actualizados.');
		navigate('menu');
	}, () => navigate('menu'));
}

function crearGrupo(data) {
	const grupo = {
		nombre: data.nombre,
		dias: data.dia,
		horarios: `${data.hora_inicio}-${data.hora_fin}`,
		clases_mes: data.clases_mes
	};
	grupos.push(grupo);
	localStorage.setItem('grupos', JSON.stringify(grupos));
	navigate('grupo');
}

function registrarEstudiante(data) {
	if (!data.nombre || !data.grupo) {
		alert('Nombre y grupo son obligatorios.');
		return;
	}
	if (estudiantes.some(e => e.nombre === data.nombre && e.grupo === data.grupo)) {
		alert('Estudiante ya registrado en este grupo.');
		return;
	}
	const estudiante = {
		nombre: data.nombre,
		contacto: data.contacto,
		grupo: data.grupo,
		tipo: data.tipo,
		padres: data.padres,
		contacto_padres: data.contacto_padres
	};
	estudiantes.push(estudiante);
	localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
	navigate('registro');
}

function marcarAsistencia(data) {
	if (!data.nombre || !data.grupo) {
		alert('Nombre y grupo son obligatorios.');
		return;
	}
	const fecha = new Date();
	const fechaStr = fecha.toLocaleString('es-ES');
	asistencias.push({ nombre: data.nombre, grupo: data.grupo, fecha: fechaStr });
	localStorage.setItem('asistencias', JSON.stringify(asistencias));
	document.getElementById('resultado-asist').textContent = `Asistencia marcada para ${data.nombre} (${data.grupo}) el ${fechaStr}`;
	navigate('asistencia');
}

function mostrarReporte(data) {
	const mes = parseInt(data.mes);
	const anio = parseInt(data.anio);
	if (isNaN(mes) || isNaN(anio)) {
		alert('Mes y año deben ser números.');
		return;
	}
	const diasMes = new Date(anio, mes, 0).getDate();
	let reporte = `Reporte de asistencia - ${mes}/${anio}\n\n`;
	estudiantes.forEach(est => {
		let asistenciasStr = '';
		for (let dia = 1; dia <= diasMes; dia++) {
			const fechaStr = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
			const asistio = asistencias.some(a => a.nombre === est.nombre && a.grupo === est.grupo && a.fecha.startsWith(fechaStr));
			asistenciasStr += asistio ? '✔' : '✗';
		}
		reporte += `${est.nombre} (${est.grupo}): ${asistenciasStr}\n`;
	});
	document.getElementById('texto-reporte').value = reporte;
}

// Inicializar: mostrar login o menú
if (!loggedIn) {
	showLogin();
} else {
	navigate('menu');
}
