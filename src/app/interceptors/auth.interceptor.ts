import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    //console.log('✅ Token βρέθηκε! Το κολλάω στο αίτημα...');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  } else {
    //console.warn('⚠️ Δεν βρέθηκε Token στο Local Storage!');
  }
  return next(req);
};
