import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const expectedRole = route.data['role'];
    if (expectedRole) {
        const roles = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
        const userRole = authService.getRole();
        if (!roles.includes(userRole)) {
            router.navigate(['/login']);
            return false;
        }
    }

    return true;
};

/** Prevents logged-in users from accessing login/register pages */
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        const role = authService.getRole();
        if (role === 'ADMIN' || role === 'SUB_ADMIN') router.navigate(['/admin/dashboard']);
        else if (role === 'PROVIDER') router.navigate(['/provider/dashboard']);
        else if (role === 'CHECKER') router.navigate(['/checker/review-queue']);
        else router.navigate(['/receiver/browse']);
        return false;
    }

    return true;
};
