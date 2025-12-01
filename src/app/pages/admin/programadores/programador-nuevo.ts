import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProgramadoresService } from '../../../services/programadores';

@Component({
    selector: 'app-programador-nuevo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule], // Agregado RouterModule
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
        private router: Router // Inyectado Router
    ) {
        this.form = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required], // Ajustado a required como el ejemplo 2
            especialidad: ['', Validators.required],
            github: [''],
            linkedin: [''],
            portafolio: [''],

            // Campos nuevos adaptados del ejemplo 2
            emailContacto: [''],
            whatsapp: [''],
            horasDisponiblesTexto: [''] // Campo auxiliar para texto
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

        // Lógica adaptada: Convertir texto a array de horas
        const value = this.form.value;
        let horasDisponibles: string[] = [];

        if (value.horasDisponiblesTexto) {
            horasDisponibles = value.horasDisponiblesTexto
                .split(',')
                .map((h: string) => h.trim())
                .filter((h: string) => h !== '');
        }

        // Preparar objeto data fusionando form + array calculado
        const data = {
            ...value,
            horasDisponibles
        };
        // Eliminamos el campo auxiliar del objeto final si es necesario
        delete data.horasDisponiblesTexto;

        try {
            // Se mantiene tu servicio que acepta (data, file)
            await this.programadoresService.crearProgramador(
                data,
                this.archivoFoto
            );

            this.mensaje = 'Programador agregado correctamente';

            // Navegación adaptada del ejemplo 2
            this.router.navigate(['/admin/programadores']);

        } catch (e) {
            console.error(e);
            this.error = 'Ocurrió un error al guardar el programador';
        } finally {
            this.cargando = false;
        }
    }
}