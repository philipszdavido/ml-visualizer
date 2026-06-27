import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionVisual } from './attention-visual';

describe('AttentionVisual', () => {
  let component: AttentionVisual;
  let fixture: ComponentFixture<AttentionVisual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentionVisual],
    }).compileComponents();

    fixture = TestBed.createComponent(AttentionVisual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
