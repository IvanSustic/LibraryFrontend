import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, switchMap, catchError, BehaviorSubject, filter, take } from 'rxjs';

import { AuthService } from '../services/auth-service.service';
 
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isRefreshOrLogin = req.url.includes('/auth') || req.url.includes('/login');

  const authReq = (token && !isRefreshOrLogin)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        return authService.refreshToken().pipe(
          switchMap((response: { accessToken: string }) => {
            const newToken = response.accessToken;
            authService.storeToken(newToken);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            console.log(refreshErr);
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};


