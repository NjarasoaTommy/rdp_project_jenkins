import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WolfGoatComponent } from './wolf-goat.component';

describe('WolfGoatComponent', () => {
  let component: WolfGoatComponent;
  let fixture: ComponentFixture<WolfGoatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WolfGoatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WolfGoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
