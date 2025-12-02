import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProgramadoresService } from '../../../services/programadores';

@Component({
    selector: 'app-programador-nuevo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './programador-nuevo.html',
    styleUrls: ['./programador-nuevo.scss']
})
export class ProgramadorNuevoComponent {

    form: FormGroup;
    archivoFoto: File | null = null;
    cargando = false;
    mensaje = '';
    error = '';

    constructor(
        private fb: FormBuilder,
        private programadoresService: ProgramadoresService,
        private router: Router
    ) {
        this.form = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            especialidad: ['', Validators.required],
            github: [''],
            linkedin: [''],
            portafolio: [''],
            
            // --- Nuevos campos integrados ---
            emailContacto: [''],
            whatsapp: [''],
            
            // 🔹 NUEVO CAMPO SOLICITADO
            disponibilidad: [''], 

            // Campo auxiliar para lógica de horas
            horasDisponiblesTexto: [''] 
        });
    }

    onFotoSeleccionada(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files && input.files[0];
        this.archivoFoto = file ?? null;
    }

    async guardar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.cargando = true;
        this.mensaje = '';
        this.error = '';

        const value = this.form.value;

        // 1. Lógica existente: Convertir texto a array de horas
        let horasDisponibles: string[] = [];
        if (value.horasDisponiblesTexto) {
            horasDisponibles = value.horasDisponiblesTexto
                .split(',')
                .map((h: string) => h.trim())
                .filter((h: string) => h !== '');
        }

        // 2. Preparar objeto data
        // Fusionamos todo el formulario (...value) e insertamos las lógicas específicas
        const data = {
            ...value,
            // Aseguramos que disponibilidad sea un string (como en tu snippet)
            disponibilidad: value.disponibilidad || '', 
            horasDisponibles
        };

        // Eliminamos el campo auxiliar del objeto final porque el backend no lo espera
        delete data.horasDisponiblesTexto;

        try {
            await this.programadoresService.crearProgramador(
                data,
                this.archivoFoto
            );

            this.mensaje = 'Programador agregado correctamente';
            this.router.navigate(['/admin/programadores']);

        } catch (e) {
            console.error(e);
            this.error = 'Ocurrió un error al guardar el programador';
        } finally {
            this.cargando = false;
        }
    }
}