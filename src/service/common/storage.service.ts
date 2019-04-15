import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
    console.log('Hello StorageService');
  }

  write(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  read<T>(key: string): T {
    const value: string = localStorage.getItem(key);

// tslint:disable-next-line: triple-equals
    if (value && value != 'undefined' && value != 'null') {
      return <T>JSON.parse(value);
    }
    return null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}
