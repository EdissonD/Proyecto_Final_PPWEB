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
import { Observable, from, map, of } from 'rxjs';

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

  // Asesorías solicitadas por un usuario (mis-asesorias)
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

    const limpio: any = { ...data };
    Object.keys(limpio).forEach(key => {
      if (limpio[key] === undefined) {
        delete limpio[key];
      }
    });

    return addDoc(ref, limpio);
  }

  // 👉 Asesorías de un programador concreto
  getAsesoriasPorProgramador(idProgramador?: string): Observable<Asesoria[]> {
    if (!idProgramador) {
      return of([]);
    }

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

  getAsesoria(id: string): Observable<Asesoria> {
    const refDoc = doc(this.firestore, 'asesorias', id);

    return from(getDoc(refDoc)).pipe(
      map(snap => {
        const data = snap.data() as Asesoria;
        return { id: snap.id, ...data };
      })
    );
  }

  updateAsesoria(id: string, cambios: Partial<Asesoria>) {
    const refDoc = doc(this.firestore, 'asesorias', id);
    return updateDoc(refDoc, cambios);
  }
}
