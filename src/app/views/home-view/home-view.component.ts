import { Component } from '@angular/core';
import { HttpRequestCardComponent } from '@components/http-request-card/http-request-card.component';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [HttpRequestCardComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss',
})
export class HomeViewComponent {}
