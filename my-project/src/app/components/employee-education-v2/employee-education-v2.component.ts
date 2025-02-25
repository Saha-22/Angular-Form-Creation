import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-education-v2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './employee-education-v2.component.html',
  styleUrl: './employee-education-v2.component.css',
  providers:[LocalStorageService]
})
export class EmployeeEducationV2Component implements OnInit {

  employeeEducationList: any[] = [];
  employeeInfoList: any[] = [];
  designationList: any[] = [];
  selectedImage: string | ArrayBuffer | null = null;
  editIndex: number | null = null;
  editMode: boolean = false;
  editModeEdu: boolean = false;
  editModeInfoEdu: boolean = false;
  showEducationList: boolean = false;
  showFullList: boolean = false;
  showEmployeeList: boolean = false;

  employeeEducationInfo: FormGroup = new FormGroup({
    organization: new FormControl("",Validators.required),
    jobTitle: new FormControl(""),
    joiningDate: new FormControl(""),
    lastWorkingDate: new FormControl(""),
    reportTo: new FormControl(""),
    designation: new FormControl(""),
    salary: new FormControl(""),
    hrName: new FormControl(""),
    numberEmployees: new FormControl(""),
    significantAchievements: new FormControl(""),
    otherBenefits: new FormControl(""),
  })

  employeeInfo: FormGroup = new FormGroup({
    emplId: new FormControl("",[Validators.required,
      Validators.pattern("^[0-9]+$")]),
    employeeName: new FormControl("",Validators.required),
    dateOfBirth: new FormControl("",Validators.required),
    age: new FormControl({ value: "", disabled: true }),
    phoneNumber: new FormControl("",[Validators.required, Validators.pattern(/^(?:\+?88)?01[1-9]\d{8}$/)]),
    gender: new FormControl(""),
    blood: new FormControl(""),
    photo: new FormControl("",Validators.required),
    educationList: new FormControl([])
  })

  constructor(private localStorageService: LocalStorageService,  private router: Router) { }
  
  
  ngOnInit(): void {  
    
    const state = history.state; 
    console.log("Received state:", state);

    if (state && state.employee) {
      this.editIndex = state.index;
      this.patchEmployeeData(state.employee);

      this.editModeInfoEdu = true;
    }

    else {
      console.warn("No employee data received!"); 
      
    }

    this.employeeInfoList = this.localStorageService.getData('employeeswithInfo') || [];
    
  }

  patchEmployeeData(employee: any) {
    if (!employee) return;

    this.employeeInfo.patchValue(employee);
    this.selectedImage = employee.photo || null;
    this.employeeEducationList = employee.educationList ? [...employee.educationList] : [];
    this.editMode = true;
  }

  
  
  
  addEducation() {
    
    if (this.employeeEducationInfo.invalid) {
      alert("ADD all required info");
      
      return;
    }

    this.employeeEducationList.push({ ...this.employeeEducationInfo.value });
    this.showEducationList = true;
    this.employeeEducationInfo.reset();
  }

  
  saveEmployee() {
    
    const employeeId = this.employeeInfo.value.emplId;
    if (!employeeId) {
      alert("Employee ID is required!");
      return;
    }

    if (!this.employeeEducationList.length) {
      alert("Please add at least one education record before saving!");
      return;
    }

    const employeeData = {
      ...this.employeeInfo.value,
      educationList: [...this.employeeEducationList],
      photo: this.selectedImage || "",
    };

    this.employeeInfoList.push(employeeData);
    this.localStorageService.saveData("employeeswithInfo", this.employeeInfoList);

    this.clearAllForms();
  }

  saveEmployeeUpdate() {
    
  
      const employeeId = this.employeeInfo.value.emplId;
    
      if (!employeeId) {
        alert("Employee ID is required!");
        return;
      }
    
      
      const existingIndex = this.employeeInfoList.findIndex(emp => emp.emplId === employeeId);
    
      
      const employeeData = {
        ...this.employeeInfo.value,
        educationList: [...this.employeeEducationList],
        photo: this.selectedImage || (existingIndex !== -1 ? this.employeeInfoList[existingIndex].photo : ""),
      };
    
      if (existingIndex !== -1) {
        
        this.employeeInfoList[existingIndex] = employeeData;
      } else {
        
        this.employeeInfoList.push(employeeData);
      }
    
      this.localStorageService.saveData("employeeswithInfo", this.employeeInfoList);
    
      this.clearAllForms();
      this.editModeInfoEdu = false;
      this.editMode = false;
      }


  removeEmployee(index: number) {
    this.employeeInfoList.splice(index,1);
    this.localStorageService.saveData('employeeswithInfo', this.employeeInfoList);
  }

  editEmployee(index: number) {
    this.editIndex = index;
    const selectedEmployee = this.employeeInfoList[index];

    this.employeeInfo.patchValue(selectedEmployee);
    this.employeeEducationList = [...selectedEmployee.educationList];
    this.editMode = true;
    this.showEducationList = true;
    this.editModeInfoEdu = true;
  }


  updateEmployee() {
    
    const employeeId = this.employeeInfo.value.emplId;
    
    const existingIndex = this.employeeInfoList.findIndex(emp => emp.emplId === employeeId);


    const updatedEmployee = {
      ...this.employeeInfo.value,
      educationList: [...this.employeeEducationList],
      photo: this.selectedImage || (existingIndex !== -1 ? this.employeeInfoList[existingIndex].photo : null),
    };

    if (existingIndex !== -1) {
      this.employeeInfoList.splice(existingIndex, 1);
    }
    
    this.employeeInfoList.push(updatedEmployee);

    this.localStorageService.saveData("employeeswithInfo", this.employeeInfoList);

    this.editIndex = null;
    this.editMode = false;
    this.clearAllForms();
  }

  calculateAge() {
    const dobValue = this.employeeInfo.get('dateOfBirth')?.value;
    
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
  
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
  
      this.employeeInfo.get('age')?.setValue(age);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
  
    if (!file) return; 
  
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      event.target.value = ""; 
      return;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result; 
      this.employeeInfo.patchValue({ photo: reader.result }); 
    };
    reader.readAsDataURL(file);
  }

  onFullShowList(){
    this.showFullList = true;

  }

  toggleFullListView() {
    this.showFullList = !this.showFullList;
  }
 
  clearAllForms() {
    this.employeeInfo.reset();
    this.employeeEducationInfo.reset();
    this.employeeEducationList = [];
    this.showEmployeeList = false;
    this.selectedImage = null;
  }

    showEmployees(){
    
    console.log('employeeswithInfo',this.employeeInfoList);
  } 

    editEducation(index: number) {
    this.editIndex = index;
    this.employeeEducationInfo.patchValue(this.employeeEducationList[index]);
    this.editModeEdu = true;
  }

  
    updateEducation() {
    if (this.editIndex !== null) {
      this.employeeEducationList[this.editIndex] = { ...this.employeeEducationInfo.value };
      this.editIndex = null;
      this.employeeEducationInfo.reset();
    }
    this.editModeEdu = false;
  }

  
   removeEducation(index: number) {
    this.employeeEducationList.splice(index, 1);
  }

  showEmployeesEdu() {
    this.showEmployeeList = true;
    this.employeeInfoList = this.localStorageService.getData('employeeswithInfo') || [];
  }

}



