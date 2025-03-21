import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { RouterModule, Router } from '@angular/router';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-root',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  imports: [CommonModule, InputGroupModule, InputGroupAddonModule, SelectModule, PanelModule, TableModule, RouterModule, InputNumber]
})
export class CurrencyComponent {
  currencies!: Array<string>;

  constructor(private router: Router) {
    this.load();
  }

  async load(){
    let response = await fetch("https://bcnd.toolify.m1productions.de/currency?from=USD&to=EUR&amount=15");
    console.log(response);
    this.currencies = ["EUR", "USD"];
  }
}
