import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionEventosComponent } from './creacion-eventos.component';

describe('CreacionEventosComponent', () => {
  let component: CreacionEventosComponent;
  let fixture: ComponentFixture<CreacionEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreacionEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
