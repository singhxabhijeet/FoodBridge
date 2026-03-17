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
        // Support both a single role string and an array of roles
        const roles = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
        const userRole = authService.getRole();
        if (!roles.includes(userRole)) {
            router.navigate(['/login']);
            return false;
        }
    }

    return true;
};
