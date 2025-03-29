import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaviconComponent } from './favicon.component';

describe('FaviconComponent', () => {
  let component: FaviconComponent;
  let fixture: ComponentFixture<FaviconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaviconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FaviconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
