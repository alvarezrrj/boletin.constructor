# Boletin

## TO DO

- Replace local installation of firepad-x with npm package once PRs are closed.
- Upload images to WP
- Upload web version to WP

## Tech stack

- [**Vue**](https://vuejs.org/)
- [**Github pages**](https://pages.github.com/): para servir la aplicación, disponible en https://alvarezrrj.github.io/boletin/
- [**Firebase**](https://firebase.google.com/products/hosting/): para autenticación y colaboración en tiempo real.
- [**API Wordpress**](https://developer.wordpress.org/rest-api/reference/): para subir imágenes.

El código fuente del frontend está almacenado en github como proyecto público y la aplicación es servida por github pages. El frontend no contiene información sensible acerca de vipassana.

Para poder acceder al constructor de boletines el usuario necesita loguearse en la app firebase con usuario y contraseña. Una vez logueado, puede usar la UI para subir imágenes a la web y redactar el boletín. El contenido del boletín se almacena en firebase, protegido por usuario y contraseña. Y las imágenes se almacenan en la aplicación wordpress que contiene la web.

Las llamadas a wordpress son autenticadas mediante [_application passwords_](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/). Las contraseñas de aplicación son guardadas en memoria.
