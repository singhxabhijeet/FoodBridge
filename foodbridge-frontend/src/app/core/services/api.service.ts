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

    // ===== Quality Checks =====
    reviewListing(listingId: number, approved: boolean, reason: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/quality-checks/${listingId}/review`, { approved, reason });
    }

    getCheckerHistory(): Observable<any> {
        return this.http.get(`${this.apiUrl}/quality-checks/history`);
    }

    // ===== Claims =====
    claimListing(listingId: number, scheduledPickupTime: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/claims/${listingId}`, { scheduledPickupTime });
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

    getClaimByListing(listingId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/claims/listing/${listingId}`);
    }

    // ===== Ratings =====
    submitRating(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/ratings`, data);
    }

    getUserRatings(userId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/ratings/user/${userId}`);
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

    // ===== Notifications =====
    getNotifications(): Observable<any> {
        return this.http.get(`${this.apiUrl}/notifications`);
    }

    markNotificationRead(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/notifications/${id}/read`, {});
    }

    // ===== Reports =====
    downloadMonthlyReport(year: number, month: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/reports/monthly`, {
            params: new HttpParams().set('year', year.toString()).set('month', month.toString()),
            responseType: 'blob'
        });
    }

    // ===== Public =====
    getImpactStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/public/impact`);
    }

    // ===== New Round 2 Methods =====
    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
    }

    updateReview(checkId: number, approved: boolean, reason: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/quality-checks/${checkId}/update`, { approved, reason });
    }

    cancelClaim(claimId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/claims/${claimId}`);
    }
}
