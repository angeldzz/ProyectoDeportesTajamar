import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesFormComponent } from './deportes-form.component';

describe('DeportesFormComponent', () => {
  let component: DeportesFormComponent;
  let fixture: ComponentFixture<DeportesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeportesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeportesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
