import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatroom';

  constructor(private router: Router) {
    router.events.subscribe((val) => {

    });
  }

  ngOnInit(): void {
  }
}
