# Fuentes de datos de SolicitaTransparencia

Este documento detalla las fuentes utilizadas para construir la base de datos de municipalidades y sus correos de transparencia.

---

## 🏛️ Municipalidades y correos

Los datos fueron recopilados manualmente desde los sitios web oficiales de cada municipalidad durante **marzo de 2026**.

### Metodología

1. **Búsqueda del sitio oficial**: Se identificó el dominio oficial de cada municipalidad (generalmente `nombre.cl`, `muninombre.cl` o `municipalidadnombre.cl`).

2. **Localización del correo de transparencia**: Se revisaron las siguientes secciones:
   - "Transparencia Activa" o "Transparencia"
   - "OIRS" (Oficina de Informaciones, Reclamos y Sugerencias)
   - "Contacto"
   - Portal de Transparencia del municipio

3. **Verificación**: Los correos con `estado: "verificado"` fueron probados o confirmados en fuentes oficiales.

---

## 📊 Fuentes primarias

| Fuente | Uso |
|--------|-----|
| Sitios web municipales | Correos de transparencia y alternativos |
| Portal de Transparencia (portaltransparencia.cl) | Verificación de existencia |
| Subsecretaría de Desarrollo Regional (SUBDERE) | Listado oficial de comunas y regiones |

---

## 🔍 Casos especiales

Algunas municipalidades no siguen el patrón estándar `transparencia@municipio.cl`:

| Comuna | Correo | Nota |
|--------|--------|------|
| Valparaíso | transparencia@eb.municipalidaddevalparaiso.cl | Dominio con subdominio `eb` |
| Petorca | transparencia@munipetorca.com | Dominio .com |
| Tirúa | transparencia@munitirua.com | Dominio .com |
| Los Sauces | transparencia@munilossauces.com | Dominio .com |
| La Unión | transparencia@munilaunioninfo.com | Dominio .com |

---

## 📧 Correos alternativos

Todas las municipalidades tienen al menos un correo alternativo (generalmente `oirs@...` o `contacto@...`) como respaldo. Estos correos son útiles si el correo principal de transparencia falla.

---

## 📊 Estado de los datos

| Estado | Significado |
|--------|-------------|
| verificado | Correo confirmado en sitio oficial, funciona |
| pendiente | Correo estimado por patrón, requiere verificación |

---

## 🔄 Actualizaciones

Los datos se actualizan periódicamente. La última actualización fue: **2026-03-23**

Si encuentras un correo desactualizado, por favor abre un Issue o Pull Request.

---

## 📜 Licencia de los datos

Los datos de municipalidades son de dominio público (información pública). Su recopilación y estructura en este proyecto está bajo licencia MIT.

---

**¿Quieres ayudar a mejorar estos datos?** Revisa contribuir.md para saber cómo.
