import { Component, OnInit } from '@angular/core';
import { API_URLS } from 'src/app/presentation/shared/constants';
declare let tableau: any;

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  ngOnInit(): void {
    this.initializeViz();
  }

  initializeViz() {
    const placeholderDiv = document.querySelector('.tableauViz');
    const url = API_URLS.MERCHANT_PERORMANCE_OVERWIEW_URL;
    const options = {
      width: document.querySelector('.tableau_container').clientWidth,
      height: '750px',
      device: 'desktop',
      hideTabs: false,
      hideToolbar: false,
      toolbarPosition: 'top'
    };
    const viz = new tableau.Viz(placeholderDiv, url, options);
  }
}


