import { Component } from '@angular/core';
import { HttpRequestCardComponent } from '@components/http-request-card/http-request-card.component';
import { ResponseCardComponent } from '@components/response-card/response-card.component';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [HttpRequestCardComponent, ResponseCardComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss',
})
export class HomeViewComponent {}
