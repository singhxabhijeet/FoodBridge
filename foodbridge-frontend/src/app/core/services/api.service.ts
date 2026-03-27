import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // ===== Listings =====
    createListing(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/listings/create`, formData);
    }

    getMyListings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/listings/my`);
    }

    getApprovedListings(lat?: number, lng?: number): Observable<any> {
        let params = new HttpParams();
        if (lat !== undefined && lng !== undefined) {
            params = params.set('lat', lat.toString()).set('lng', lng.toString());
        }
        return this.http.get(`${this.apiUrl}/listings/approved`, { params });
    }

    getPendingReviewListings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/listings/pending-review`);
    }

    getListingById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/listings/${id}`);
    }

    updateListingStatus(id: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/listings/${id}/status`, null, {
            params: new HttpParams().set('status', status)
        });
    }

    updateListingQuantity(id: number, quantity: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/listings/${id}/quantity`, null, {
            params: new HttpParams().set('quantity', quantity.toString())
        });
    }

    // ===== Quality Checks =====
    reviewListing(listingId: number, approved: boolean, reason: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/quality-checks/${listingId}/review`, { approved, reason });
    }

    getCheckerHistory(): Observable<any> {
        return this.http.get(`${this.apiUrl}/quality-checks/history`);
    }

    // ===== Claims =====
    claimListing(listingId: number, scheduledPickupTime: string, requestedQuantity: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/claims/${listingId}`, { scheduledPickupTime, requestedQuantity });
    }

    providerConfirm(claimId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/claims/${claimId}/confirm-provider`, {});
    }

    receiverConfirm(claimId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/claims/${claimId}/confirm-receiver`, {});
    }

    markNoShow(claimId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/claims/${claimId}/no-show`, {});
    }

    getMyClaims(): Observable<any> {
        return this.http.get(`${this.apiUrl}/claims/my`);
    }

    getClaimsByListing(listingId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/claims/listing/${listingId}`);
    }

    // ===== Ratings =====
    submitRating(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/ratings`, data);
    }

    getUserRatings(userId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/ratings/user/${userId}`);
    }

    getListingRatings(listingId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/ratings/listing/${listingId}`);
    }

    // ===== Admin =====
    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/dashboard`);
    }

    getAllUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/users`);
    }

    getPendingUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/users/pending`);
    }

    approveUser(userId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/users/${userId}/approve`, {});
    }

    restrictUser(userId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/users/${userId}/restrict`, {});
    }

    unrestrictUser(userId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/users/${userId}/unrestrict`, {});
    }

    getAllListings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/listings`);
    }

    // ===== Public =====
    getImpactStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/public/impact`);
    }

    // ===== User Management =====
    promoteToSubAdmin(userId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/users/${userId}/promote-sub-admin`, {});
    }

    demoteFromSubAdmin(userId: number, role: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/users/${userId}/demote-sub-admin?role=${role}`, {});
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
    }

    cancelClaim(claimId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/claims/${claimId}`);
    }
}
