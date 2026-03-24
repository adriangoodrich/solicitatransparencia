// ============================================
// uiHelpers.js - Funciones de UI
// ============================================

/**
 * Llena el selector de días (1 al 31)
 */
function llenarDias() {
    const diaSelect = document.getElementById('dia');
    if (!diaSelect) return;

    diaSelect.innerHTML = '<option value="">Día</option>';
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        diaSelect.appendChild(option);
    }
}

/**
 * Llena el selector de meses
 */
function llenarMeses() {
    const mesSelect = document.getElementById('mes');
    if (!mesSelect) return;

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    mesSelect.innerHTML = '<option value="">Mes</option>';
    meses.forEach((mes, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = mes;
        mesSelect.appendChild(option);
    });
}

/**
 * Llena el selector de años (últimos 5 años)
 */
function llenarAnios() {
    const anioSelect = document.getElementById('anio');
    if (!anioSelect) return;

    const anioActual = new Date().getFullYear();
    anioSelect.innerHTML = '<option value="">Año</option>';

    for (let i = anioActual; i >= anioActual - 5; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        anioSelect.appendChild(option);
    }
}

/**
 * Llena el selector de tipos de información
 * @param {Array} tipos - Lista de tipos desde el JSON
 */
function llenarTiposInformacion(tipos) {
    const tipoSelect = document.getElementById('tipoInfo');
    if (!tipoSelect) return;

    tipoSelect.innerHTML = '<option value="">Selecciona tipo de información</option>';

    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = `${tipo.icono || '📄'} ${tipo.nombre}`;
        tipoSelect.appendChild(option);
    });
}

/**
 * Muestra u oculta el campo "Otro" según la selección
 * @param {string} tipoId - ID del tipo seleccionado
 * @param {Array} tipos - Lista de tipos desde el JSON
 */
function toggleCampoOtro(tipoId, tipos) {
    const campoOtro = document.getElementById('campoOtro');
    if (!campoOtro) return;

    const tipoSeleccionado = tipos.find(t => t.id === tipoId);
    if (tipoSeleccionado && tipoSeleccionado.id === 'otro') {
        campoOtro.classList.remove('hidden');
    } else {
        campoOtro.classList.add('hidden');
    }
}

/**
 * Muestra un mensaje de error en un campo
 * @param {string} campoId - ID del campo
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    campo.classList.add('error');

    // Buscar o crear el mensaje de error
    let errorMsg = campo.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('small');
        errorMsg.className = 'error-message';
        errorMsg.style.color = '#e74c3c';
        campo.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = mensaje;
}

/**
 * Limpia los mensajes de error de un campo
 * @param {string} campoId - ID del campo
 */
function limpiarError(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    campo.classList.remove('error');
    const errorMsg = campo.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

/**
 * Muestra un mensaje de error general
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarErrorGeneral(mensaje) {
    // Buscar o crear contenedor de errores generales
    let errorContainer = document.getElementById('error-general');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-general';
        errorContainer.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        `;
        const main = document.querySelector('main');
        if (main) main.insertBefore(errorContainer, main.firstChild);
    }
    errorContainer.textContent = mensaje;
    errorContainer.style.display = 'block';

    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

/**
 * Limpia errores generales
 */
function limpiarErrorGeneral() {
    const errorContainer = document.getElementById('error-general');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}
