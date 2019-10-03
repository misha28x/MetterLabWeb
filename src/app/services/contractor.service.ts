import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Contractor } from '../interfaces/contractor';

const contractorsUrl = 'http://165.22.83.21:3000/api/employees/contractors';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private contractorSource$ = new BehaviorSubject<Contractor[]>([]);

  constructor(private http: HttpClient) {}

  fetchContractors(): void {
    this.http.get(contractorsUrl).subscribe((res: any) => this.contractorSource$.next(res));
  }

  getContractors(): Observable<Contractor[]> {
    return this.contractorSource$.asObservable();
  }

  getPermissions(): Observable<any> {
    return this.http.get('http://165.22.83.21:3000/api/cityes/permissions');
  }

  addContractor(contractor: Contractor): Observable<any> {
    return this.http.post(contractorsUrl, contractor);
  }

  editContractor(contractor: Contractor): Observable<any> {
    return this.http.put(`${contractorsUrl}/${contractor.id}`, contractor);
  }

  deleteContractor(contractor: Contractor): Observable<any> {
    return this.http.delete(`${contractorsUrl}/${contractor.id}`);
  }
}
