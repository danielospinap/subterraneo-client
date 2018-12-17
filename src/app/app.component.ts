import { Component, OnInit } from '@angular/core';
import { RoutesService } from "./services/routes/routes.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  routes: [{}];
  stations: [{}];

  selectedOriginStation = -1;
  selectedDestinationStation = -1;
  numberOfPaths = 2

  shortestRoutes;

  constructor(private routesService: RoutesService) {}

  ngOnInit() {
    console.log("ngOnInit");
    
    this.routesService.getStations().subscribe(stations => {
      this.stations = stations;
    });
  }

  calculateRoutes() {
    this.routesService.getShortestRoutes(
      this.selectedOriginStation, 
      this.selectedDestinationStation, 
      this.numberOfPaths
    ).subscribe(routes => {
      this.shortestRoutes = routes;
    });
  }

}
