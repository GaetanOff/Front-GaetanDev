import { Injectable } from '@angular/core';

function getLocalStorage(): Storage {
  return localStorage;
}

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() {
  }

  get get(): Storage {
    return getLocalStorage();
  }
}
