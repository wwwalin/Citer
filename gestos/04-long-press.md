# Gesto 4 — Long-press contextual

**Propósito:** abrir acciones rápidas (guardar favorito o ver servicios) sin ocupar espacio permanente en cada tarjeta.

**HTML:**
```html
<ion-item button
  (pointerdown)="startLongPress(business)"
  (pointerup)="cancelLongPress()"
  (pointerleave)="cancelLongPress()"
  (pointermove)="cancelLongPress()"
  (click)="openBusiness(business)">...</ion-item>
```

**TypeScript:**
```ts
startLongPress(business: Business): void {
  this.cancelLongPress();
  this.longPressTimer = window.setTimeout(() => {
    this.suppressNextBusinessClick = true;
    void this.showBusinessActions(business);
  }, 550);
}
```

**Captura requerida:** `capturas/04-long-press.png`, con la hoja de acciones abierta.
