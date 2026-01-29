import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { EventosService } from '../../../core/services/eventos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creacion-eventos',
  imports: [FullCalendarModule],
  templateUrl: './creacion-eventos.component.html',
  styleUrl: './creacion-eventos.component.css',
})
export class CreacionEventosComponent implements OnInit {
  constructor(private _eventosService: EventosService, private router: Router){}
  selectedDate: Date | null = null;
  selectedDateStr: string = '';
  showTimeModal: boolean = false;
  selectedHour: number = 12;
  selectedMinute: number = 0;
  hours: number[] = Array.from({length: 24}, (_, i) => i);
  minutes: number[] = Array.from({length: 60}, (_, i) => i);
  isDraggingHour: boolean = false;
  isDraggingMinute: boolean = false;
  startY: number = 0;
  startScrollTop: number = 0;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
    height: 'auto',
    aspectRatio: 2.0,
    dateClick: this.handleDateClick.bind(this),
    validRange: {
      start: new Date() // Solo permitir fechas futuras
    }
  };

  ngOnInit(): void {
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedDate = selectInfo.start;
    this.selectedDateStr = this.formatDate(selectInfo.start);
    this.showTimeModal = true;
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.date;
    this.selectedDateStr = this.formatDate(arg.date);
    this.showTimeModal = true;
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  closeTimeModal() {
    this.showTimeModal = false;
  }

  confirmTime() {
    if (this.selectedDate) {
      // Crear una nueva fecha con la hora seleccionada
      const fechaConHora = new Date(this.selectedDate);
      fechaConHora.setHours(this.selectedHour, this.selectedMinute, 0, 0);
      this.selectedDate = fechaConHora;
      this.selectedDateStr = this.formatDateWithTime(fechaConHora);
    }
    this.showTimeModal = false;
  }

  formatDateWithTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  onHourScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const itemHeight = 40;
    const index = Math.round(scrollTop / itemHeight);
    this.selectedHour = this.hours[index];
  }

  onMinuteScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const itemHeight = 40;
    const index = Math.round(scrollTop / itemHeight);
    this.selectedMinute = this.minutes[index];
  }

  // Métodos para arrastre con ratón - Horas
  onHourMouseDown(event: MouseEvent) {
    this.isDraggingHour = true;
    this.startY = event.clientY;
    const element = event.currentTarget as HTMLElement;
    this.startScrollTop = element.scrollTop;
    event.preventDefault();
  }

  onHourMouseMove(event: MouseEvent) {
    if (!this.isDraggingHour) return;
    const element = event.currentTarget as HTMLElement;
    const deltaY = this.startY - event.clientY;
    element.scrollTop = this.startScrollTop + deltaY;
  }

  onHourMouseUp() {
    this.isDraggingHour = false;
  }

  // Métodos para arrastre con ratón - Minutos
  onMinuteMouseDown(event: MouseEvent) {
    this.isDraggingMinute = true;
    this.startY = event.clientY;
    const element = event.currentTarget as HTMLElement;
    this.startScrollTop = element.scrollTop;
    event.preventDefault();
  }

  onMinuteMouseMove(event: MouseEvent) {
    if (!this.isDraggingMinute) return;
    const element = event.currentTarget as HTMLElement;
    const deltaY = this.startY - event.clientY;
    element.scrollTop = this.startScrollTop + deltaY;
  }

  onMinuteMouseUp() {
    this.isDraggingMinute = false;
  }

  crearEvento() {
    if (this.selectedDate) {
      // Ajustar la fecha para compensar la conversión UTC
      const fechaAjustada = new Date(this.selectedDate);
      fechaAjustada.setMinutes(fechaAjustada.getMinutes() - fechaAjustada.getTimezoneOffset());
      
      this._eventosService.createEvento(fechaAjustada).subscribe({
        next: (eventoCreado: any) => {
          this.router.navigate(['/asignacion-actividad-evento', eventoCreado.idEvento]);
        },
        error: (error: any) => {
          console.error('Error al crear el evento:', error);
        }
      });
    }
  }
}
