# Gesto 2 — Pull-to-refresh

**Propósito:** actualizar la lista de negocios disponibles con un gesto familiar de arrastre hacia abajo.

**HTML:**
```html
<ion-refresher slot="fixed" (ionRefresh)="refreshBusinesses($event)">
  <ion-refresher-content pullingText="Desliza para actualizar" refreshingText="Actualizando...">
  </ion-refresher-content>
</ion-refresher>
```

**TypeScript:**
```ts
refreshBusinesses(event: CustomEvent): void {
  this.businesses = [...this.businesses];
  window.setTimeout(() => {
    (event.target as HTMLIonRefresherElement).complete();
    void this.showToast('Lista de negocios actualizada');
  }, 650);
}
```

**Captura requerida:** `capturas/02-pull-to-refresh.png`, durante el indicador o justo al mostrar la lista actualizada.
