import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramadorLayout } from './programador-layout';

describe('ProgramadorLayout', () => {
  let component: ProgramadorLayout;
  let fixture: ComponentFixture<ProgramadorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramadorLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramadorLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
