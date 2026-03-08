import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../enviroments/envoriment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const request = isApiRequest ? req.clone({ withCredentials: true }) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401;
      const isAuthRequest = request.url.includes('/auth/');

      if (!isApiRequest || !isUnauthorized || isAuthRequest) {
        return throwError(() => error);
      }

      return auth.refreshtoken().pipe(
        switchMap(() => next(request)),
        catchError((refreshError: HttpErrorResponse) => {
          auth.isLoggedin = false;
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};