// ============================================
// app.js - Lógica principal
// ============================================

// Variables globales
let municipiosData = null;
let tiposData = null;

/**
 * Carga los datos desde los archivos JSON
 */
async function cargarDatos() {
    try {
        mostrarEstadoCarga(true);

        const responseMunicipios = await fetch('data/municipios.json');
        if (!responseMunicipios.ok) throw new Error('Error cargando municipalidades');
        municipiosData = await responseMunicipios.json();

        const responseTipos = await fetch('data/tipos_informacion.json');
        if (!responseTipos.ok) throw new Error('Error cargando tipos de información');
        tiposData = await responseTipos.json();

        inicializarPagina();
        mostrarEstadoCarga(false);

    } catch (error) {
        console.error('Error cargando datos:', error);
        mostrarErrorGeneral('⚠️ Error al cargar los datos. Por favor, recarga la página.');
        mostrarEstadoCarga(false);
    }
}

function mostrarEstadoCarga(mostrar) {
    let loader = document.getElementById('loader-overlay');
    if (mostrar) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-overlay';
            loader.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(255,255,255,0.9); display: flex;
                justify-content: center; align-items: center; z-index: 9999;
                font-size: 1.2rem; color: #0a4b6e;
            `;
            loader.innerHTML = '<div>Cargando datos... ⏳</div>';
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    } else if (loader) {
        loader.style.display = 'none';
    }
}

function inicializarPagina() {
    llenarDias();
    llenarMeses();
    llenarAnios();

    if (tiposData && tiposData.tipos) {
        llenarTiposInformacion(tiposData.tipos);
    }

    if (municipiosData && municipiosData.municipios) {
        cargarRegiones();
    } else if (municipiosData && municipiosData.municipalidades) {
        municipiosData.municipios = municipiosData.municipalidades;
        cargarRegiones();
    } else {
        console.error('No se encontraron datos de municipalidades');
        mostrarErrorGeneral('⚠️ Error en los datos de municipalidades.');
    }

    const fechaSpan = document.getElementById('fecha-actualizacion');
    if (fechaSpan && municipiosData?.metadata?.ultima_actualizacion) {
        fechaSpan.textContent = `📅 Datos actualizados: ${municipiosData.metadata.ultima_actualizacion}`;
    }

    configurarEventos();
    actualizarVistaPrevia();
}

function cargarRegiones() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect || !municipiosData?.municipios) return;

    const regiones = [...new Set(municipiosData.municipios.map(m => m.region))].sort();

    regionSelect.innerHTML = '<option value="">Selecciona una región</option>';
    regiones.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

function cargarComunas() {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const regionSeleccionada = regionSelect?.value;

    if (!comunaSelect || !regionSeleccionada || !municipiosData?.municipios) {
        return;
    }

    const comunas = municipiosData.municipios
        .filter(m => m.region === regionSeleccionada)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
    comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna.nombre;
        option.textContent = comuna.nombre;
        option.setAttribute('data-email', comuna.email_transparencia || '');
        option.setAttribute('data-email-alternativo', comuna.email_alternativo || '');
        comunaSelect.appendChild(option);
    });

    comunaSelect.disabled = false;

    // Mostrar emails si ya hay una comuna seleccionada
    if (comunaSelect.value) {
        mostrarEmailsDisponibles();
    }
}

function mostrarEmailsDisponibles() {
    const comunaSelect = document.getElementById('comuna');
    const emailSelectorGroup = document.getElementById('emailSelectorGroup');
    const emailOptions = document.getElementById('emailOptions');

    const selectedOption = comunaSelect.options[comunaSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) {
        emailSelectorGroup.style.display = 'none';
        return;
    }

    const emailPrimario = selectedOption.getAttribute('data-email');
    const emailAlternativo = selectedOption.getAttribute('data-email-alternativo');

    if (!emailPrimario && !emailAlternativo) {
        emailSelectorGroup.style.display = 'none';
        return;
    }

    let html = '';
    let checked = 'checked';

    if (emailPrimario) {
        html += `
            <label class="radio-label">
                <input type="radio" name="emailSeleccionado" value="${emailPrimario}" ${checked}>
                <div class="radio-content">
                    <strong>📬 Correo principal</strong>
                    <code>${emailPrimario}</code>
                    <span class="badge verified">Verificado</span>
                </div>
            </label>
        `;
        checked = '';
    }

    if (emailAlternativo) {
        html += `
            <label class="radio-label">
                <input type="radio" name="emailSeleccionado" value="${emailAlternativo}" ${checked}>
                <div class="radio-content">
                    <strong>🔄 Correo alternativo</strong>
                    <code>${emailAlternativo}</code>
                    <span class="badge alternative">Respaldo</span>
                </div>
            </label>
        `;
    }

    emailOptions.innerHTML = html;
    emailSelectorGroup.style.display = 'block';

    document.querySelectorAll('input[name="emailSeleccionado"]').forEach(radio => {
        radio.addEventListener('change', () => actualizarVistaPrevia());
    });

    actualizarVistaPrevia();
}

function actualizarVistaPrevia() {
    const vistaPrevia = document.getElementById('vistaPrevia');
    if (!vistaPrevia || !tiposData?.tipos) return;

    const texto = generarTextoCorreo(tiposData.tipos);
    vistaPrevia.textContent = texto;
}

function configurarEventos() {
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            cargarComunas();
        });
    }

    const comunaSelect = document.getElementById('comuna');
    if (comunaSelect) {
        comunaSelect.addEventListener('change', () => {
            mostrarEmailsDisponibles();
            actualizarVistaPrevia();
        });
    }

    const camposActualizar = ['nombre', 'correo', 'telefono', 'numeroReclamo', 'direccion', 'dia', 'mes', 'anio', 'tipoInfo', 'otroTexto'];
    camposActualizar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', () => actualizarVistaPrevia());
            campo.addEventListener('change', () => actualizarVistaPrevia());
        }
    });

    const tipoInfoSelect = document.getElementById('tipoInfo');
    if (tipoInfoSelect && tiposData?.tipos) {
        tipoInfoSelect.addEventListener('change', () => {
            toggleCampoOtro(tipoInfoSelect.value, tiposData.tipos);
            actualizarVistaPrevia();
        });
    }

    const btnEditar = document.getElementById('btnEditar');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            const vistaPrevia = document.getElementById('vistaPrevia');
            if (vistaPrevia) {
                if (vistaPrevia.contentEditable === 'true') {
                    vistaPrevia.contentEditable = 'false';
                    btnEditar.textContent = '✏️ Editar texto';
                } else {
                    vistaPrevia.contentEditable = 'true';
                    btnEditar.textContent = '💾 Guardar cambios';
                    vistaPrevia.focus();
                }
            }
        });
    }

    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            if (validarFormulario() && tiposData?.tipos) {
                abrirCorreo(tiposData.tipos);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', cargarDatos);
