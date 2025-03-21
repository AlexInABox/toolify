import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { RouterModule, Router } from '@angular/router';
import { InputNumber } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  imports: [CommonModule, InputGroupModule, FormsModule, InputGroupAddonModule, SelectModule, PanelModule, TableModule, RouterModule, InputNumber, ButtonModule, ProgressSpinnerModule]
})
export class CurrencyComponent {
  selectedCurrency1: string = 'USD';
  selectedCurrency2: string = 'EUR';
  ammount: number = 1;
  isLoading: boolean = true;

  currencies!: Array<string>;
  tableData!: string[][];

  constructor(private router: Router) {
    this.loadCurrencies();
    this.fetchData();
  }

  async loadCurrencies(){
    this.currencies = ["EUR", "USD", "CHF"];

    let response = await fetch("https://bcnd.toolify.m1productions.de/currencyList");
    if(!response.ok){
      throw new Error('HTTP error! Status: '+response.status);
    }
    this.currencies = await response.json();
  }

  swapSelections(){
    [this.selectedCurrency1, this.selectedCurrency2] = [this.selectedCurrency2, this.selectedCurrency1];
  }

  fillTable(unit: number){
    if(this.ammount == undefined || this.ammount == null){
      this.ammount = 1;
    }

    this.tableData = [
      [this.selectedCurrency1, this.selectedCurrency2],
      [this.ammount.toString(), (unit*this.ammount).toFixed(3).toString()],
    ]

    for(let i=0; i <= 3; i++){
      let mult = Math.pow(10, i);
      this.tableData.push([mult.toString(), (unit*mult).toFixed(3).toString()]);
      if(this.ammount == mult){
        this.tableData.splice(1,1);
      }
    }

    this.isLoading = false;
  }

  async fetchData(){
    this.isLoading = true;

    let response = await fetch("https://bcnd.toolify.m1productions.de/currency?from="+this.selectedCurrency1+"&to="+this.selectedCurrency2+"&amount=1");
    if(!response.ok){
      throw new Error('HTTP error! Status: ${response.status}');
    }

    let data = await response.json();

    this.fillTable(data);
  }
}
