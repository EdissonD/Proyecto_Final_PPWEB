import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortafolioComponent} from './portafolio';

describe('Portafolio', () => {
  let component: PortafolioComponent;
  let fixture: ComponentFixture<PortafolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortafolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortafolioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
