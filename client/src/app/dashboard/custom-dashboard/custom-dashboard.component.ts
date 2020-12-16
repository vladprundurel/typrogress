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
  proteinsChartColors = [{ borderColor: '#C0392B', backgroundColor: '#EC7063', pointBackgroundColor: '#A93226' }];
  carbsChartColors = [{ borderColor: '#F4D03F', backgroundColor: '#F9E79F', pointBackgroundColor: '#F1C40F' }];
  fatsChartColors = [{ borderColor: '#2E86C1', backgroundColor: '#85C1E9', pointBackgroundColor: '#1F618D' }];

  chartLegend = false;
  chartPlugins = [];

  fromDateCustom;
  toDateCustom;

  //gauge chart data
  public canvasWidth = 230
  public centralLabel = ''
  public proteinName = 'Proteins indicator'
  public carbsName = 'Carbs indicator'
  public fatsName = 'Fats indicator'
  public caloriesName = 'Calories indicator'
  public optionsProtein = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgba(44, 151, 222, 0.8)', 'rgba(44, 151, 222, 0.9)', 'rgb(44, 195, 132)', 'rgb(30, 178, 116)'],
    arcDelimiters: [50, 70, 85],
    rangeLabel: ['0%', '100%'],
    needleStartValue: 50,
}

public optionsCarbs = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: ['rgba(44, 151, 222, 0.8)', 'rgba(44, 151, 222, 0.9)', 'rgb(44, 195, 132)', 'rgb(30, 178, 116)'],
  arcDelimiters: [50, 70, 85],
  rangeLabel: ['0%', '100%'],
  needleStartValue: 50,
}

public optionsFats = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: ['rgba(44, 151, 222, 0.8)', 'rgba(44, 151, 222, 0.9)', 'rgb(44, 195, 132)', 'rgb(30, 178, 116)'],
  arcDelimiters: [50, 70, 85],
  rangeLabel: ['0%', '100%'],
  needleStartValue: 50,
}

public optionsCalories = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: ['rgba(44, 151, 222, 0.8)', 'rgba(44, 151, 222, 0.9)', 'rgb(44, 195, 132)', 'rgb(30, 178, 116)'],
  arcDelimiters: [50, 70, 85],
  rangeLabel: ['0%', '100%'],
  needleStartValue: 50,
}

public percentageCaloriesAcc = 0;
public percentageProteinsAcc = 0;
public percentageCarbsAcc = 0;
public percentageFatsAcc = 0;

  constructor(public chartsService: ChartsService, private userService: UserService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.toDate = calendar.getToday();
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 10);

    var fromDateCustom = this.fromDate.day + "-" + this.fromDate.month + "-" + this.fromDate.year;
    var toDateCustom = this.toDate.day + "-" + this.toDate.month + "-" + this.toDate.year;
    this.chartData["data"] = [];
    this.chartLabels = [];
    this.getCaloriesByDate(fromDateCustom, toDateCustom);
    
   }

  ngOnInit(): void {
    this.getCaloriesByDate(this.fromDate, this.toDate);
   }

  //datepicker
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      var fromDateCustom = this.fromDate.day + "-" + this.fromDate.month + "-" + this.fromDate.year;
      var toDateCustom = this.toDate.day + "-" + this.toDate.month + "-" + this.toDate.year;
      // this.chartData["data"] = [];
      this.chartData[0].data = [];
      this.proteinChartData[0].data = [];
      this.carbsChartData[0].data = [];
      this.fatsChartData[0].data = [];
      this.chartLabels = [];
      console.log(this.chartData[0].data);
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
            this.populateChartData(response["caloriesByDate"]);
            // this.populateGaugeCharts(response["percentageProteins"]);
            this.populateGaugeCharts(response);
          },
          err => {}
        );
      }
    );
    
  }

  populateChartData(data) {
    // console.log(data)
    // while(this.chartData["data"].length > 0) {
    //   console.log(this.chartData["data"]);
    //   this.chartData["data"].pop();
    // }
    // this.chartData["data"] = [];
    // console.log(data);
    data.forEach(element => {
      // console.log(element);
      // console.log(element);
      this.chartLabels.push(element.date);
      this.chartData[0].data.push(element["total-calories"]);
      this.proteinChartData[0].data.push(element["total-proteins"]);
      this.carbsChartData[0].data.push(element["total-carbs"]);
      this.fatsChartData[0].data.push(element["total-fats"]);
    });
  }

  populateGaugeCharts(data) {
    // this.optionsProtein.arcDelimiters.pop();
    this.percentageCaloriesAcc = Math.ceil(data["percentageCalories"]);
    this.percentageProteinsAcc = Math.ceil(data["percentageProteins"]);
    this.percentageCarbsAcc= Math.ceil(data["percentageCarbs"]);
    this.percentageFatsAcc = Math.ceil(data["percentageFats"]);
    // this.proteinName += " (" + this.percentageProteinsAcc + "%)";
    // this.optionsProtein.arcDelimiters.push(Math.floor(this.percentageProteinsAcc));
    // console.log(this.optionsProtein);
  }

}
