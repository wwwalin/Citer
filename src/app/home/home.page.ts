import { Component, HostListener } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular/lazy';

type Screen = 'welcome' | 'explore' | 'service' | 'booking' | 'confirmed';
type Category = 'Todos' | 'Peluquería' | 'Uñas' | 'Barbería';

interface Business {
  name: string;
  service: string;
  category: Category;
  rating: string;
  reviews: number;
  distance: string;
  from: number;
  nextSlot: string;
  initials: string;
  address: string;
}

interface AppointmentDay {
  iso: string;
  weekday: string;
  number: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  screen: Screen = 'welcome';
  searchText = '';
  selectedCategory: Category = 'Todos';
  currentBusiness?: Business;
  selectedService = { name: 'Corte clásico', duration: 30, price: 300 };
  selectedDate = '';
  selectedTime = '10:30 AM';
  bookingCode = 'CIT-261124';
  savedBusinesses: string[] = [];
  showSavedOnly = false;
  hasBooking = false;
  imageScale = 1;
  private pinchStartDistance = 0;
  private pinchStartScale = 1;
  private pinchInProgress = false;
  private imageTouchStart?: { clientX: number; clientY: number };
  private imageTouchMoved = false;
  private lastImageTap?: { clientX: number; clientY: number; time: number };
  private lastZoomToggleAt = 0;
  private longPressTimer?: number;
  private suppressNextBusinessClick = false;
  customer = { name: '', phone: '', email: '' };
  categories: Category[] = ['Todos', 'Peluquería', 'Uñas', 'Barbería'];
  times = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:30 PM', '2:00 PM'];
  businesses: Business[] = [
    { name: 'Studio Nova', service: 'Corte · ★ 4.8', category: 'Peluquería', rating: '4.8', reviews: 86, distance: 'A 0.8 km', from: 300, nextSlot: '10:30', initials: 'SN', address: '12 Barrington St' },
    { name: 'Casa del Cabello', service: 'Color · ★ 4.6', category: 'Peluquería', rating: '4.6', reviews: 52, distance: 'A 1.4 km', from: 400, nextSlot: '11:15', initials: 'CC', address: '8 Calle del Sol' },
    { name: 'Barbería Central', service: 'Barbería · ★ 4.9', category: 'Barbería', rating: '4.9', reviews: 104, distance: 'A 1.1 km', from: 250, nextSlot: '12:00', initials: 'BC', address: '24 Calle Restauración' },
    { name: 'Luna Nails', service: 'Manicura · ★ 4.7', category: 'Uñas', rating: '4.7', reviews: 63, distance: 'A 1.7 km', from: 350, nextSlot: '1:00', initials: 'LN', address: '17 Calle del Sol' },
    { name: 'Salón Aurora', service: 'Color y peinado · ★ 4.8', category: 'Peluquería', rating: '4.8', reviews: 71, distance: 'A 2.0 km', from: 450, nextSlot: '2:30', initials: 'SA', address: '31 Calle Duarte' },
  ];
  services = [
    { name: 'Corte clásico', duration: 30, price: 300 },
    { name: 'Corte + Degradado', duration: 45, price: 500 },
    { name: 'Peinado', duration: 40, price: 200 },
  ];
  days: AppointmentDay[] = this.makeUpcomingDays();

  constructor(private toastController: ToastController, private actionSheetController: ActionSheetController) {
    this.selectedDate = this.days[0]?.iso ?? '';
  }

  get filteredBusinesses(): Business[] {
    const query = this.searchText.trim().toLocaleLowerCase('es');
    return this.businesses.filter((business) => {
      const matchesCategory = this.selectedCategory === 'Todos' || business.category === this.selectedCategory;
      const matchesSearch = !query || `${business.name} ${business.service} ${business.category}`.toLocaleLowerCase('es').includes(query);
      const matchesSaved = !this.showSavedOnly || this.savedBusinesses.includes(business.name);
      return matchesCategory && matchesSearch && matchesSaved;
    });
  }

  get monthLabel(): string {
    const date = this.days.find((day) => day.iso === this.selectedDate);
    return date ? new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(new Date(`${date.iso}T12:00:00`)) : '';
  }

  get formattedSelectedDate(): string {
    if (!this.selectedDate) return '';
    return new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' })
      .format(new Date(`${this.selectedDate}T12:00:00`));
  }

  goToExplore(): void {
    this.showSavedOnly = false;
    this.screen = 'explore';
    this.scrollContentToTop();
  }

  goToBooking(): void {
    this.screen = 'booking';
    this.scrollContentToTop();
  }

  private scrollContentToTop(): void {
    window.setTimeout(() => {
      const content = document.querySelector('ion-content.citer-content') as HTMLIonContentElement | null;
      void content?.scrollToTop(0);
    }, 0);
  }

  backToResults(): void {
    if (this.screen !== 'service') return;
    this.goToExplore();
  }

  backToService(): void {
    if (this.screen !== 'booking') return;
    this.screen = 'service';
    this.scrollContentToTop();
  }

