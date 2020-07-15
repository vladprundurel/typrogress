import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Tabulator from 'tabulator-tables';

var Tabulator = require("tabulator-tables");

/**
 * This is a wrapper class for the tabulator JS library.
 * For more info see http://tabulator.info
 */
@Component({
  selector: 'app-tabulator-table',
  templateUrl: './tabulator-tables.component.html',
  styleUrls: ['./tabulator-tables.component.scss']
})
export class TabulatorTableComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '800px';
  // list properties you want to set per implementation here...

  tab = document.createElement('div');

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawTable();
  }

  private drawTable(): void {
    new Tabulator(this.tab, {
      data: this.tableData,
      reactiveData:true, //enable data reactivity
      columns: this.columnNames,
      layout: 'fitColumns',
      height: this.height,
      pagination:"local", //enable local pagination.
      paginationSize: 13
    });
    document.getElementById('my-tabular-table').appendChild(this.tab);
  }
}