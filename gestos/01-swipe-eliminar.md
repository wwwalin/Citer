# Gesto 1 — Swipe para eliminar

**Propósito:** permitir quitar de la lista un negocio que ya no interesa, con una acción lateral visible.

**HTML:**
```html
<ion-item-sliding *ngFor="let business of filteredBusinesses">
  <ion-item button (click)="openBusiness(business)">...</ion-item>
  <ion-item-options side="end">
    <ion-item-option color="danger" (click)="removeBusiness(business)">
      <ion-icon name="trash-outline"></ion-icon><span>Eliminar</span>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```

**TypeScript:**
```ts
removeBusiness(business: Business): void {
  this.businesses = this.businesses.filter(item => item.name !== business.name);
  this.savedBusinesses = this.savedBusinesses.filter(name => name !== business.name);
  void this.showToast(`${business.name} eliminado de la lista`);
}
```

**Captura requerida:** `capturas/01-swipe-eliminar.png`, con el elemento deslizado y la opción visible; en otra captura o en video, mostrar que se elimina al tocarla.
