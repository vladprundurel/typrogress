import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/shared/charts.service';
import { UserService } from 'src/app/shared/user.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-dashboard-measurements',
  templateUrl: './custom-dashboard-measurements.component.html',
  styleUrls: ['./custom-dashboard-measurements.component.css']
})
export class CustomDashboardMeasurementsComponent implements OnInit {

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  //Charts data
  chartData = [{ data: [], label: 'Weight(kg)' }];
  proteinChartData = [{ data: [], label: 'Neck(cm)' }];
  carbsChartData = [{ data: [], label: 'Waist(cm)' }];
  fatsChartData = [{ data: [], label: 'Hips(cm)' }];

  chartLabels = [];
  chartOptions = {
    responsive: true
  };
  chartColors = [{ borderColor: '#2E86C1', backgroundColor: '#85C1E9', pointBackgroundColor: '#154360' }];
  proteinsChartColors = [{ borderColor: '#28B463', backgroundColor: '#82E0AA', pointBackgroundColor: '#186A3B' }];
  carbsChartColors = [{ borderColor: '#F1C40F', backgroundColor: '#fbe790', pointBackgroundColor: '#F5B041' }];
  fatsChartColors = [{ borderColor: '#C0392B', backgroundColor: '#EC7063', pointBackgroundColor: '#922B21' }];

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
    //calendar.getNext
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 20);

    var fromDateCustom = this.fromDate.day + "-" + this.fromDate.month + "-" + this.fromDate.year;
    var toDateCustom = this.toDate.day + "-" + this.toDate.month + "-" + this.toDate.year;
    this.chartData["data"] = [];
    this.chartLabels = [];
    this.getMeasurementsData(fromDateCustom, toDateCustom);
    
   }

  ngOnInit(): void {
    // this.getMeasurementsData(this.fromDate, this.toDate);
   }

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
      this.getMeasurementsData(fromDateCustom, toDateCustom);
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

  getMeasurementsData(from_date, to_date) {
    console.log(from_date);
    this.userService.getUserId().subscribe(
      res=> {
        this.chartsService.getMeasurementsData(from_date, to_date, res["user"]._id).subscribe(
          response => { 
            console.log(response);
            this.populateWeightChart(response);
            // this.populateGaugeCharts(response);
          },
          err => {}
        );
      }
    );
    
  }

  populateWeightChart(data) {
    data.forEach(element => {
      this.chartLabels.push(element.date);
      this.chartData[0].data.push(element["weight"]);
      this.proteinChartData[0].data.push(element["neck"]);
      this.carbsChartData[0].data.push(element["waist"]);
      this.fatsChartData[0].data.push(element["hips"]);
    });
  }

  // populateGaugeCharts(data) {
  //   this.percentageCaloriesAcc = Math.ceil(data["percentageCalories"]);
  //   this.percentageProteinsAcc = Math.ceil(data["percentageProteins"]);
  //   this.percentageCarbsAcc= Math.ceil(data["percentageCarbs"]);
  //   this.percentageFatsAcc = Math.ceil(data["percentageFats"]);
  // }

}
