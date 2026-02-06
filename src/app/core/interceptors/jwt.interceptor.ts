import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token.service';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.get();

  // ✅ No token -> seguir normal
  if (!token) return next(req);

  // ✅ No adjuntar a auth
  if (req.url.includes('/api/auth/')) return next(req);

  // ✅ SOLO adjuntar al backend
  const isBackend = req.url.startsWith(environment.apiUrl);
  if (!isBackend) return next(req); // Esto cubre Cloudinary y cualquier externo

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
