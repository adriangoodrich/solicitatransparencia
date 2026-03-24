// ============================================
// mailGenerator.js - Generación del texto del correo
// ============================================

/**
 * Obtiene el nombre del mes en español
 * @param {number} mesNumero - Número del mes (1-12)
 * @returns {string}
 */
function obtenerNombreMes(mesNumero) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[mesNumero - 1];
}

/**
 * Genera la descripción de la fecha según los datos ingresados
 * @returns {string}
 */
function generarDescripcionFecha() {
    const dia = document.getElementById('dia')?.value;
    const mes = document.getElementById('mes')?.value;
    const anio = document.getElementById('anio')?.value;

    if (!mes || !anio) return '';

    const nombreMes = obtenerNombreMes(parseInt(mes));

    if (dia && dia !== '') {
        return `el día ${dia} de ${nombreMes} de ${anio}`;
    } else {
        return `durante el mes de ${nombreMes} de ${anio}`;
    }
}

/**
 * Genera la descripción del reclamo (número o dirección)
 * @returns {string}
 */
function generarDescripcionReclamo() {
    const numeroReclamo = document.getElementById('numeroReclamo')?.value.trim();
    const direccion = document.getElementById('direccion')?.value.trim();

    if (numeroReclamo && direccion) {
        return `reclamo N° ${numeroReclamo} realizado en ${direccion}`;
    } else if (numeroReclamo) {
        return `reclamo N° ${numeroReclamo}`;
    } else if (direccion) {
        return `reclamo realizado en ${direccion}`;
    }
    return '';
}

/**
 * Genera el tipo de información solicitada
 * @param {Array} tipos - Lista de tipos desde el JSON
 * @returns {string}
 */
function generarTipoInformacion(tipos) {
    const tipoSelect = document.getElementById('tipoInfo');
    const tipoId = tipoSelect?.value;

    if (!tipoId) return '';

    const tipo = tipos.find(t => t.id === tipoId);
    if (!tipo) return '';

    if (tipo.id === 'otro') {
        const otroTexto = document.getElementById('otroTexto')?.value.trim() || '';
        return otroTexto || 'Información solicitada';
    }

    return tipo.nombre;
}

/**
 * Obtiene los datos del solicitante
 * @returns {Object}
 */
function obtenerDatosSolicitante() {
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const correo = document.getElementById('correo')?.value.trim() || '';
    const telefono = document.getElementById('telefono')?.value.trim() || '';

    return { nombre, correo, telefono };
}

/**
 * Obtiene el nombre de la comuna seleccionada
 * @returns {string}
 */
function obtenerNombreComuna() {
    const comunaSelect = document.getElementById('comuna');
    const opcionSeleccionada = comunaSelect?.options[comunaSelect.selectedIndex];
    return opcionSeleccionada?.text || '';
}

/**
 * Genera el texto completo del correo
 * @param {Array} tipos - Lista de tipos desde el JSON
 * @returns {string}
 */
function generarTextoCorreo(tipos) {
    const comuna = obtenerNombreComuna();
    const { nombre, correo, telefono } = obtenerDatosSolicitante();
    const fechaTexto = generarDescripcionFecha();
    const reclamoTexto = generarDescripcionReclamo();
    const tipoInfo = generarTipoInformacion(tipos);

    if (!comuna || !nombre || !correo) {
        return '⚠️ Completa todos los campos obligatorios para generar la solicitud.';
    }

    const telefonoTexto = telefono ? `\n- **Teléfono:** +56 ${telefono}` : '';

    return `Estimado/a Encargado/a de Transparencia de la Municipalidad de ${comuna}:

Por medio del presente, y al amparo de la Ley N° 20.285 sobre Acceso a la Información Pública, vengo en solicitar lo siguiente:

**${tipoInfo}** asociado al ${reclamoTexto}, ingresado ${fechaTexto}.

Agradezco de antemano su atención y quedo atento a su respuesta dentro del plazo legal establecido de **20 días hábiles**, contados desde la recepción de esta solicitud, conforme al artículo 14 de la Ley N° 20.285.

Saludos cordiales,

**DATOS DEL SOLICITANTE:**
- **Nombre:** ${nombre}
- **Correo electrónico:** ${correo}${telefonoTexto}`;
}

/**
 * Abre el cliente de correo con la solicitud generada
 * @param {Array} tipos - Lista de tipos desde el JSON
 */
function abrirCorreo(tipos) {
    const comunaSelect = document.getElementById('comuna');
    const emailDestino = comunaSelect?.options[comunaSelect.selectedIndex]?.getAttribute('data-email');
    const { nombre, correo } = obtenerDatosSolicitante();
    const textoCorreo = generarTextoCorreo(tipos);

    if (!emailDestino) {
        mostrarErrorGeneral('⚠️ No se pudo determinar el correo de la municipalidad. Por favor, selecciona una comuna válida.');
        return;
    }

    if (textoCorreo.includes('Completa todos los campos')) {
        mostrarErrorGeneral('⚠️ Completa todos los campos obligatorios antes de enviar.');
        return;
    }

    const asunto = `Solicitud de acceso a información pública - ${nombre}`;

    // Abrir cliente de correo
    window.location.href = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoCorreo)}`;
}
