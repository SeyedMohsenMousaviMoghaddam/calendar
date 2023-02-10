import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges,TemplateRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { mounthsEN } from './Localization/monthsEN';
import { weekdayEN } from './Localization/weekdaysEN';
import { yearsLabel } from './Localization/years';
import { IEventData } from './Interface/IEventData';
import { OverlayService } from '../../services/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';
import { SubscribeComponent } from '../subscribe/subscribe.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {
  yesNoComponent = YesNoDialogComponent;
  subscribeComponent = SubscribeComponent;
  isSmall = false;
  today;
  currentMonth;
  currentYear;
  firstDay: any;
  daysInMonth: any;
  daysInLastMonth: any;
  actDay: any;
  lastMonth: any;
  actMonth: any;
  months: any;
  weekdays: any;
  years : any;
  actFullDate: any;
  actDate: any;
  arrTest : any[] = [];
  arrCalendar : any[] = [];
  eventsData: any;
  actYear: any;
  showChangeDate = false;
  subscribeData = null;
  yesNoComponentResponse = null;
  yesNoTemplateResponse = null;
  overlayService: any = OverlayService;

  @Input() dataSource: IEventData[] = [];
  @Input() language: string = '';
  @Output() dayEvents = new EventEmitter();
  @Output() newEvent = new EventEmitter();
  constructor() {
    this.overlayService = OverlayService;
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.years = yearsLabel;
    this.months = mounthsEN;
    this.weekdays = weekdayEN;
  }

  ngOnInit() {
    this.actFullDate = formatDate(new Date(), 'yyyy. MMMM. dd', 'en');
    this.actDate = formatDate(new Date(), 'yyyy. MMMM', 'en');
    this.actDay = formatDate(new Date(), 'dd', 'en');
    this.actMonth = formatDate(new Date(), 'MM', 'en');
    this.actYear = formatDate(new Date(), 'yyyy', 'en');
    this.eventsData = this.dataSource;
  }
  open(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe((res : any) => {
      if (typeof content === 'string') {
      } else if (content === this.yesNoComponent) {
        this.yesNoComponentResponse = res.data;
      } else if (content === this.subscribeComponent) {
        this.subscribeData = res.data;
      } else {
        this.yesNoTemplateResponse = res.data;
      }
    });
  }

  ngAfterViewInit(): void {
    const height = document.getElementById('cont')!.offsetHeight;
    const width = document.getElementById('cont')!.offsetWidth;

    // TODO: if small only show badges not all the events
    if (height <= 600 || width <= 700) {
     // console.log('small');
      this.isSmall = true;
    } else {
      this.isSmall = false;
    }

  }



  ngOnChanges() {
    this.eventsData = this.dataSource;

    this.createCalendar();
  }

  createCalendar() {
    this.arrTest = [];
    this.arrCalendar = [];
    this.firstDay = new Date(this.currentYear, this.currentMonth).getUTCDay();
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysInLastMonth = this.getDaysInMonth(
      this.currentMonth - 1,
      this.currentYear
    );
    const lmd = this.daysInLastMonth - (this.firstDay - 1);

    // Last month days
    for (let index = lmd; index <= this.daysInLastMonth; index++) {
      this.arrTest.push({
        day: index,
        month: this.currentMonth - 1,
        year: this.currentYear,
        events: []
      });
    }

    // Actual month
    for (let index = 1; index <= this.daysInMonth; index++) {
      const filterEvents = this.eventsData.filter((event:any) => {
        return (
          event.startDate.getTime() <=
          new Date(
            this.currentYear,
            this.currentMonth + 1,
            index
          ).getTime() &&
          event.endDate.getTime() >=
          new Date(this.currentYear, this.currentMonth + 1, index).getTime()
        );
      });

      this.arrTest.push({
        day: index,
        month: this.currentMonth,
        year: this.currentYear,
        events: filterEvents
      });


    }

    for (let i = this.arrTest.length, j = 1; i < 42; i++ , j++) {
      this.arrTest.push({
        day: j,
        month: this.currentMonth + 1,
        year: this.currentYear,
        events: []
      });
    }

    for (let i = 0; i < 6; i++) {
      const arrWeek : any[] = this.arrTest.splice(0, 7);
      this.arrCalendar.push(arrWeek);
    }

  }

  getDaysInMonth(iMonth : number, iYear : number) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  previousMonthButtonClick() {
    if (this.currentMonth === 0) {
      this.currentYear -= 1;
      this.currentMonth = 11;
    } else {
      this.currentMonth -= 1;
    }

    this.actDate = this.creatActMonthYear();

    this.createCalendar();
  }

  nextMonthButtonClick() {
    if (this.currentMonth === 11) {
      this.currentYear += 1;
      this.currentMonth = 0;
    } else {
      this.currentMonth += 1;
    }

    this.actDate = this.creatActMonthYear();

    this.createCalendar();
  }

  // Dialog test
  // TODO: return the selected value
  openDialog(event : any) {
    this.dayEvents.next(event);
  }

  
  onYearChange(event : any) {
    this.currentYear = Number(event.target.value);

    this.actDate = this.creatActMonthYear();

    this.createCalendar();
  }

  onMonthChange(event : any) {
    this.currentMonth = Number(event.target.value);

    this.actDate = this.creatActMonthYear();

    this.createCalendar();
  }

  creatActMonthYear() {
    const actDate = formatDate(
      new Date(this.currentYear, this.currentMonth),
      'yyyy. MMMM',
      'en'
    );

    return actDate;
  }

  addEventClicked() {
console.log('test');
    const testMessage = `${this.currentYear}-${this.currentMonth}-${this.actDay}`;
    this.newEvent.next(testMessage);
  }

}