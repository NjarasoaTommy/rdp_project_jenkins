import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriColorFireComponent } from './tri-color-fire.component';

describe('TriColorFireComponent', () => {
  let component: TriColorFireComponent;
  let fixture: ComponentFixture<TriColorFireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriColorFireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriColorFireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
