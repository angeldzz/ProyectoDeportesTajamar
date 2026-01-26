import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import { es } from 'date-fns/locale';


@Component({
  selector: 'app-calendario',
  imports: [],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnInit {
  @ViewChild('dateInput') dateInput!: ElementRef;

  public days: Date[] = [];
  public selectedDate: Date = new Date();

  ngOnInit() {
    this.generateDays();
  }

  generateDays() {
    // Generamos 5 días centrados en la fecha seleccionada
    const start = subDays(this.selectedDate, 2);
    this.days = Array.from({ length: 5 }, (_, i) => addDays(start, i));
  }

  // Moverse con las flechas
  move(amount: number) {
    this.selectedDate = addDays(this.selectedDate, amount);
    this.generateDays();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.generateDays();
  }

  // Al elegir una fecha en el DatePicker (input oculto)
  onDatePicked(event: any) {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      this.selectDate(date);
    }
  }

  formatDay(date: Date): string {
    if (isSameDay(date, new Date())) return 'Today';
    const formatted = format(date, 'MMM dd', { locale: es });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  isToday(date: Date): boolean {
    return isSameDay(date, this.selectedDate);
  }
}
