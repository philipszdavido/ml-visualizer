import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticReg } from './logistic-reg';

describe('LogisticReg', () => {
  let component: LogisticReg;
  let fixture: ComponentFixture<LogisticReg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticReg],
    }).compileComponents();

    fixture = TestBed.createComponent(LogisticReg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
