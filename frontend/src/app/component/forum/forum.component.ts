// import { LiveAnnouncer } from '@angular/cdk/a11y';
// import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { ForumNavBarComponent } from '../layout/forum-nav-bar/forum-nav-bar.component';
// import { MaterialModule } from '../../material.module';
// import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule,   } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { DialogFormComponent } from './dialog-form/dialog-form.component';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { MatIconModule } from '@angular/material/icon';
// import { FileService } from '../../_service/file.service';
// import { fileForm } from '../../_model/user.model';


// export interface PeriodicElement {
//   position: number;
//   author: string;
//   name: string;
//   description: string;
//   version: string;
//   download: string;
//   rate: number;
// }


// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, author: "hdgf", name: 'Hydrogen', description: "1.0079", version: 'H' ,  download: 'H', rate: 12 },
//   { position: 2, author: "gdfgdf", name: 'Helium', description: "4.0026", version: 'He',  download: 'H', rate: 12 },
//   { position: 3, author: "gdfgdfg", name: 'Lithium', description: "gdfgdfg", version: 'Li', download: '3753', rate: 12 },
//   { position: 4, author: "", name: 'Beryllium', description: "jhfd", version: 'Be',       download: 'dsfg', rate: 12 },
//   { position: 5, author: "", name: 'Boron', description: "fjfhfgfsdgdfg", version: 'B',   download: 'dg', rate: 12 },
//   { position: 6, author: "", name: 'Carbon', description: "hfhds", version: 'C',          download: 'hgfh', rate: 12 },
// ];



// @Component({
//   selector: 'app-forum',
//   standalone: true,
//   imports: [FontAwesomeModule, DialogFormComponent, MaterialModule, MatIconModule , MatTableModule, MatSortModule, 
//             MatPaginatorModule, ForumNavBarComponent, MatDialogModule, CommonModule],
//   templateUrl: './forum.component.html',
//   styleUrl: './forum.component.css'
// })
// export class ForumComponent implements OnInit, AfterViewInit {
//   displayedColumns: string[] = ['position', 'author', 'name', 'description', 'version','download', 'rate'];
//   dataSource = new MatTableDataSource(ELEMENT_DATA);

//   fileForm: fileForm = {
//     file: null,
//     fileName: '',
//     description: '',
//     version: '',
//     tags: []
//   };
//   files: fileForm[] = [];

  
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
  
//   constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private fileService: FileService) { }
  
//   ngAfterViewInit() {
//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;

//   }

//   //
//   ngOnInit(): void {
//     this.fetchAllFiles();
//   }

//   fetchAllFiles(): void {
//     this.fileService.getAllFiles().subscribe({
//       next: files => {
//         this.files = files;
//         console.log('Files fetched successfully:', this.files);
//       },
//       error: error => {
//         console.error('Error fetching files:', error);
//         alert(`An error occurred while fetching files: ${error.message}`);
//       }
//     });
//   }

//   onChange(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.fileForm.file = file;
//       console.log('File selected:', this.fileForm.file);
//     }
//   }


//   ///
//   openDialog(): void {
//     const dialogRef = this.dialog.open(DialogFormComponent, {
//       data: {}
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed', result);
//     });
//   }

//   /** Announce the change in sort state for assistive technology. */
//   announceSortChange(sortState: Sort) {
//     // This example uses English messages. If your application supports
//     // multiple language, you would internationalize these strings.
//     // Furthermore, you can customize the message to add additional
//     // details about the values being sorted.
//     if (sortState.direction) {
//       this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
//     } else {
//       this._liveAnnouncer.announce('Sorting cleared');
//     }
//   }
// }

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ForumNavBarComponent } from '../layout/forum-nav-bar/forum-nav-bar.component';
import { MaterialModule } from '../../material.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { FileService } from '../../_service/file.service';
import { FileElement } from '../../_model/user.model'; // Ensure this matches the data structure

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
    FontAwesomeModule,
    DialogFormComponent,
    MaterialModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ForumNavBarComponent,
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'author', 'name', 'description', 'version','uploadDate', 'downloads', 'rate'];
  dataSource = new MatTableDataSource<FileElement>();

  files: FileElement[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private fileService: FileService
  ) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.fetchAllFiles();
  }

  fetchAllFiles(): void {
    this.fileService.getAllFiles().subscribe({
      next: (response: any) => {
        // Extract files array from the response
        const filesArray = response && response.$values ? response.$values : [];
  
        if (!Array.isArray(filesArray)) {
          console.error('Files received are not an array:', filesArray);
          return;
        }
  
        // Map filesArray to FileElement[]
        this.files = filesArray.map((file, index) => ({
          firstName: file.firstName,
          lastName: file.lastName,
          entityName: file.entityName,
          file: null, // Adjust according to your needs
          position: index + 1,
          author: `${file.firstName} ${file.lastName}`,
          name: file.entityName,
          description: file.description,
          version: file.version,
          uploadDate: file.uploadDate, // Make sure to format as needed
          downloads: file.downloads,
          rates: file.rates,
          tags: file.tags // Ensure this matches your data structure
        }));
  
        this.dataSource.data = this.files;
        console.log('Files fetched successfully:', this.files);
        console.log('Data Source:', this.dataSource.data); // Log the data source
      },
      error: error => {
        console.error('Error fetching files:', error);
        alert(`An error occurred while fetching files: ${error.message}`);
      }
    });
  }
  
  onChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}



