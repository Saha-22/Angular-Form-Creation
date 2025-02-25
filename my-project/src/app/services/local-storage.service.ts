import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


    saveData(key: string, value: any): void {
      try {
        const clonedValue = structuredClone(value); 
        localStorage.setItem(key, JSON.stringify(clonedValue));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  

    getData(key: string): any {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Error retrieving data from localStorage:', error);
        return null;
      }
    }
  
    removeData(key: string): void {
      localStorage.removeItem(key);
    }

    clearAll(): void {
      localStorage.clear();
    }
    
  }