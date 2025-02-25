import { Routes } from '@angular/router';
import { EmployeeEducationV2Component } from './components/employee-education-v2/employee-education-v2.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

export const routes: Routes = [

    {
        path:'app-employee-education-v2', 
        component: EmployeeEducationV2Component
    },
    {
        path:'app-employee-list', 
        component: EmployeeListComponent
    },
    {
        path: '', redirectTo: 'app-employee-list', pathMatch: 'full' 
    },
  
];
