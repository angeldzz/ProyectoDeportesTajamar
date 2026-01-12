import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionEquipoComponent } from './seleccion-equipo.component';

describe('SeleccionEquipoComponent', () => {
  let component: SeleccionEquipoComponent;
  let fixture: ComponentFixture<SeleccionEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
