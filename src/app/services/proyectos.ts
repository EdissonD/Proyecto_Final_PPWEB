import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

export interface Proyecto {
  id?: string;
  nombre: string;
  descripcion: string;

  tipoProyecto: 'academico' | 'laboral';
  participacion: 'frontend' | 'backend' | 'bd';

  tecnologias: string[];
  repoUrl?: string;
  demoUrl?: string;

  idProgramador: string;  // quien es dueño del proyecto
}
@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor(private firestore: Firestore) { }

  // LISTAR proyectos de un programador
  getProyectos(idProgramador: string): Observable<Proyecto[]> {
    const ref = collection(this.firestore, `programadores/${idProgramador}/proyectos`);

    return from(getDocs(ref)).pipe(
      map(snap =>
        snap.docs.map(d => {
          const data = d.data() as Proyecto;
          return { id: d.id, ...data };
        })
      )
    );
  }

  // CREAR proyecto
  crearProyecto(idProgramador: string, data: Proyecto) {
    const ref = collection(this.firestore, `programadores/${idProgramador}/proyectos`);
    return addDoc(ref, data);
  }

  // OBTENER 1 proyecto
  getProyecto(idProgramador: string, idProyecto: string): Observable<Proyecto> {
    const refDoc = doc(this.firestore, `programadores/${idProgramador}/proyectos/${idProyecto}`);

    return from(getDoc(refDoc)).pipe(
      map(snap => {
        const data = snap.data() as Proyecto;
        return { id: snap.id, ...data };
      })
    );
  }

  // ACTUALIZAR proyecto
  updateProyecto(idProgramador: string, idProyecto: string, data: Partial<Proyecto>) {
    const refDoc = doc(this.firestore, `programadores/${idProgramador}/proyectos/${idProyecto}`);
    return updateDoc(refDoc, data);
  }

  // ELIMINAR proyecto
  deleteProyecto(idProgramador: string, idProyecto: string) {
    const refDoc = doc(this.firestore, `programadores/${idProgramador}/proyectos/${idProyecto}`);
    return deleteDoc(refDoc);
  }
}
