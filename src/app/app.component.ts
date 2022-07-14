import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './user-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren('lastUser', { read: ElementRef })
  lastUser: QueryList<ElementRef> | undefined;

  userSubscription: Subscription | undefined;
  allUsers: any = [];
  total: number | any;
  curretPage: number = 0;
  observer: any;

  constructor(private uService: UserService) {}

  ngOnInit() {
    this.getUsers();
    this.intersectionObserver();
  }
  ngAfterViewInit() {
    this.lastUser?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  getUsers() {
    this.userSubscription = this.uService
      .getApi(this.curretPage)
      .subscribe((d) => {
        console.log('subscribed');

        this.total = d.total;
        d.list.forEach((element: any) => {
          this.allUsers.push(element);
        });
      });
  }

  intersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log('<-Pages loaded');
        if (this.curretPage < this.total) {
          this.curretPage++;
          this.getUsers();
        }
      }
    }, options);
  }
}
