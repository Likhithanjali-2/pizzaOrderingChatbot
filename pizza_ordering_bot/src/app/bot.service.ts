import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  
  private baseUrl = 'https://pizza-ordering-bot-api.herokuapp.com/data';
  // private base = 'https://pizza-ordering-bot-api.herokuapp.com/orderdetails';
  private base = 'http://localhost:8090/orderdetails';
  constructor(private http: HttpClient) { }

  getMessage(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
  makeAnOrder(pizzatype:string,pizzaname:string,customername:string,phonenumber:string,address : string): Observable<any>{
    
    const obj = {pizzatype : pizzatype,pizzaname : pizzaname,customername : customername,phonenumber:phonenumber,address:address};
    return this.http.post(`${this.base}`,obj);
  }

  getOrders(): Observable<any>{
    console.log("get orders",this.http.get(`${this.base}`));
    
    return this.http.get(`${this.base}`);
  }
  
  getDataByOrderId(id: string): Observable<any>{
    return this.http.get(`${this.base}/id/${id}`);
  }

  getDataByOrderName(name: string): Observable<any>{
    console.log(name,this.base);
    return this.http.get(`${this.base}/name/${name}`);
  }

  cancelOrder(id: string): Observable<any>{
    console.log(id);
    return this.http.get(`${this.base}/delete/${id}`);
  }
}