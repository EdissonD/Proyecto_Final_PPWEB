import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioComponent } from './inicio'; // <--- Corregido el nombre aquí

describe('InicioComponent', () => { // <--- Es buena práctica poner el nombre completo aquí también
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent] // <--- Importamos el componente Standalone correcto
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});