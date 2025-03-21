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

@Component({
  selector: 'app-root',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  imports: [CommonModule, InputGroupModule, FormsModule, InputGroupAddonModule, SelectModule, PanelModule, TableModule, RouterModule, InputNumber, ButtonModule]
})
export class CurrencyComponent {
  selectedCurrency1: string = 'USD'
  selectedCurrency2: string = 'EUR'
  ammount: number = 1;

  currencies!: Array<string>;

  constructor(private router: Router) {
    this.loadCurrencies();
    this.fetchData();
  }

  loadCurrencies(){
    this.currencies = ["EUR", "USD", "CHF"];
  }

  swapSelections(){
    [this.selectedCurrency1, this.selectedCurrency2] = [this.selectedCurrency2, this.selectedCurrency1];
  }

  async fetchData(){
    let response = await fetch("https://bcnd.toolify.m1productions.de/currency?from=USD&to=EUR&amount=15");
    console.log(response);
  }
}
