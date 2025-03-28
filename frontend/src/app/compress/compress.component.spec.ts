import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompressComponent } from './compress.component';

describe('CompressComponent', () => {
  let component: CompressComponent;
  let fixture: ComponentFixture<CompressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
