import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeceptronClassifier } from './peceptron-classifier';

describe('PeceptronClassifier', () => {
  let component: PeceptronClassifier;
  let fixture: ComponentFixture<PeceptronClassifier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeceptronClassifier],
    }).compileComponents();

    fixture = TestBed.createComponent(PeceptronClassifier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
