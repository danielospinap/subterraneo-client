import { Component, OnInit } from '@angular/core';
import { RoutesService } from "../services/routes/routes.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  queries: [];
  displayedColumns = ['originStation', 'destinationStation', 'times'];

  constructor(private routesService: RoutesService) { }

  ngOnInit() {
    this.routesService.getHistory().subscribe( queries => {
      this.queries = queries;
    })
  }

}
