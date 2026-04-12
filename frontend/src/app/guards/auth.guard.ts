import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserProfileService } from '../services/userProfile/user-profile-service';

export const authGuard: CanActivateFn = () => {
    const user = inject(UserProfileService);
    const router = inject(Router);

    return user.userInfo!().pipe(
    map(() => true),
    catchError(() => {
        router.navigate(['/login']);
        return of(false);
        })
    );
};