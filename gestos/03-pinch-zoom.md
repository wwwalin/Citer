# Gesto 3 — Pinch/zoom

**Propósito:** ampliar la foto del negocio para que el usuario pueda observar mejor el lugar antes de reservar.

**HTML:**
```html
<ion-card class="business-cover"
  (touchstart)="onPinchStart($event)"
  (touchmove)="onPinchMove($event)"
  (touchend)="onPinchEnd()">
  <img class="cover-art" src="assets/studio-nova.svg"
    [style.transform]="'scale(' + imageScale + ')'">
</ion-card>
```

**TypeScript:**
```ts
onPinchMove(event: TouchEvent): void {
  if (event.touches.length !== 2 || !this.pinchStartDistance) return;
  const ratio = this.touchDistance(event.touches[0], event.touches[1]) / this.pinchStartDistance;
  this.imageScale = Math.min(2.5, Math.max(1, this.pinchStartScale * ratio));
}
```

**Captura requerida:** `capturas/03-pinch-zoom.png`, con la imagen ampliada en el emulador o dispositivo.
