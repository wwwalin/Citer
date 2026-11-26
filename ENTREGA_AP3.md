# AP3 — Interfaces, gestos y menú de Citer

## Interfaces
- `01-explorar.html`: lista de negocios con ion-searchbar, ion-list, ion-item-sliding, ion-refresher e ion-fab.
- `02-servicio.html`: detalle y elección del servicio con ion-card, ion-list e ion-button.
- `03-reserva.html`: selección de fecha/hora y datos con ion-card, ion-list e ion-button.
- Las capturas de las tres pantallas deben agregarse en `interfaces/capturas/` después de ejecutarlas en el emulador o dispositivo.

## Gestos
El código completo y los controladores están en `gestos/home.page.ts`; el HTML base está en `src/app/home/home.page.html`.
1. Swipe para eliminar: `ion-item-sliding` + `removeBusiness()`.
2. Pull-to-refresh: `ion-refresher` + `refreshBusinesses()`.
3. Pinch/zoom: `onPinchStart()`, `onPinchMove()`, `onPinchEnd()`.
4. Long-press: `startLongPress()` abre una hoja de acciones y `saveBusiness()` guarda el favorito.

Agrega capturas en `gestos/capturas/` que muestren cada gesto ejecutándose.

## Menú
`menu/app.component.html` incluye ion-menu con navegación, iconos, encabezado Citer y ion-split-pane para tabletas. Agrega su captura ejecutándose en `menu/capturas/`.

## Verificación
`npm run build` completó correctamente el 25 de noviembre de 2026. El video de demostración de 2 a 3 minutos se debe grabar en el emulador/dispositivo y añadirse a la entrega.
