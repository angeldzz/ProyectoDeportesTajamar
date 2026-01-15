import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creacion-eventos',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './creacion-eventos.component.html',
  styleUrl: './creacion-eventos.component.css',
})
export class CreacionEventosComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedDateStr: string = '';

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
    console.log('Componente de creación de eventos inicializado');
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedDate = selectInfo.start;
    this.selectedDateStr = this.formatDate(selectInfo.start);
    console.log('Fecha seleccionada (rango):', {
      inicio: selectInfo.start,
      fin: selectInfo.end,
      formatoLegible: this.selectedDateStr
    });
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.date;
    this.selectedDateStr = this.formatDate(arg.date);
    console.log('Fecha clickeada:', {
      fecha: arg.date,
      formatoLegible: this.selectedDateStr,
      dateStr: arg.dateStr
    });
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

  crearEvento() {
    if (this.selectedDate) {
      console.log('=== CREAR EVENTO ===');
      console.log('Fecha seleccionada:', this.selectedDate);
      console.log('Fecha formateada:', this.selectedDateStr);
      console.log('Timestamp:', this.selectedDate.getTime());
      console.log('ISO String:', this.selectedDate.toISOString());
      
      // Aquí puedes agregar la lógica para crear el evento
      alert(`Evento creado para el día: ${this.selectedDateStr}`);
    } else {
      console.warn('No se ha seleccionado ninguna fecha');
      alert('Por favor, selecciona una fecha en el calendario');
    }
  }
}
