import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss'],
})

/**
 * Google component
 */
export class GoogleComponent implements OnInit {
  longitude = 20.728218;
  latitude = 52.128973;
  markers: any;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor() {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Maps' }, { label: 'Google Maps', active: true }];

    /**
     * fetches data
     */
    this._fetchData();
  }

  /**
   *
   * @param position position where marker added
   */
  placeMarker(position: any) {
    const lat = position.coords.lat;
    const lng = position.coords.lng;

    this.markers.push({ latitude: lat, longitude: lng });
  }

  /**
   * Fetches the value of map
   */
  private _fetchData() {
    this.markers = [{ latitude: 52.228973, longitude: 20.728218 }];
  }
}
