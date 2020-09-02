import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';  // CRUD API service class
import { Student } from './../shared/student';   // Student interface class for Data types.
import { ToastrService } from 'ngx-toastr';      // Alert message using NGX toastr


@Component({
  selector: 'app-students-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})

export class StudentsListComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  p: number = 1;                      // Fix for AOT compilation error for NGX pagination
  Student: Student[];                 // Save students data in Student's array.
  // tslint:disable-next-line:no-inferrable-types
  hideWhenNoStudent: boolean = false; // Hide students data table when no student.
  // tslint:disable-next-line:no-inferrable-types
  noData: boolean = false;            // Showing No Student Message, when no student in database.
  // tslint:disable-next-line:no-inferrable-types
  preLoader: boolean = true;

  constructor(
    public crudApi: CrudService, // Inject student CRUD services in constructor.
    public toastr: ToastrService // Toastr service for alert message
    ) { }


  ngOnInit() {
    this.dataState(); // Initialize student's list, when component is ready
    // tslint:disable-next-line:prefer-const
    let s = this.crudApi.GetStudentsList();
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.Student = [];
      data.forEach(item => {
        // tslint:disable-next-line:prefer-const
        let a = item.payload.toJSON();
        // tslint:disable-next-line:no-string-literal
        a['$key'] = item.key;
        this.Student.push(a as Student);
      });
    });
  }

 dataState() {
    this.crudApi.GetStudentsList().valueChanges().subscribe(data => {
      this.preLoader = false;
      if (data.length <= 0) {
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    });
  }

  // Method to delete student object
  deleteStudent(student) {
    if (window.confirm('Are sure you want to delete this student ?')) { // Asking from user before Deleting student data.
      this.crudApi.DeleteStudent(student.$key);
      this.toastr.success(student.firstName + ' successfully deleted!'); // Alert message will show up when student successfully deleted.
    }
  }

}
