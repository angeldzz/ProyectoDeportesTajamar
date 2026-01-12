import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionDeportesComponent } from './seleccion-deportes.component';

describe('SeleccionDeportesComponent', () => {
  let component: SeleccionDeportesComponent;
  let fixture: ComponentFixture<SeleccionDeportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionDeportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionDeportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
