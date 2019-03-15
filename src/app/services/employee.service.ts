import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Employee } from '../interfaces/employee';
import { tap } from 'rxjs/operators';

const employeeUrl = 'http://localhost:3000/api/employees/users';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeSource$ = new BehaviorSubject<Employee[]>([]);

  constructor(private http: HttpClient) { }

  fetchEmployees(serviceProvider: string): void {
    this.http.get(`${employeeUrl}/${serviceProvider}`).pipe(tap(console.log)).subscribe( (res: any) => this.employeeSource$.next(res) );
  }

  getEmployees(): Observable<any> {
    return this.employeeSource$.asObservable();
  }

  getEmployee(employee: Employee): Observable<any> {
    return this.http.post(`${employeeUrl}/${employee.id}`, employee);
  }

  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(employeeUrl, employee);
  }

  editEmployee(employee: Employee): Observable<any> {
    return this.http.post(`${employeeUrl}/${employee.id}`, employee);
  }

  deleteEmployee(employee: Employee): Observable<any> {
    return this.http.delete(`${employeeUrl}/${employee.id}`);
  }
}
