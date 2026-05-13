import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'crud-app';
  isLookupTab = false;

  ngOnInit() {
    this.isLookupTab = window.location.search.includes('isLookupTab=true');
  }

  closeTab() {
    window.close();
  }
}
