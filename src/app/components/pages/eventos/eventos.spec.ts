import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EventosComponent } from './eventos';

describe('EventosComponent', () => {
  let component: EventosComponent;
  let fixture: ComponentFixture<EventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
