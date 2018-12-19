import { Component, OnInit } from '@angular/core';
import { RoutesService } from "../services/routes/routes.service"

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  routes: [{}];
  stations: [{}];

  selectedOriginStation = -1;
  selectedDestinationStation = -1;
  numberOfPaths = 2

  shortestRoutes;
  map;

  step = 1;

  originEqualToDestination = false;
  spaceBetweenEdges = 3

  constructor(private routesService: RoutesService) { }

  ngOnInit() {
    console.log("ngOnInit");

    this.routesService.getStations().subscribe(stations => {
      this.stations = stations;
    });

    this.routesService.getMap().subscribe(map => {
      this.map = map;
      this.separateEdges();
    })
  }


  clickedStation(station) {   
    if (station.id === this.selectedOriginStation) {
      this.originEqualToDestination = true;
    } else {
      if(this.step === 1) {
        this.selectedOriginStation = station.id;
        this.step = 2;
      } else if (this.step === 2) {
        this.selectedDestinationStation = station.id;
        this.calculateRoutes();
        this.step = 3;
        this.originEqualToDestination = false;
        this.selectedOriginStation = -1;
        this.selectedDestinationStation = -1;
      }
    }
    
    
  }

  restart() {
    this.step = 1;
    this.shortestRoutes = undefined;
    this.originEqualToDestination = false;
    this.selectedOriginStation = -1;
    this.selectedDestinationStation = -1;
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

  separateEdges() {
    let arraysOfEdges = new Array();

    this.map.edges.forEach(edge => {
      let added = false;
      arraysOfEdges.forEach((arrayOfEdges: Array<any>) => {
        if (
          (
            arrayOfEdges[0].x1 === edge.x1 &&
            arrayOfEdges[0].y1 === edge.y1 &&
            arrayOfEdges[0].x2 === edge.x2 &&
            arrayOfEdges[0].y2 === edge.y2
          ) || (
            arrayOfEdges[0].x1 === edge.x2 &&
            arrayOfEdges[0].y1 === edge.y2 &&
            arrayOfEdges[0].x2 === edge.x1 &&
            arrayOfEdges[0].y2 === edge.y1
          )
        ) {
          arrayOfEdges.push(edge);
          added = true;
        }
      });

      if (!added) {
        arraysOfEdges.push(new Array(edge));
      }
    });
    let newEdges = new Array();

    arraysOfEdges.forEach(arrayOfEdges => {

      let x1: number;
      let y1: number;
      let x2: number;
      let y2: number;


      if (arrayOfEdges.length % 2 === 1) {
        x1 = arrayOfEdges[0].x1 - (((arrayOfEdges.length - 1) / 2) * this.spaceBetweenEdges);
        y1 = arrayOfEdges[0].y1 - (((arrayOfEdges.length - 1) / 2) * this.spaceBetweenEdges);
        x2 = arrayOfEdges[0].x2 - (((arrayOfEdges.length - 1) / 2) * this.spaceBetweenEdges);
        y2 = arrayOfEdges[0].y2 - (((arrayOfEdges.length - 1) / 2) * this.spaceBetweenEdges);
      } else {

        x1 = arrayOfEdges[0].x1 - ((arrayOfEdges.length / 2) * this.spaceBetweenEdges) + (this.spaceBetweenEdges / 2);
        y1 = arrayOfEdges[0].y1 - ((arrayOfEdges.length / 2) * this.spaceBetweenEdges) + (this.spaceBetweenEdges / 2);
        x2 = arrayOfEdges[0].x2 - ((arrayOfEdges.length / 2) * this.spaceBetweenEdges) + (this.spaceBetweenEdges / 2);
        y2 = arrayOfEdges[0].y2 - ((arrayOfEdges.length / 2) * this.spaceBetweenEdges) + (this.spaceBetweenEdges / 2);
      }

      let L = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2))

      arrayOfEdges.forEach((edge, index) => {
        edge.x1 = x1 + (this.spaceBetweenEdges * index) * (y2-y1) / L;
        edge.x2 = x2 + (this.spaceBetweenEdges * index) * (y2-y1) / L;
        edge.y1 = y1 + (this.spaceBetweenEdges * index) * (x1-x2) / L;
        edge.y2 = y2 + (this.spaceBetweenEdges * index) * (x1-x2) / L;
        newEdges.push(edge);
      });
    });

    this.map.edges = newEdges;
  }

}
