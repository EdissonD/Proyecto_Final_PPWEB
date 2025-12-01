import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAsesoriasComponent } from './mis-asesorias';

describe('MisAsesoriasComponent', () => {
  let component: MisAsesoriasComponent;
  let fixture: ComponentFixture<MisAsesoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como es standalone, va en imports:
      imports: [MisAsesoriasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MisAsesoriasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
