import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedtaskComponent } from './unassignedtask.component';

describe('UnassignedtaskComponent', () => {
  let component: UnassignedtaskComponent;
  let fixture: ComponentFixture<UnassignedtaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnassignedtaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
