import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/common/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private http: HttpService) { }

  ngOnInit() {
    debugger;
    this.http.get('?cmd=100003&phone=18706127700').subscribe(data => {
    alert(data);
    });
  }

}
