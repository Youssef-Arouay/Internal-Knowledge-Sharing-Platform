import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  styleUrls: ['./forum.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ForumComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'author', 'name', 'description', 'version', 'uploadDate', 'downloads', 'rate'];
  dataSource = new MatTableDataSource<FileElement>();

  hasRated: boolean = false;

  files: FileElement[] = [];
  hasRatedMap: { [fileId: number]: boolean } = {}; // Map to track if user has rated a file

  private subscriptions: Subscription[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cdr: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private fileService: FileService,
    private toastr: ToastrService,
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.fetchAllFiles();
  }

  fetchAllFiles(): void {
    const subscription = this.fileService.getAllFiles().subscribe({
      next: (response: any) => {
        const filesArray = response && response.$values ? response.$values : [];

        if (!Array.isArray(filesArray)) {
          console.error('Files received are not an array:', filesArray);
          return;
        }

        // Map filesArray to FileElement[] and reverse the order
        this.files = filesArray.map((file, index) => ({
          id: file.id,
          firstName: file.firstName,
          lastName: file.lastName,
          entityName: file.entityName,
          file: null,
          position: index + 1,
          author: `${file.firstName.charAt(0).toUpperCase()}${file.firstName.slice(1)} ${file.lastName.charAt(0).toUpperCase()}${file.lastName.slice(1)}`, // Capitalize first letters
          name: file.entityName,
          description: file.description,
          version: file.version,
          uploadDate: file.uploadDate,
          downloads: file.downloads,
          rates: file.rates,
          tags: file.tags,
        })).reverse(); // Reverse the array to get it from the newest to oldest one 
        this.dataSource.data = this.files;
        // console.log('Files fetched successfully:', this.files);
        // console.log('Data Source:', this.dataSource.data); // Log the data source
      },
      error: error => {
        console.error('Error fetching files:', error);
        this.toastr.error('Failed due to : ' + error.message, 'Failed to fetch files');
      }
    });
    this.subscriptions.push(subscription);
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

  // Sort table using name of column
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  // DOWNLOAD FILE CALL API
  downloadFile(entityName: string): void {
    const subscription = this.fileService.downloadFile(entityName).subscribe({
      next: (response: Blob) => {
        this.incrementDownloadCount(entityName);
        this.triggerFileDownload(response, entityName);
      },
      error: error => {
        console.error('Error downloading file:', error);
        this.toastr.error('Error due to : ' + error.message, 'Failed to download file');
      }
    });
    this.subscriptions.push(subscription);
  }
  incrementDownloadCount(entityName: string): void {
    const fileToUpdate = this.files.find(file => file.entityName === entityName);
    if (fileToUpdate) {
      fileToUpdate.downloads++;
      this.dataSource.data = [...this.files];
    }
  }
  triggerFileDownload(blob: Blob, fileName: string): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }


  // RATE AND UNRATE
  // handleRateFile(file: FileElement): void {
  //   if (this.hasRated) {
  //     this.unrateFile(file);
  //     this.cdr.detectChanges(); // Trigger change detection explicitly
  //     this.hasRated = true;
  //   } else {
  //     this.rateFile(file);
  //     this.hasRated = false;
  //     this.cdr.detectChanges(); // Trigger change detection explicitly
  //   }
  // }

  // rateFile(file: FileElement): void {
  //   const subscription = this.fileService.rateFile(file.id).subscribe({
  //     next: () => {
  //       file.rates++;
  //       this.dataSource.data = [...this.files];
  //       this.toastr.success('File rated successfully');
  //       this.hasRated = true;
  //     },
  //     error: error => {
  //       console.error('Error rating file:', error);
  //       this.toastr.error('Failed due to : ' + error.message, 'Failed to rate file');
  //     }
  //   });

  //   this.subscriptions.push(subscription);
  // }

  // unrateFile(file: FileElement): void {
  //   const subscription = this.fileService.unrateFile(file.id).subscribe({
  //     next: () => {
  //       file.rates--;
  //       this.dataSource.data = [...this.files];
  //       this.toastr.success('File unrated successfully');
  //       this.hasRated = false;
  //     },
  //     error: error => {
  //       console.error('Error unrating file:', error);
  //       this.toastr.error('Failed due to : ' + error.message, 'Failed to unrate file');
  //     }
  //   });

  //   this.subscriptions.push(subscription);
  // }

  handleRateFile(file: FileElement): void {
    const hasRated = this.hasRatedMap[file.id];
    if (hasRated) {
      this.unrateFile(file.id);
    } else {
      this.rateFile(file.id);
    }
  }

  rateFile(fileId: number): void {
    const subscription = this.fileService.rateFile(fileId).subscribe({
      next: () => {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
          file.rates++;
          this.hasRatedMap[fileId] = true;
          this.dataSource.data = [...this.files];
          this.toastr.success('File rated successfully');
          this.cdr.detectChanges(); // Trigger change detection explicitly
        }
      },
      error: error => {
        console.error('Error rating file:', error);
        this.toastr.error('Failed to rate file');
      }
    });
  
    this.subscriptions.push(subscription);
  }
  
  unrateFile(fileId: number): void {
    const subscription = this.fileService.unrateFile(fileId).subscribe({
      next: () => {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
          file.rates--;
          this.hasRatedMap[fileId] = false;
          this.dataSource.data = [...this.files];
          this.toastr.success('File unrated successfully');
          this.cdr.detectChanges(); // Trigger change detection explicitly
        }
      },
      error: error => {
        console.error('Error unrating file:', error);
        this.toastr.error('Failed to unrate file');
      }
    });
  
    this.subscriptions.push(subscription);
  }
  



  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}



