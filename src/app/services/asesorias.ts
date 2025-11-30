import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

export interface Asesoria {
  id?: string;
  idProgramador: string;         // id del documento del programador
  idSolicitante?: string;        // uid del usuario (si está logueado)
  nombreSolicitante: string;
  emailSolicitante: string;
  fecha: string;                 // 'YYYY-MM-DD'
  hora: string;                  // 'HH:mm'
  comentario?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  respuestaProgramador?: string;
  creadoEn: string;              // ISO string
}

@Injectable({
  providedIn: 'root'
})
export class AsesoriasService {

  constructor(private firestore: Firestore) { }
  getAsesoriasPorSolicitante(idSolicitante: string): Observable<Asesoria[]> {
    const ref = collection(this.firestore, 'asesorias');
    const q = query(ref, where('idSolicitante', '==', idSolicitante));

    return from(getDocs(q)).pipe(
      map(snap =>
        snap.docs.map(d => {
          const data = d.data() as Asesoria;
          return { id: d.id, ...data };
        })
      )
    );
  }
  crearAsesoria(data: Asesoria) {
    const ref = collection(this.firestore, 'asesorias');

    // limpiar undefined
    const limpio: any = { ...data };
    Object.keys(limpio).forEach(key => {
      if (limpio[key] === undefined) {
        delete limpio[key];
      }
    });

    return addDoc(ref, limpio);
  }



  // Obtener todas las asesorías de un programador
  getAsesoriasPorProgramador(idProgramador: string): Observable<Asesoria[]> {
    const ref = collection(this.firestore, 'asesorias');
    const q = query(ref, where('idProgramador', '==', idProgramador));

    return from(getDocs(q)).pipe(
      map(snap =>
        snap.docs.map(d => {
          const data = d.data() as Asesoria;
          return { id: d.id, ...data };
        })
      )
    );
  }

  // Obtener una asesoría específica
  getAsesoria(id: string): Observable<Asesoria> {
    const refDoc = doc(this.firestore, 'asesorias', id);

    return from(getDoc(refDoc)).pipe(
      map(snap => {
        const data = snap.data() as Asesoria;
        return { id: snap.id, ...data };
      })
    );
  }

  // Actualizar estado / respuesta
  updateAsesoria(id: string, cambios: Partial<Asesoria>) {
    const refDoc = doc(this.firestore, 'asesorias', id);
    return updateDoc(refDoc, cambios);
  }
}
