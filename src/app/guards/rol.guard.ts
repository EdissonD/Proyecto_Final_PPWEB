import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, of, switchMap } from 'rxjs';

export const rolGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  const rolRequerido = route.data?.['rol'] as 'admin' | 'programador' | 'usuario' | undefined;

  return authState(auth).pipe(
    switchMap(user => {
      if (!user) {
        // no logueado → al login
        return of(router.createUrlTree(['/login']));
      }

      if (!rolRequerido) {
        // si la ruta no pide rol específico, solo exige estar logueado
        return of(true);
      }

      const ref = doc(firestore, 'usuarios', user.uid);
      return from(getDoc(ref)).pipe(
        map(snap => {
          const data = snap.data() as any | undefined;
          const rolUsuario = data?.rol as string | undefined;

          if (!rolUsuario) {
            // usuario sin rol → lo mandamos al inicio
            return router.createUrlTree(['/inicio']);
          }

          // Reglas simples:
          // - admin solo entra donde rolRequerido === 'admin'
          // - programador solo donde rol === 'programador'
          // - usuario normal solo donde rol === 'usuario' (si llegas a usarlo)
          if (rolUsuario === rolRequerido) {
            return true;
          }

          // Si quieres que el admin pueda entrar a todo, puedes descomentar:
          // if (rolUsuario === 'admin') return true;

          // rol no coincide → redirigir
          return router.createUrlTree(['/inicio']);
        })
      );
    })
  );
};
