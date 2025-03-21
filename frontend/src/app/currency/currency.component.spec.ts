import { ComponentFixture, TestBed } from '@angular/core/testing';

import { currencyComponent } from './currency.component';

describe('currencyComponent, () => {
  let component: currencyComponent;
  let fixture: ComponentFixture<currencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [currencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(currencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
