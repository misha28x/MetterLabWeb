import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee } from '../interfaces/employee';

const employeeUrl = 'http://localhost:3000/api/employees/users';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeSource$ = new BehaviorSubject<Employee[]>([]);

  constructor(private http: HttpClient) {}

  fetchEmployees(serviceProvider: string): void {
    this.http
      .get(`${employeeUrl}/${serviceProvider}`)
      .subscribe((res: any) => this.employeeSource$.next(res));
  }

  getEmployees(): Observable<any> {
    return this.employeeSource$.asObservable();
  }

  // getEmployee(employee: Employee): Observable<any> {
  //   return this.http.post(`${employeeUrl}/${employee.id}`, employee);
  // }

  getPermissions(): Observable<any> {
    return this.http.get('http://localhost:3000/api/employees/permissions');
  }

  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(employeeUrl, employee);
  }

  editEmployee(employee: Employee): Observable<any> {
    return this.http.put(`${employeeUrl}/${employee.id}`, employee);
  }

  deleteEmployee(employee: Employee): Observable<any> {
    return this.http.delete(`${employeeUrl}/${employee.id}`);
  }
}
