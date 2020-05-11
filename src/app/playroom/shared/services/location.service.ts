import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MapLocation} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  selectedLocation: BehaviorSubject<MapLocation>;

  constructor() {
    this.selectedLocation = new BehaviorSubject<MapLocation>(null);
  }

  selectLocation(mapLocation) {
    this.selectedLocation.next(mapLocation);
  }

  unselectLocation() {
    this.selectedLocation.next(null);
  }
}
