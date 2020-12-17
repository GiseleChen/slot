import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibAnimationComponent } from './lib-animation.component';

describe('LibAnimationComponent', () => {
  let component: LibAnimationComponent;
  let fixture: ComponentFixture<LibAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
