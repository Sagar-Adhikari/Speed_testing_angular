import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  statusList = [
    { name: '--Select One--' },
    { id: 1, name: 'Active' },
    { id: 0, name: 'Deactive' }
  ];

  roleList = [
    { name: '--Select One--' },
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
  ];


  loading = false;
  email: any;
  selectedRole: any;
  selectedStatus: any;

  dataSource = [];
  length = 0;


  private sortDirection: any;
  private sortField: any;

  formatDate(x: any): string {
    const d = new Date(x).toLocaleDateString();
    const t = new Date(x).toLocaleTimeString();
    return `${d} ${t}`
  }

  displayColumns = ['email', 'roleId', 'status', 'created_at', 'updated_at', 'action'];


  constructor(private userService: UserService, private layoutService: LayoutService) {
    this.layoutService.setLayout({ pageTitle: 'User List', allowFooter: true })
  }
  

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 200, 300, 400, 500];
    this.paginator.pageSize = 10;
    this.loadData();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === "asc" ? 'ASC' : x.direction === "desc" ? "DESC" : undefined;
    });

    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadData())
    ).subscribe();
  }
  loadData() {
    this.loading = true;
    this.userService.getUsersList(this.email, this.selectedStatus, this.selectedRole, this.paginator.pageIndex, this.paginator.pageSize, this.sortField, this.sortDirection).subscribe(x => {

      this.length = x.count.recordCount;
      x.data.forEach(element => {
        element.created_at = this.formatDate(element.created_at);
        element.updated_at = this.formatDate(element.updated_at);
        element.role = element.roleId == 1 ? 'Admin' : 'User';
        element.status = element.status == 1 ? 'Active' : 'Deactive';
      });
      this.dataSource = x.data;
      this.loading = false;
    });
  }

  itemChange($event: any, flag: string) {
    if ($event.isUserInput) {
      if (flag === 'status') {
        this.selectedStatus = $event.source.value;
      } else {
        this.selectedRole = $event.source.value;
      }
      this.paginator.pageIndex = 0;
      this.loadData();
    }
  }

  emailChanged($event: any) {
    this.email = $event.target.value;
    this.loadData();
  }

  editUser(userId: string) {
  }




}
