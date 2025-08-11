import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdpGraphComponent } from './rdp-graph.component';

describe('RdpGraphComponent', () => {
  let component: RdpGraphComponent;
  let fixture: ComponentFixture<RdpGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdpGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdpGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
