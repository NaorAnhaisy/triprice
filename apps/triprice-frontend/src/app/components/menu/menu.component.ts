import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'triprice-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterViewInit, OnInit {
  title = 'TriPrice';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  userName: string | undefined;
  userAvatar: string | undefined;
  menuType = 'default';

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private _userService: UserService,
    private _authenticationService: AuthService,
  ) {}

  getUrl() {
    return "url('https://wallpapers.com/images/featured/ocean-view-background-bf1yn45r470cb824.jpg')";
  }

  ngOnInit(): void {
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (
          localStorage.getItem('currentUser') &&
          typeof localStorage.getItem('currentUser') === 'string'
        ) {
          this.userAvatar = JSON.parse(
            localStorage.getItem('currentUser') as string
          ).avatar_url || 'assets/avatar.png';
          this.menuType = 'loggedIn';
        } else {
          this.menuType = 'default';
        }
      }
    });

    this.userName = this._authenticationService.currentUserValue?.first_name;
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  public changePage(pageName: string): void {
    this.sidenav.toggle();
    this.router.navigate(['/' + pageName]);
  }

  public logout(): void {
    this.sidenav.toggle();
    this._userService.logout();
  }
}
