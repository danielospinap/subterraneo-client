import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  baseUrl = "http://localhost:8080/"

  constructor(private http: HttpClient) { }

  public getStations(): Observable<any> {
    return this.http.get(this.baseUrl + "stations");
  }

}
