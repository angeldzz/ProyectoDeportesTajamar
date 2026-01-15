import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarDeporte } from './seleccionar-deporte';

describe('SeleccionarDeporte', () => {
  let component: SeleccionarDeporte;
  let fixture: ComponentFixture<SeleccionarDeporte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarDeporte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarDeporte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
