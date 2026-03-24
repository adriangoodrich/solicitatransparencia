// ============================================
// validaciones.js - Validaciones del formulario
// ============================================

/**
 * Valida que al menos número de reclamo o dirección estén llenos
 * @returns {boolean} - true si es válido
 */
function validarIdentificacionReclamo() {
    const numeroReclamo = document.getElementById('numeroReclamo')?.value.trim() || '';
    const direccion = document.getElementById('direccion')?.value.trim() || '';

    const esValido = numeroReclamo !== '' || direccion !== '';

    if (!esValido) {
        mostrarErrorGeneral('⚠️ Debes ingresar al menos el número de reclamo o la dirección del hecho.');
    }

    return esValido;
}

/**
 * Valida que el nombre no esté vacío
 * @returns {boolean}
 */
function validarNombre() {
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const esValido = nombre !== '';

    if (!esValido) {
        mostrarError('nombre', 'El nombre completo es obligatorio');
    } else {
        limpiarError('nombre');
    }

    return esValido;
}

/**
 * Valida el formato del correo electrónico
 * @returns {boolean}
 */
function validarCorreo() {
    const correo = document.getElementById('correo')?.value.trim() || '';
    const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    const esValido = correo !== '' && regex.test(correo);

    if (correo === '') {
        mostrarError('correo', 'El correo electrónico es obligatorio');
    } else if (!regex.test(correo)) {
        mostrarError('correo', 'Ingresa un correo válido (ej: nombre@dominio.com)');
    } else {
        limpiarError('correo');
    }

    return esValido;
}

/**
 * Valida que la fecha (mes y año) estén seleccionados
 * @returns {boolean}
 */
function validarFecha() {
    const mes = document.getElementById('mes')?.value;
    const anio = document.getElementById('anio')?.value;

    const esValido = mes && mes !== '' && anio && anio !== '';

    if (!esValido) {
        mostrarErrorGeneral('⚠️ Debes seleccionar el mes y año del reclamo.');
    }

    return esValido;
}

/**
 * Valida que el tipo de información esté seleccionado
 * @returns {boolean}
 */
function validarTipoInformacion() {
    const tipoInfo = document.getElementById('tipoInfo')?.value;
    const esValido = tipoInfo && tipoInfo !== '';

    if (!esValido) {
        mostrarErrorGeneral('⚠️ Debes seleccionar el tipo de información que solicitas.');
    }

    return esValido;
}

/**
 * Valida el campo "Otro" si está visible
 * @returns {boolean}
 */
function validarCampoOtro() {
    const campoOtro = document.getElementById('campoOtro');
    const tipoSelect = document.getElementById('tipoInfo');
    const otroTexto = document.getElementById('otroTexto')?.value.trim() || '';

    // Si el campo otro no está visible, es válido
    if (!campoOtro || campoOtro.classList.contains('hidden')) {
        return true;
    }

    // Si está visible, debe tener texto
    const tipoSeleccionado = tipoSelect?.value;
    if (tipoSeleccionado === 'otro') {
        if (otroTexto === '') {
            mostrarError('otroTexto', 'Debes especificar la información que solicitas');
            return false;
        } else {
            limpiarError('otroTexto');
            return true;
        }
    }

    return true;
}

/**
 * Valida todo el formulario
 * @returns {boolean} - true si todo es válido
 */
function validarFormulario() {
    limpiarErrorGeneral();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const identificacionValida = validarIdentificacionReclamo();
    const fechaValida = validarFecha();
    const tipoInfoValido = validarTipoInformacion();
    const otroValido = validarCampoOtro();

    return nombreValido && correoValido && identificacionValida &&
        fechaValida && tipoInfoValido && otroValido;
}
