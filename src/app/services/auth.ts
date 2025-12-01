import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  authState
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

import { Observable, from, of, switchMap, map } from 'rxjs';

export interface UsuarioApp {
  uid: string;
  nombre: string;
  email: string;
  foto?: string;
  rol: 'admin' | 'programador' | 'usuario';
  idProgramador?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable con los datos del usuario + rol
  usuario$: Observable<UsuarioApp | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {

    this.usuario$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }

        const ref = doc(this.firestore, 'usuarios', user.uid);

        return from(getDoc(ref)).pipe(
          switchMap(snap => {
            if (!snap.exists()) {
              // si no existe, lo creamos como usuario normal
              const nuevo: UsuarioApp = {
                uid: user.uid,
                nombre: user.displayName || '',
                email: user.email || '',
                foto: user.photoURL || '',
                rol: 'usuario'
                //  NO mandamos idProgramador aquí
              };

              return from(setDoc(ref, nuevo)).pipe(
                map(() => nuevo)
              );
            } else {
              const data = snap.data() as any || {};

              // Construimos el usuario
              const usuario: UsuarioApp = {
                uid: user.uid,
                nombre: data.nombre ?? user.displayName ?? '',
                email: data.email ?? user.email ?? '',
                foto: data.foto ?? user.photoURL ?? '',
                rol: (data.rol as any) ?? 'usuario'
                // idProgramador lo añadimos solo si existe abajo
              };

              //  agregamos idProgramador si realmente tiene valor
              if (data.idProgramador) {
                usuario.idProgramador = data.idProgramador;
              }

              // Firestore NO acepta campos undefined, pero aquí ya no hay ninguno
              return from(setDoc(ref, usuario, { merge: true })).pipe(
                map(() => usuario)
              );
            }
          })
        );
      })
    );
  }

  // Login con Google
  async loginConGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  // Logout
  logout(): Promise<void> {
    return this.auth.signOut();
  }
}
