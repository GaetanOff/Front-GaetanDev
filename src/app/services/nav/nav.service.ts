import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  isAdminNavOpened: boolean = true;

  constructor() {
  }


}
