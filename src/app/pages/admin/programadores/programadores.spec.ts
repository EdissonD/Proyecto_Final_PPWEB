import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramadoresComponent } from './programadores';

describe('ProgramadoresComponent', () => {
  let component: ProgramadoresComponent;
  let fixture: ComponentFixture<ProgramadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramadoresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
