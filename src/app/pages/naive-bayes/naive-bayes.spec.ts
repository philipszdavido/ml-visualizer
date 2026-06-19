import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaiveBayes } from './naive-bayes';

describe('NaiveBayes', () => {
  let component: NaiveBayes;
  let fixture: ComponentFixture<NaiveBayes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaiveBayes],
    }).compileComponents();

    fixture = TestBed.createComponent(NaiveBayes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
