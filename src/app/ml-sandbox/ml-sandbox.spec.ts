import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlSandbox } from './ml-sandbox';

describe('MlSandbox', () => {
  let component: MlSandbox;
  let fixture: ComponentFixture<MlSandbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlSandbox],
    }).compileComponents();

    fixture = TestBed.createComponent(MlSandbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
