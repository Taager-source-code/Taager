import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';
import { UserService } from 'src/app/presentation/shared/services/user.service';

@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss']
})
export class TopBannerComponent implements OnInit {
  public announcementsList: any[];
  public showNavigationArrows: boolean;
  public isMobile: boolean;

  constructor(
    private userService: UserService,
    private responsiveService: ResponsiveService
  ) {
    this.announcementsList = [];
    this.showNavigationArrows = true;
  }

  ngOnInit(): void {
    this.getIsMobile();
    this.getAnnouncement();
    const screenSize = this.responsiveService.getScreenWidth();
    if (screenSize === 'xl') {
      this.showNavigationArrows = true;
    } else if (screenSize === 'lg') {
      this.showNavigationArrows = false;
    } else if (screenSize === 'md') {
      this.showNavigationArrows = false;
    } else if (screenSize === 'sm') {
      this.showNavigationArrows = false;
    } else {
      this.showNavigationArrows = false;
    }
   }

  getAnnouncement(): void {
    this.userService.getAnnouncement().subscribe((res: any) => {
      this.announcementsList = res.data.filter (announcement => announcement.isMobile === this.isMobile);
    });
  }

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }
}


