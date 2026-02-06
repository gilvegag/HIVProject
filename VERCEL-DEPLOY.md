# 🚀 Desplegar La Fuente a Vercel

## Paso 1: Preparar el Proyecto ✅

Ya está listo! El código ha sido pusheado a GitHub:
- Repositorio: `https://github.com/gilvegag/HIVProject.git`
- Branch: `main`

## Paso 2: Conectar con Vercel

### Opción A: Desde la Web (Recomendado)

1. **Ve a Vercel:**
   - Visita: https://vercel.com
   - Inicia sesión con tu cuenta de GitHub

2. **Importar Proyecto:**
   - Click en "Add New..." → "Project"
   - Busca el repositorio: `HIVProject`
   - Click en "Import"

3. **Configurar el Proyecto:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: next build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variables de Entorno (Opcional):**
   Si quieres el chat en tiempo real, agrega:
   ```
   NEXT_PUBLIC_API_URL = https://tu-servidor-backend.com
   ```
   
   **Nota:** Para el modo demo (con Luna27), no necesitas backend.

5. **Deploy:**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! 🎉

### Opción B: Desde la Terminal

```bash
# Instala Vercel CLI globalmente
npm i -g vercel

# Desde la carpeta del proyecto
cd /Users/gilbert.vega/HIV

# Login a Vercel
vercel login

# Desplegar (primera vez)
vercel

# Seguir las instrucciones:
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - Project name? la-fuente
# - Directory? ./
# - Override settings? No

# Desplegar a producción
vercel --prod
```

## Paso 3: Configuración Post-Deploy

### Si usas el backend real:

El backend (servidor Socket.io) necesita desplegarse por separado. Opciones:

**Railway.app:**
```bash
# Desde la carpeta server/
cd server
railway login
railway init
railway up
```

**Render.com:**
1. Ve a https://render.com
2. New → Web Service
3. Conecta el repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`

Luego actualiza la variable en Vercel:
```
NEXT_PUBLIC_API_URL = https://tu-backend.railway.app
```

### Solo Modo Demo (Sin Backend):

¡No necesitas hacer nada! La app funciona con Luna27 como peer ficticio.

## Paso 4: Verificar el Deploy

Una vez desplegado, Vercel te dará una URL como:
```
https://la-fuente.vercel.app
```

**Flujo de testing:**
1. Visita la URL
2. Click en "Hablar con alguien ahora"
3. Llena el formulario (nombre, edad, provincia)
4. Acepta los términos
5. Verás a Luna27 🌙 disponible
6. Click en Luna27
7. Envía mensajes → Recibes respuestas automáticas

## Configuración Avanzada

### Custom Domain:
1. En Vercel Dashboard → Settings → Domains
2. Add domain: `lafuente.cr` (o tu dominio)
3. Sigue las instrucciones para configurar DNS

### Analytics:
Vercel automáticamente incluye analytics básicos.

### Optimizaciones:
- ✅ Images optimizadas automáticamente por Next.js
- ✅ Caching automático
- ✅ CDN global
- ✅ SSL/HTTPS incluido

## Archivos Importantes

- **`package.json`**: Dependencias del proyecto
- **`.vercelignore`**: Archivos que NO se suben a Vercel
- **`.env.local.example`**: Template para variables de entorno

## Troubleshooting

### Error: "Module not found"
```bash
# Localmente, verifica que todo funcione:
npm install
npm run build
npm start
```

### Error de build en Vercel
- Revisa los logs en Vercel Dashboard
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `next.config.js` sea correcto

### El chat no funciona
Si el chat real no funciona pero el modo demo sí:
- El backend no está corriendo o configurado
- Verifica `NEXT_PUBLIC_API_URL`
- El modo demo (Luna27) siempre funciona sin backend

## Monitoreo

### Ver logs en tiempo real:
```bash
vercel logs [url-del-proyecto]
```

### Ver métricas:
- Dashboard de Vercel → Analytics
- Visitas, performance, errores

## Re-deploys

Cada vez que hagas push a `main`:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel **automáticamente desplegará** la nueva versión. 🚀

---

## URLs Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Next.js**: https://nextjs.org/docs
- **Reshaped Docs**: https://reshaped.so/docs
- **Tu GitHub Repo**: https://github.com/gilvegag/HIVProject

---

**¡Tu app está lista para el mundo!** 🌍✨
