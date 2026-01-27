import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionActividadEventoComponent } from './asignacion-actividad-evento.component';

describe('AsignacionActividadEventoComponent', () => {
  let component: AsignacionActividadEventoComponent;
  let fixture: ComponentFixture<AsignacionActividadEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionActividadEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionActividadEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
