# Cómo contribuir a SolicitaTransparencia

¡Gracias por tu interés en mejorar esta herramienta ciudadana! Tu ayuda es valiosa para mantener los datos actualizados y la herramienta funcionando.

---

## 📋 ¿Cómo puedes ayudar?

### 1. Actualizar correos de municipalidades

Si encuentras que el correo de transparencia de una comuna ha cambiado o no funciona:

1. Abre el archivo `data/municipios.json`
2. Busca la municipalidad por nombre
3. Actualiza `email_transparencia` o `email_alternativo`
4. Cambia `estado` a `"verificado"` y actualiza `ultima_verificacion`
5. Haz un Pull Request

**Formato esperado:**
{
  "region": "Metropolitana",
  "nombre": "Providencia",
  "email_transparencia": "transparencia@providencia.cl",
  "email_alternativo": "oirs@providencia.cl",
  "dominio": "providencia.cl",
  "estado": "verificado",
  "ultima_verificacion": "2026-03-24"
}

### 2. Agregar nuevas municipalidades

Si falta alguna comuna en el archivo:

1. Busca el sitio web oficial de la municipalidad
2. Encuentra el correo de transparencia (generalmente en la sección "Transparencia")
3. Agrega la nueva entrada con `estado: "verificado"`
4. Actualiza `total_municipalidades` en `metadata`

### 3. Mejorar tipos de información

Si crees que falta algún tipo de información relevante:

1. Abre `data/tipos_informacion.json`
2. Agrega un nuevo objeto siguiendo el formato:
{
  "id": "nuevo_tipo",
  "nombre": "Nombre del tipo",
  "icono": "🆕"
}

### 4. Mejoras de código o diseño

- Corregir errores
- Mejorar la accesibilidad
- Optimizar rendimiento
- Mejorar estilos responsive

---

## 🔧 Cómo hacer un Pull Request

1. **Fork** este repositorio
2. **Clona** tu fork:
   git clone https://github.com/tu-usuario/solicitatransparencia.git
3. **Crea una rama** para tu cambio:
   git checkout -b mi-mejora
4. **Realiza tus cambios** y haz commit:
   git add .
   git commit -m "Descripción clara del cambio"
5. **Sube** tu rama:
   git push origin mi-mejora
6. Abre un **Pull Request** desde tu fork a este repositorio

---

## 📝 Reportar problemas

Si encuentras un error o un correo que no funciona:

1. Abre un **Issue** en GitHub
2. Describe el problema claramente
3. Incluye:
   - Comuna afectada
   - Correo que no funciona
   - Captura de pantalla si aplica

---

## ✅ Reglas básicas

- Respeta el formato JSON existente
- Verifica que los correos sean correctos antes de marcarlos como `verificado`
- Sé amable y constructivo en los comentarios

---

## 📧 Contacto

Si tienes dudas, abre un Issue o contacta al mantenedor.

---

**¡Gracias por contribuir a la transparencia!**
