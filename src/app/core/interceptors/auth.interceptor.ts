import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const tenantId = localStorage.getItem('tenant_id'); // multi-tenancy entry point

  let clonedReq = req.clone({
    setHeaders: {
      'Accept-Language': 'ar-EG',
      'X-Tenant-ID': tenantId || 'system'
    }
  });

  if (token) {
    clonedReq = clonedReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Session expired, redirecting to login...');
      }
      return throwError(() => error);
    })
  );
};
