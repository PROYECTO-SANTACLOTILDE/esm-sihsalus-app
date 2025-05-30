# Guía de Debugging para OpenMRS ESM SIHSALUS App

## 🚀 Configuración de Debugging

Esta guía te ayudará a configurar y usar el debugging efectivamente en VSCode para el proyecto OpenMRS.

## 📋 Prerequisitos

1. **VSCode** instalado
2. **Node.js** v16 o superior
3. **Chrome/Chromium** para debugging del frontend
4. Extensiones recomendadas de VSCode (se instalarán automáticamente)

## 🛠️ Configuraciones Disponibles

### 1. Debug OpenMRS App
Inicia la aplicación OpenMRS en modo desarrollo con debugging habilitado.

**Cómo usar:**
1. Ve a la pestaña "Run and Debug" (Ctrl+Shift+D)
2. Selecciona "Debug OpenMRS App"
3. Presiona F5 o el botón ▶️

### 2. Debug Webpack Dev Server
Inicia el servidor de desarrollo de Webpack con debugging.

**Cómo usar:**
1. Selecciona "Debug Webpack Dev Server"
2. Presiona F5
3. El servidor estará disponible en `http://localhost:8080`

### 3. Debug Chrome
Lanza Chrome con debugging habilitado para el frontend.

**Cómo usar:**
1. Asegúrate de que el servidor esté corriendo
2. Selecciona "Debug Chrome"
3. Presiona F5 - se abrirá Chrome con debugging

### 4. Debug Chrome (Attach)
Se conecta a una instancia existente de Chrome con debugging.

**Cómo usar:**
1. Ejecuta la tarea "Chrome: Launch with Debug Port" primero
2. Selecciona "Debug Chrome (Attach)"
3. Presiona F5

### 5. Debug Full Stack
Ejecuta tanto el servidor como Chrome simultáneamente.

**Cómo usar:**
1. Selecciona "Debug Full Stack"
2. Presiona F5
3. Se iniciará el servidor y Chrome automáticamente

## 🔧 Comandos Disponibles

Usa Ctrl+Shift+P y busca estas tareas:

- **OpenMRS: Start Development Server** - Inicia el servidor normal
- **OpenMRS: Start Debug Server** - Inicia con debugging
- **OpenMRS: Build Project** - Construye el proyecto
- **OpenMRS: Run Tests** - Ejecuta las pruebas
- **OpenMRS: Lint Code** - Verifica el código
- **OpenMRS: TypeScript Check** - Verifica tipos TypeScript

## 🐛 Debugging de tu Código

### Colocar Breakpoints

1. **En VSCode**: Haz clic en el margen izquierdo del editor (línea roja)
2. **En Chrome DevTools**: F12 → Sources → encuentra tu archivo → click en línea
3. **Breakpoints condicionales**: Click derecho en breakpoint → Edit breakpoint

### Debugging del Workspace CRED

Para debuggear específicamente tu componente:

```typescript
// En well-child-controls-form.workspace.tsx
const handleFormOpen = useCallback(
  (form: FormType, encounterUuid: string) => {
    debugger; // 🚨 Breakpoint manual
    const consultationData = watch();
    
    // Tu código aquí...
  },
  [watch, patientUuid, currentVisit],
);
```

### Variables Útiles para Inspeccionar

- `patient` - Datos del paciente
- `currentVisit` - Visita actual
- `availableForms` - Formularios disponibles
- `formData` - Datos del formulario
- `errors` - Errores de validación

## 🎯 Tips de Debugging

### 1. Source Maps
Los source maps están habilitados, así que puedes debuggear el código TypeScript original.

### 2. Console Debugging
```typescript
console.log('🔍 Debug:', { patient, formData });
console.table(availableForms);
console.group('Form Validation');
console.error('Error details:', error);
console.groupEnd();
```

### 3. React DevTools
Instala React DevTools en Chrome para inspeccionar componentes React.

### 4. Redux DevTools
Si usas Redux, instala Redux DevTools para inspeccionar el estado.

## 🔍 Debugging Común

### Error: "Cannot find module"
```bash
npm install
npm run build
```

### Error de CORS
Usa la configuración "Debug Chrome" que deshabilita CORS.

### Breakpoints no funcionan
1. Verifica que source maps estén habilitados
2. Asegúrate de estar en modo desarrollo
3. Refresca Chrome (F5)

### Performance Issues
1. Usa Chrome DevTools → Performance tab
2. Revisa el Network tab para peticiones lentas
3. Usa React Profiler para componentes lentos

## 📚 Recursos Adicionales

- [VSCode Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [OpenMRS Frontend Documentation](https://openmrs.github.io/openmrs-esm-core/)

## 🆘 Solución de Problemas

### Puerto 8080 ocupado
```bash
npx kill-port 8080
```

### Chrome no se conecta
1. Cierra todas las instancias de Chrome
2. Ejecuta "Chrome: Launch with Debug Port"
3. Usa "Debug Chrome (Attach)"

### TypeScript Errors
```bash
npm run typescript
npm run lint --fix
```

---

**¡Happy Debugging! 🐛➡️✨**
