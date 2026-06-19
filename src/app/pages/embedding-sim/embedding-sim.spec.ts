import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddingSim } from './embedding-sim';

describe('EmbeddingSim', () => {
  let component: EmbeddingSim;
  let fixture: ComponentFixture<EmbeddingSim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbeddingSim],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbeddingSim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
