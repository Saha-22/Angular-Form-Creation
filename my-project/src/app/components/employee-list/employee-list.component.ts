import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  imports: [ReactiveFormsModule, CommonModule, RouterLink ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  
})
export class EmployeeListComponent implements OnInit {
    
  employeeInfoList: any[] = [];

  
  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {

    this.employeeInfoList = this.localStorageService.getData('employeeswithInfo') || [];
  }
  
  editEmployee(employee: any, index: number) {
    console.log("Navigating to EmployeeEducationV2 with:", employee); 
    this.router.navigate(['/app-employee-education-v2'], { state: { employee, index } });
  }

  deleteEmployee(index: number) {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      this.employeeInfoList.splice(index, 1); 
      this.localStorageService.saveData('employeeswithInfo', this.employeeInfoList); 
    }
  }
  
}





