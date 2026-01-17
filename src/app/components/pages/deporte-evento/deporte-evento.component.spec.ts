import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeporteEventoComponent } from './deporte-evento.component';

describe('DeporteEventoComponent', () => {
  let component: DeporteEventoComponent;
  let fixture: ComponentFixture<DeporteEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeporteEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeporteEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
