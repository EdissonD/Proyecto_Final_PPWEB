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
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';

//  interface que pedía tu componente Programadores
export interface Programador {
  id?: string;
  nombre: string;
  descripcion: string;
  especialidad: string;
  github?: string;
  linkedin?: string;
  portafolio?: string;
  foto?: string;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramadoresService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  //  LISTAR PROGRAMADORES
  getProgramadores(): Observable<Programador[]> {
    const programadoresRef = collection(this.firestore, 'programadores');

    return from(getDocs(programadoresRef)).pipe(
      map((snap) =>
        snap.docs.map((d) => {
          const data = d.data() as Programador;
          return { id: d.id, ...data };
        })
      )
    );
  }

  //  CREAR PROGRAMADOR (CON FOTO)
  async crearProgramador(data: Programador, archivoFoto: File | null) {
    let urlFoto = '';

    if (archivoFoto) {
      const nombreArchivo = `${Date.now()}_${archivoFoto.name}`;
      const ruta = `programadores/${nombreArchivo}`;

      const storageRef = ref(this.storage, ruta);
      await uploadBytes(storageRef, archivoFoto);
      urlFoto = await getDownloadURL(storageRef);
    }

    const programadoresRef = collection(this.firestore, 'programadores');

    return addDoc(programadoresRef, {
      ...data,
      foto: urlFoto,
      rol: 'programador',
    });
  }

  //  BORRAR DESDE LA TABLA
  async deleteProgramador(id: string) {
    const refDoc = doc(this.firestore, 'programadores', id);
    await deleteDoc(refDoc);
  }

  //  OBTENER 1 SOLO (PARA EDITAR)
  getProgramador(id: string): Observable<Programador> {
    const refDoc = doc(this.firestore, 'programadores', id);

    return from(getDoc(refDoc)).pipe(
      map((snap) => {
        const data = snap.data() as Programador;
        return { id: snap.id, ...data };
      })
    );
  }

  //  ACTUALIZAR (CON O SIN NUEVA FOTO)
  async updateProgramador(
    id: string,
    data: Partial<Programador>,
    archivoFotoNuevo: File | null
  ) {
    const refDoc = doc(this.firestore, 'programadores', id);

    const datosActualizar: any = { ...data };

    if (archivoFotoNuevo) {
      const nombreArchivo = `${Date.now()}_${archivoFotoNuevo.name}`;
      const ruta = `programadores/${nombreArchivo}`;

      const storageRef = ref(this.storage, ruta);
      await uploadBytes(storageRef, archivoFotoNuevo);
      const urlFoto = await getDownloadURL(storageRef);

      datosActualizar.foto = urlFoto;
    }

    await updateDoc(refDoc, datosActualizar);
  }
}
