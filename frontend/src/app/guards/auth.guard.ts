// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth-service';
// import { catchError, map, of } from 'rxjs';

// export const authGuard: CanActivateFn = () => {
//     const auth = inject(AuthService);
//     const router = inject(Router);

//   // Backend verification
//     return auth.userInfo!.pipe(
//     map(() => true),
//     catchError(() => {
//         router.navigate(['/login']);
//         return of(false);
//         })
//     );
// };