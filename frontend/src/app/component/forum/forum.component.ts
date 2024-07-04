import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ForumNavBarComponent } from '../layout/forum-nav-bar/forum-nav-bar.component';
import { MaterialModule } from '../../material.module';


export interface PeriodicElement {
  position: number;
  author: string ;
  name: string;
  description: string;
  version: string;
  rate: number;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, author:"hdgf", name: 'Hydrogen', description: "1.0079",       version: 'H', rate:12},
  {position: 2,author:"gdfgdf", name: 'Helium',   description: "4.0026",         version: 'He', rate:12},
  {position: 3,author:"gdfgdfg", name: 'Lithium',   description: "gdfgdfg",      version: 'Li', rate:12},
  {position: 4,author:"", name: 'Beryllium', description:"jhfd",           version: 'Be', rate:12},
  {position: 5,author:"", name: 'Boron',    description: "fjfhfgfsdgdfg", version: 'B', rate:12},
  {position: 6,author:"", name: 'Carbon',   description: "hfhds",         version: 'C', rate:12},
];



@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [MaterialModule ,MatTableModule, MatSortModule, MatPaginatorModule, ForumNavBarComponent ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'author' , 'name', 'description', 'version', 'rate'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}