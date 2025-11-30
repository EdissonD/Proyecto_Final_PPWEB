import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoNuevo } from './proyecto-nuevo';

describe('ProyectoNuevo', () => {
  let component: ProyectoNuevo;
  let fixture: ComponentFixture<ProyectoNuevo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoNuevo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoNuevo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
