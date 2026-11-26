# Citer

Prototipo móvil Ionic + Angular + Capacitor para reservar citas en pequeños negocios.

## Abrir y probar

Desde una terminal en esta carpeta:

```bash
npm install
ionic serve
```

Para abrir el proyecto Android en Android Studio, abre la carpeta `android` desde Android Studio. Después de modificar la interfaz web, actualiza la parte nativa con:

```bash
ionic build
npx cap sync android
```

También puedes abrir Android Studio desde la terminal con `npx cap open android` una vez que esté instalado.

## Qué incluye

- Pantalla de bienvenida y exploración por categoría o búsqueda.
- Ficha de negocio, selección de servicio, fecha, horario y datos de reserva.
- Confirmación con código de cita de demostración.
- Gestos: deslizar para eliminar un negocio de la lista, deslizar hacia abajo para actualizar, pellizcar para ampliar la imagen y mantener pulsado un negocio para abrir acciones.
- Componentes Ionic: `ion-card`, `ion-list`, `ion-item-sliding`, `ion-refresher`, `ion-fab`, `ion-menu` e `ion-split-pane` para tabletas.

Los negocios y horarios son datos de ejemplo. El inicio de sesión, las reservas en un servidor, Google Calendar y el envío por WhatsApp todavía no están conectados; los botones correspondientes muestran mensajes de demostración.
