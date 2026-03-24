// ============================================
// mailGenerator.js - Generación del texto del correo
// ============================================

function obtenerNombreMes(mesNumero) {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mesNumero - 1];
}

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

function obtenerDatosSolicitante() {
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const correo = document.getElementById('correo')?.value.trim() || '';
    const telefono = document.getElementById('telefono')?.value.trim() || '';
    return { nombre, correo, telefono };
}

function obtenerNombreComuna() {
    const comunaSelect = document.getElementById('comuna');
    const opcionSeleccionada = comunaSelect?.options[comunaSelect.selectedIndex];
    return opcionSeleccionada?.text || '';
}

function obtenerEmailSeleccionado() {
    const radioSeleccionado = document.querySelector('input[name="emailSeleccionado"]:checked');
    if (radioSeleccionado) {
        return radioSeleccionado.value;
    }
    const comunaSelect = document.getElementById('comuna');
    const selectedOption = comunaSelect.options[comunaSelect.selectedIndex];
    return selectedOption?.getAttribute('data-email') || null;
}

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

function abrirCorreo(tipos) {
    const emailDestino = obtenerEmailSeleccionado();
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
    window.location.href = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoCorreo)}`;
}
