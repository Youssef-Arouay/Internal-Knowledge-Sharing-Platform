import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../material.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { FileService } from '../../_service/file.service';
import { usercred } from '../../_model/user.model';
import { FileElement } from '../../_model/file.model';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../_service/user.service';


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
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ForumComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['position', 'author', 'name', 'description', 'version', 'uploadDate', 'downloads', 'rate'];
  dataSource = new MatTableDataSource<FileElement>();

  user: usercred | null = null;


  hasRated: boolean = false;
  hasRatedMap: { [fileId: number]: boolean } = {}; // Map to track if user has rated a file
  selectedTag: string = 'Tags'; // Default button text

  files: FileElement[] = [];
  uniqueTags: string[] = [];


  private subscriptions: Subscription[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private fileService: FileService,
    private toastr: ToastrService,) 
  {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      this.fetchAllFiles();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  fetchAllFiles(): void {
    const subscription = this.fileService.getAllFiles().subscribe({
      next: (response: any) => {
        const filesArray = response && response.$values ? response.$values : [];

        if (!Array.isArray(filesArray)) {
          console.error('Files received are not an array:', filesArray);
          return;
        }

        const tagSet = new Set<string>(); // Use a set to store unique tags

        // Map filesArray to FileElement[] and reverse the order
        this.files = filesArray.map((file, index) => {
          // Initialize hasRatedMap based on whether the current user has rated the file
          this.hasRatedMap[file.id] = file.ratedByUsers.$values.some((user: usercred) => user.id === this.user?.id);

          // Parse the tags from the $values property
          let parsedTags: string[] = [];
          if (file.tags.$values) {
            parsedTags = file.tags.$values.flatMap((tag: string) => {
              try {
                const parsedTag = JSON.parse(tag);
                // Handle array of tags
                if (Array.isArray(parsedTag)) {
                  return parsedTag.map(t => t.trim().replace(/^"|"$/g, '').toLowerCase());
                }
                // Handle single tag
                return [tag.trim().replace(/^"|"$/g, '').toLowerCase()];
              } catch {
                // Handle tag that is not JSON
                return [tag.trim().replace(/^"|"$/g, '').toLowerCase()];
              }
            });
          }

          // Add parsed tags to the set for uniqueness
          parsedTags.forEach(tag => tagSet.add(tag));

          return {
            id: file.id,
            firstName: file.firstName,
            lastName: file.lastName,
            entityName: file.entityName,
            file: null,
            // position: index + 1,
            position: filesArray.length - index,
            author: `${file.firstName.charAt(0).toUpperCase()}${file.firstName.slice(1)} ${file.lastName.charAt(0).toUpperCase()}${file.lastName.slice(1)}`,
            name: file.entityName,
            description: file.description,
            version: file.version,
            uploadDate: file.uploadDate,
            downloads: file.downloads,
            rates: file.rates,
            tags: parsedTags,
            ratedByUsers: file.ratedByUsers
          };
        }).reverse();// Reverse the array to get it from the newest to oldest one 

        this.uniqueTags = Array.from(tagSet).sort();

        this.dataSource.data = this.files;

        this.cdr.detectChanges(); // Trigger change detection explicitly
      },
      error: error => {
        // console.error('Error fetching files:', error);
        this.toastr.error('Failed due to : ' + error.message, 'Failed to fetch files');
      }
    });
    this.subscriptions.push(subscription);
  }


  //// Filtre files by tags 
  filterByTag(tag: string): void {
    this.selectedTag = tag; 
    this.dataSource.data = this.files.filter(file => file.tags.includes(tag));
  }
  resetFilter(): void {
    this.selectedTag = 'Tags'; 
    this.dataSource.data = this.files; 
  }

  //Search by any word in any column
  applyFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    const filterTerms = filterValue.split(' ');

    this.dataSource.data = this.files.filter(file => {
      return filterTerms.every(term =>
        file.entityName.toLowerCase().includes(term) ||
        file.description.toLowerCase().includes(term) ||
        file.version.toLowerCase().includes(term) ||
        file.firstName.toLowerCase().includes(term) ||
        file.lastName.toLowerCase().includes(term) ||
        `${file.firstName.toLowerCase()} ${file.lastName.toLowerCase()}`.includes(term)
      );
    });
  }

  // Open upload file form
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.fetchAllFiles();
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


  // RATE & UNRATE FILE //
  handleRateFile(file: FileElement): void {
    const hasRated = this.hasRatedMap[file.id];
    console.log("this.hasRatedMap", this.hasRatedMap)
    if (hasRated) {
      this.unrateFile(file);
    } else {
      this.rateFile(file);
    }
  }

  rateFile(file: FileElement): void {
    const subscription = this.fileService.rateFile(file.id).subscribe({
      next: () => {
        file.rates++;
        this.hasRatedMap[file.id] = true;
        this.dataSource.data = [...this.files];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error rating file:', error);
        this.toastr.error('Failed to rate file');
      }
    });
    this.subscriptions.push(subscription);
  }

  unrateFile(file: FileElement): void {
    const subscription = this.fileService.unrateFile(file.id).subscribe({
      next: () => {
        file.rates--;
        this.hasRatedMap[file.id] = false;
        this.dataSource.data = [...this.files];
        this.cdr.detectChanges();
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



