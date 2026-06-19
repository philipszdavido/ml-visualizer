import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Knn } from './knn';

describe('Knn', () => {
  let component: Knn;
  let fixture: ComponentFixture<Knn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Knn],
    }).compileComponents();

    fixture = TestBed.createComponent(Knn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
