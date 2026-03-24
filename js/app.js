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
        // Mostrar estado de carga
        mostrarEstadoCarga(true);

        // Cargar municipalidades
        const responseMunicipios = await fetch('data/municipios.json');
        if (!responseMunicipios.ok) throw new Error('Error cargando municipalidades');
        municipiosData = await responseMunicipios.json();

        // Cargar tipos de información
        const responseTipos = await fetch('data/tipos_informacion.json');
        if (!responseTipos.ok) throw new Error('Error cargando tipos de información');
        tiposData = await responseTipos.json();

        // Inicializar la página con los datos
        inicializarPagina();

        // Ocultar estado de carga
        mostrarEstadoCarga(false);

    } catch (error) {
        console.error('Error cargando datos:', error);
        mostrarErrorGeneral('⚠️ Error al cargar los datos. Por favor, recarga la página.');
        mostrarEstadoCarga(false);
    }
}

/**
 * Muestra u oculta el estado de carga
 */
function mostrarEstadoCarga(mostrar) {
    const main = document.querySelector('main');
    if (!main) return;

    if (mostrar) {
        // Crear overlay de carga si no existe
        let loader = document.getElementById('loader-overlay');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-overlay';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-size: 1.2rem;
                color: var(--color-primary);
            `;
            loader.innerHTML = '<div>Cargando datos... ⏳</div>';
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    } else {
        const loader = document.getElementById('loader-overlay');
        if (loader) loader.style.display = 'none';
    }
}

/**
 * Inicializa la página después de cargar los datos
 */
function inicializarPagina() {
    // Llenar selectores de fecha
    llenarDias();
    llenarMeses();
    llenarAnios();

    // Llenar tipos de información
    if (tiposData && tiposData.tipos) {
        llenarTiposInformacion(tiposData.tipos);
    }

    // Cargar regiones (si hay datos)
    if (municipiosData && municipiosData.municipios) {
        cargarRegiones();
    } else if (municipiosData && municipiosData.municipalidades) {
        // Compatibilidad con nombre alternativo
        municipiosData.municipios = municipiosData.municipalidades;
        cargarRegiones();
    } else {
        console.error('No se encontraron datos de municipalidades');
        mostrarErrorGeneral('⚠️ Error en los datos de municipalidades. Contacta al administrador.');
    }

    // Actualizar fecha de actualización
    const fechaSpan = document.getElementById('fecha-actualizacion');
    if (fechaSpan && municipiosData?.metadata?.ultima_actualizacion) {
        fechaSpan.textContent = `📅 Datos actualizados: ${municipiosData.metadata.ultima_actualizacion}`;
    }

    // Configurar eventos
    configurarEventos();

    // Generar vista previa inicial
    actualizarVistaPrevia();
}

/**
 * Carga las regiones únicas desde los datos de municipalidades
 */
function cargarRegiones() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect || !municipiosData?.municipios) return;

    // Obtener regiones únicas y ordenarlas alfabéticamente
    const regiones = [...new Set(municipiosData.municipios.map(m => m.region))].sort();

    regionSelect.innerHTML = '<option value="">Selecciona una región</option>';
    regiones.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

/**
 * Carga las comunas según la región seleccionada
 */
function cargarComunas() {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const regionSeleccionada = regionSelect?.value;

    if (!comunaSelect || !regionSeleccionada || !municipiosData?.municipios) {
        return;
    }

    // Filtrar comunas por región y ordenar alfabéticamente
    const comunas = municipiosData.municipios
        .filter(m => m.region === regionSeleccionada)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
    comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna.nombre;
        option.textContent = comuna.nombre;
        option.setAttribute('data-email', comuna.email_transparencia);
        option.setAttribute('data-email-alternativo', comuna.email_alternativo || '');
        comunaSelect.appendChild(option);
    });

    comunaSelect.disabled = false;

    // Actualizar vista previa
    actualizarVistaPrevia();
}

/**
 * Actualiza la vista previa del correo
 */
function actualizarVistaPrevia() {
    const vistaPrevia = document.getElementById('vistaPrevia');
    if (!vistaPrevia || !tiposData?.tipos) return;

    const texto = generarTextoCorreo(tiposData.tipos);
    vistaPrevia.textContent = texto;
}

/**
 * Configura todos los eventos de la página
 */
function configurarEventos() {
    // Evento para cambiar región
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            cargarComunas();
        });
    }

    // Evento para cambiar comuna
    const comunaSelect = document.getElementById('comuna');
    if (comunaSelect) {
        comunaSelect.addEventListener('change', () => actualizarVistaPrevia());
    }

    // Eventos de campos que actualizan vista previa
    const camposActualizar = ['nombre', 'correo', 'telefono', 'numeroReclamo', 'direccion', 'dia', 'mes', 'anio', 'tipoInfo', 'otroTexto'];
    camposActualizar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', () => actualizarVistaPrevia());
            campo.addEventListener('change', () => actualizarVistaPrevia());
        }
    });

    // Evento para tipo de información (mostrar/ocultar campo "otro")
    const tipoInfoSelect = document.getElementById('tipoInfo');
    if (tipoInfoSelect && tiposData?.tipos) {
        tipoInfoSelect.addEventListener('change', () => {
            toggleCampoOtro(tipoInfoSelect.value, tiposData.tipos);
            actualizarVistaPrevia();
        });
    }

    // Botón editar (permite editar el texto en la vista previa)
    const btnEditar = document.getElementById('btnEditar');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            const vistaPrevia = document.getElementById('vistaPrevia');
            if (vistaPrevia) {
                if (vistaPrevia.contentEditable === 'true') {
                    vistaPrevia.contentEditable = 'false';
                    btnEditar.textContent = '✏️ Editar texto';
                    btnEditar.classList.remove('btn-editing');
                } else {
                    vistaPrevia.contentEditable = 'true';
                    btnEditar.textContent = '💾 Guardar cambios';
                    btnEditar.classList.add('btn-editing');
                    vistaPrevia.focus();
                }
            }
        });
    }

    // Botón enviar
    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            if (validarFormulario() && tiposData?.tipos) {
                abrirCorreo(tiposData.tipos);
            }
        });
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarDatos);
