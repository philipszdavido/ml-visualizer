import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearReg } from './linear-reg';

describe('LinearReg', () => {
  let component: LinearReg;
  let fixture: ComponentFixture<LinearReg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearReg],
    }).compileComponents();

    fixture = TestBed.createComponent(LinearReg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
