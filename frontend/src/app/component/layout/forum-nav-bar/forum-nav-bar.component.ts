import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../_service/user.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-forum-nav-bar',
  standalone: true,
  imports: [MaterialModule ,CommonModule, MatTable,MatMenu, MatToolbarModule, MatIcon, MatMenuTrigger, MatPaginator, MatCardFooter, MatCard, MatCardContent, MatCardHeader],
  templateUrl: './forum-nav-bar.component.html',
  styleUrl: './forum-nav-bar.component.css'
})
export class ForumNavBarComponent implements OnInit {
  customerList: any[] = [
    { code: 'C001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', creditlimit: 5000, statusname: 'Active' },
    { code: 'C002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1987654321', creditlimit: 8000, statusname: 'Inactive' },
    { code: 'C003', name: 'Michael Johnson', email: 'michael.johnson@example.com', phone: '+1122334455', creditlimit: 7000, statusname: 'Active' },
    { code: 'C004', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1765432109', creditlimit: 6000, statusname: 'Active' },
    { code: 'C005', name: 'David Wilson', email: 'david.wilson@example.com', phone: '+1567890123', creditlimit: 9000, statusname: 'Inactive' }
  ];

  displayedColumns: string[] = ["code", "name", "email", "phone", "creditlimit", "statusname", "action"];
  dataSource!: MatTableDataSource<any> ;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.customerList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource)
  }

  functionEdit(code: string) {
    // Implement edit functionality
    this.router.navigateByUrl('/customer/edit/' + code);
  }

  functionDelete(code: string) {
    // Implement delete functionality
    if (confirm('Are you sure?')) {
      // Delete logic
      this.toastr.success('Deleted successfully', 'Success');
    }
  }
}