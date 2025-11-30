import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoEditar } from './proyecto-editar';

describe('ProyectoEditar', () => {
  let component: ProyectoEditar;
  let fixture: ComponentFixture<ProyectoEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
