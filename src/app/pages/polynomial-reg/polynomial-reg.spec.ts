import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolynomialReg } from './polynomial-reg';

describe('PolynomialReg', () => {
  let component: PolynomialReg;
  let fixture: ComponentFixture<PolynomialReg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolynomialReg],
    }).compileComponents();

    fixture = TestBed.createComponent(PolynomialReg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
