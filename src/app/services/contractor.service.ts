import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Contractor } from '../interfaces/contractor';

const contractorsUrl = 'http://localhost:3000/api/employees/contractors';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private contractorSource$ = new BehaviorSubject<Contractor[]>([]);

  constructor(private http: HttpClient) { }

  fetchContractors(serviceProvider: string): void {
    this.http.get(`${contractorsUrl}/${serviceProvider}`).subscribe( (res: any) => this.contractorSource$.next(res) );
  }

  getPermissions(): Observable<any> {
    return this.http.get('http://localhost:3000/api/cityes/permissions');
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
