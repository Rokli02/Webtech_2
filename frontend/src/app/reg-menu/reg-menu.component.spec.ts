import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegMenuComponent } from './reg-menu.component';

describe('RegMenuComponent', () => {
  let component: RegMenuComponent;
  let fixture: ComponentFixture<RegMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
