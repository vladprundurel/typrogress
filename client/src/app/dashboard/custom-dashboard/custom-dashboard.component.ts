import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/shared/charts.service';
import { UserService } from 'src/app/shared/user.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-dashboard',
  templateUrl: './custom-dashboard.component.html',
  styleUrls: ['./custom-dashboard.component.css']
})
export class CustomDashboardComponent implements OnInit {

  //datepicker
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  //Charts data
  chartData = [{ data: [], label: 'Calories' }];
  proteinChartData = [{ data: [], label: 'Proteins' }];
  carbsChartData = [{ data: [], label: 'Carbohydrates' }];
  fatsChartData = [{ data: [], label: 'Fats' }];

  chartLabels = [];
  chartOptions = {
    responsive: true
  };
  chartColors = [{ borderColor: '#28a745', backgroundColor: '#c3e6cb', pointBackgroundColor: '#28a745' }];
  proteinsChartColors = [{ borderColor: '#431432', backgroundColor: '#c3e6cb', pointBackgroundColor: '#28a745' }];
  carbsChartColors = [{ borderColor: '#28a745', backgroundColor: '#c3e6cb', pointBackgroundColor: '#28a745' }];
  fatsChartColors = [{ borderColor: '#28a745', backgroundColor: '#003242', pointBackgroundColor: '#28a745' }];

  chartLegend = false;
  chartPlugins = [];

  fromDateCustom;
  toDateCustom;
  

  constructor(public chartsService: ChartsService, private userService: UserService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
   }

  ngOnInit(): void { }

  //datepicker
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      var fromDateCustom = this.fromDate.day + "-" + this.fromDate.month + "-" + this.fromDate.year;
      var toDateCustom = this.toDate.day + "-" + this.toDate.month + "-" + this.toDate.year;
      this.chartData["data"] = [];
      this.chartLabels = [];
      this.getCaloriesByDate(fromDateCustom, toDateCustom);
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getCaloriesByDate(from_date, to_date) {
    this.userService.getUserId().subscribe(
      res=> {
        this.chartsService.getCaloriesByDate(from_date, to_date, res["user"]._id).subscribe(
          response => { 
            // console.log("response");
            // console.log(response);
            this.populateChartData(response);
          },
          err => {}
        );
      }
    );
    
  }

  populateChartData(data) {
    // console.log(data);
    data.forEach(element => {
      console.log(element);
      this.chartLabels.push(element.date);
      this.chartData[0].data.push(element["total-calories"]);
      this.proteinChartData[0].data.push(element["total-proteins"]);
      this.fatsChartData[0].data.push(element["total-fats"]);
    });
  }

}
