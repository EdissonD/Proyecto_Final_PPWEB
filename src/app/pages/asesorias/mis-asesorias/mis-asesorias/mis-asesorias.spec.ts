import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAsesorias } from './mis-asesorias';

describe('MisAsesorias', () => {
  let component: MisAsesorias;
  let fixture: ComponentFixture<MisAsesorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisAsesorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisAsesorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
