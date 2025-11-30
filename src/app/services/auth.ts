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

        // leemos el doc de Firestore
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
              };

              return from(setDoc(ref, nuevo)).pipe(
                map(() => nuevo)
              );
            } else {
              return of(snap.data() as UsuarioApp);
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
