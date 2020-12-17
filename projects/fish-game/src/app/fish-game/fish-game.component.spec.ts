import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FishGameComponent } from './fish-game.component';

describe('FishGameComponent', () => {
  let component: FishGameComponent;
  let fixture: ComponentFixture<FishGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FishGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FishGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
