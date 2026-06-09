import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  register(data: any) {

    return this.http.post(
      `${environment.apiUrl}/auth/register`,
      data,
      { responseType: 'text' }
    );
  }

  login(data: any) {

    return this.http.post(
      `${environment.apiUrl}/auth/login`,
      data
    );
  }

  saveToken(token: string) {

    localStorage.setItem(
      'token',
      token
    );
  }

  getToken() {

    return localStorage.getItem(
      'token'
    );
  }

  logout() {

    localStorage.removeItem(
      'token'
    );
  }

  isLoggedIn() {

    return !!localStorage.getItem(
      'token'
    );
  }
}