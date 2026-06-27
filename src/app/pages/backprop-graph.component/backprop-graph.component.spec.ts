import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackpropGraphComponent } from './backprop-graph.component';

describe('BackpropGraphComponent', () => {
  let component: BackpropGraphComponent;
  let fixture: ComponentFixture<BackpropGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackpropGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackpropGraphComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
