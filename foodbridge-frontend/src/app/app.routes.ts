import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/impact', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'impact',
        loadComponent: () => import('./public/impact/impact.component').then(m => m.ImpactComponent)
    },
    {
        path: 'provider',
        canActivate: [roleGuard],
        data: { role: 'PROVIDER' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./provider/dashboard/provider-dashboard.component').then(m => m.ProviderDashboardComponent)
            },
            {
                path: 'create-listing',
                loadComponent: () => import('./provider/create-listing/create-listing.component').then(m => m.CreateListingComponent)
            },
            {
                path: 'listing/:id',
                loadComponent: () => import('./provider/listing-detail/listing-detail.component').then(m => m.ListingDetailComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./provider/reports/reports.component').then(m => m.ReportsComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'checker',
        canActivate: [roleGuard],
        data: { role: 'CHECKER' },
        children: [
            {
                path: 'review-queue',
                loadComponent: () => import('./checker/review-queue/review-queue.component').then(m => m.ReviewQueueComponent)
            },
            {
                path: 'review/:id',
                loadComponent: () => import('./checker/review-detail/review-detail.component').then(m => m.ReviewDetailComponent)
            },
            {
                path: 'history',
                loadComponent: () => import('./checker/review-queue/review-queue.component').then(m => m.ReviewQueueComponent)
            },
            { path: '', redirectTo: 'review-queue', pathMatch: 'full' }
        ]
    },
    {
        path: 'receiver',
        canActivate: [roleGuard],
        data: { role: 'RECEIVER' },
        children: [
            {
                path: 'browse',
                loadComponent: () => import('./receiver/browse/browse-listings.component').then(m => m.BrowseListingsComponent)
            },
            {
                path: 'my-claims',
                loadComponent: () => import('./receiver/my-claims/my-claims.component').then(m => m.MyClaimsComponent)
            },
            { path: '', redirectTo: 'browse', pathMatch: 'full' }
        ]
    },
    {
        path: 'admin',
        canActivate: [roleGuard],
        data: { role: 'ADMIN' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./admin/users/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'listings',
                loadComponent: () => import('./admin/listings/listing-management.component').then(m => m.ListingManagementComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '/impact' }
];
