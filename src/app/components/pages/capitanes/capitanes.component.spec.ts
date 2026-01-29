import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitanesComponent } from './capitanes.component';

describe('CapitanesComponent', () => {
  let component: CapitanesComponent;
  let fixture: ComponentFixture<CapitanesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitanesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