  @HostListener('window:citer-menu', ['$event'])
  onMenuNavigation(event: Event): void {
    switch ((event as CustomEvent<string>).detail) {
      case 'explore':
        this.goToExplore();
        break;
      case 'saved':
        this.screen = 'explore';
        this.selectedCategory = 'Todos';
        this.showSavedOnly = true;
        break;
      case 'appointments':
        if (this.hasBooking) this.screen = 'confirmed';
        else {
          this.screen = 'explore';
          void this.showToast('Todavía no tienes citas reservadas');
        }
        break;
      case 'profile':
        void this.showToast('La sección de perfil estará disponible próximamente');
        break;
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }

  openBusiness(business: Business): void {
    if (this.suppressNextBusinessClick) {
      this.suppressNextBusinessClick = false;
      return;
    }
    this.currentBusiness = business;
    this.selectedService = this.services[0];
    this.imageScale = 1;
    this.screen = 'service';
    this.scrollContentToTop();
  }

  startLongPress(business: Business): void {
    this.cancelLongPress();
    this.suppressNextBusinessClick = false;
    this.longPressTimer = window.setTimeout(() => {
      this.suppressNextBusinessClick = true;
      void this.showBusinessActions(business);
    }, 550);
  }

  cancelLongPress(): void {
    if (this.longPressTimer !== undefined) window.clearTimeout(this.longPressTimer);
    this.longPressTimer = undefined;
  }

  async showBusinessActions(business: Business): Promise<void> {
    const sheet = await this.actionSheetController.create({
      header: business.name,
      subHeader: 'Acciones rápidas',
      buttons: [
        { text: 'Guardar en favoritos', icon: 'heart-outline', handler: () => this.saveBusiness(business) },
        { text: 'Ver servicios', icon: 'cut-outline', handler: () => { this.suppressNextBusinessClick = false; this.openBusiness(business); } },
        { text: 'Cancelar', role: 'cancel', icon: 'close-outline' },
      ],
    });
    await sheet.present();
  }

  removeBusiness(business: Business): void {
    this.businesses = this.businesses.filter((item) => item.name !== business.name);
    this.savedBusinesses = this.savedBusinesses.filter((name) => name !== business.name);
    void this.showToast(`${business.name} eliminado de la lista`);
  }

  onPinchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.pinchInProgress = true;
      this.lastImageTap = undefined;
      this.pinchStartDistance = this.touchDistance(event.touches[0], event.touches[1]);
      this.pinchStartScale = this.imageScale;
      return;
    }
    if (event.touches.length === 1 && !this.pinchInProgress) {
      this.imageTouchStart = { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
      this.imageTouchMoved = false;
    }
  }

  onPinchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.pinchStartDistance) {
      const ratio = this.touchDistance(event.touches[0], event.touches[1]) / this.pinchStartDistance;
      this.imageScale = Math.min(2.5, Math.max(1, this.pinchStartScale * ratio));
      return;
    }
    const touch = event.touches[0];
    if (touch && this.imageTouchStart && this.touchDistance(touch, this.imageTouchStart) > 12) {
      this.imageTouchMoved = true;
    }
  }

  onPinchEnd(event: TouchEvent): void {
    if (this.pinchInProgress) {
      if (event.touches.length === 0) {
        this.pinchInProgress = false;
        this.pinchStartDistance = 0;
        this.pinchStartScale = this.imageScale;
      }
      return;
    }

    const touch = event.changedTouches[0];
    const start = this.imageTouchStart;
    this.imageTouchStart = undefined;
    if (!touch || !start || this.imageTouchMoved || event.touches.length > 0) return;

    const now = Date.now();
    const previousTap = this.lastImageTap;
    const nearPreviousTap = previousTap && this.touchDistance(touch, previousTap) <= 32;
    if (previousTap && now - previousTap.time <= 350 && nearPreviousTap) {
      this.lastImageTap = undefined;
      this.toggleImageZoom();
      return;
    }
    this.lastImageTap = { clientX: touch.clientX, clientY: touch.clientY, time: now };
  }

  toggleImageZoom(): void {
    const now = Date.now();
    if (now - this.lastZoomToggleAt < 180) return;
    this.lastZoomToggleAt = now;
    this.imageScale = this.imageScale > 1 ? 1 : 2;
  }

  private touchDistance(first: { clientX: number; clientY: number }, second: { clientX: number; clientY: number }): number {
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  }

  saveBusiness(business: Business): void {
    if (!this.savedBusinesses.includes(business.name)) this.savedBusinesses = [...this.savedBusinesses, business.name];
    void this.showToast(`${business.name} guardado en tus favoritos`);
  }

  refreshBusinesses(event: CustomEvent): void {
    this.businesses = [...this.businesses];
    window.setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
      void this.showToast('Lista de negocios actualizada');
    }, 650);
  }

  confirmBooking(): void {
    if (!this.customer.name.trim() || !this.customer.phone.trim() || !this.customer.email.trim()) {
      void this.showToast('Completa tu nombre, teléfono y correo para continuar');
      return;
    }
    this.bookingCode = `CIT-${Math.floor(100000 + Math.random() * 900000)}`;
    this.hasBooking = true;
    this.screen = 'confirmed';
  }

  resetFlow(): void {
    this.screen = 'explore';
    this.customer = { name: '', phone: '', email: '' };
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({ message, duration: 2200, position: 'bottom', color: 'dark' });
    await toast.present();
  }

  private makeUpcomingDays(): AppointmentDay[] {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return Array.from({ length: 7 }, (_, offset) => {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return {
        iso,
        weekday: new Intl.DateTimeFormat('es', { weekday: 'short' }).format(date).replace('.', '').slice(0, 2),
        number: date.getDate(),
      };
    });
  }
}
