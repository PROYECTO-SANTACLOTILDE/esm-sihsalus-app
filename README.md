![Node.js CI](https://github.com/openmrs/openmrs-esm-template-app/workflows/Node.js%20CI/badge.svg)

# OpenMRS ESM Template App

Este repositorio es un punto de partida para crear tu propio [Microfrontend de OpenMRS](https://wiki.openmrs.org/display/projects/OpenMRS+3.0%3A+A+Frontend+Framework+that+enables+collaboration+and+better+User+Experience).

Consulta la [Documentación para Desarrolladores Frontend de OpenMRS](https://o3-docs.openmrs.org/#/) para más información.

- La sección de [Configuración](https://o3-docs.openmrs.org/docs/frontend-modules/setup) te ayudará a iniciar el desarrollo de microfrontends.
- La guía [Crear un microfrontend](https://o3-docs.openmrs.org/docs/recipes/create-a-frontend-module) explica cómo usar este repositorio para tu propio proyecto.

## Ejecución local

```sh
yarn        # Instala las dependencias
yarn start  # Inicia el servidor de desarrollo
```

Una vez iniciado, se abrirá una ventana del navegador con la aplicación OpenMRS 3. Inicia sesión y navega a `/openmrs/spa/root`.

## Personalización

1. Reemplaza todas las instancias de "template" por el nombre de tu microfrontend.
2. Actualiza `index.ts` cambiando el nombre de la funcionalidad, la página y la ruta.
3. Renombra los archivos `root.*` usando el nombre de tu primera página.
4. Borra el contenido de los objetos en `config-schema` y complétalos según tus necesidades.
5. Elimina los directorios `greeter` y `patient-getter`, y el contenido de `root.component.tsx`.
6. Borra el contenido de `translations/en.json`.
7. Adapta los flujos de trabajo en `.github/workflows` según tu caso. Si tu microfrontend será gestionado por la comunidad, reemplaza "template" por el nombre de tu microfrontend. Si es para una organización específica, configura GitHub Actions según tus requerimientos.
8. Finalmente, reemplaza este README con una breve explicación de tu proyecto y, si es posible, enlaza documentos de planificación o diseño.

Ahora puedes comenzar a desarrollar tu primera página como una aplicación React.

Ejemplo de microfrontend: [Medication dispensing app](https://github.com/openmrs/openmrs-esm-dispensing-app).

## Integración

Para integrar tu microfrontend, revisa la guía [Crear un módulo frontend](https://o3-docs.openmrs.org/docs/recipes/create-a-frontend-module).
