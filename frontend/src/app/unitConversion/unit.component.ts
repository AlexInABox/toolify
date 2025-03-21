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
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
  imports: [CommonModule, InputGroupModule, FormsModule, InputGroupAddonModule, SelectModule, PanelModule, TableModule, RouterModule, InputNumber, ButtonModule, ProgressSpinnerModule]
})
export class UnitComponent {
  selectedUnit1: string = 'm';
  selectedUnit2: string = 'mm';
  ammount: number = 1;
  category: string = 'length';

  categories!: string[];
  lengthUnits!: string[];
  lengthConversionToMeters!: number[];
  volumeUnits!: string[];
  volumeConversionToLiters!: number[];
  tableData!: string[][];

  constructor(private router: Router) {
    this.generateUnits();
    this.calculate();
  }

  generateUnits(){
    this.categories = ['length', 'volume'];
    this.lengthUnits = ['m', 'cm', 'mm'];
    this.lengthConversionToMeters = [1, 100, 1000];

    this.volumeUnits = ['dm2', 'l'];
    this.volumeConversionToLiters = [1, 1];
  }

  swapSelections(){
    [this.selectedUnit1, this.selectedUnit2] = [this.selectedUnit2, this.selectedUnit1];
  }

  fillTable(unit: number){
    if(this.ammount == undefined || this.ammount == null){
      this.ammount = 1;
    }

    this.tableData = [
      [this.selectedUnit1, this.selectedUnit2],
      [this.ammount.toString(), (unit*this.ammount).toFixed(3).toString()],
    ]

    for(let i=0; i <= 3; i++){
      let mult = Math.pow(10, i);
      this.tableData.push([mult.toString(), (unit*mult).toFixed(3).toString()]);
      if(this.ammount == mult){
        this.tableData.splice(1,1);
      }
    }
  }

  async calculate(){
    let response = await fetch("https://bcnd.toolify.m1productions.de/currency?from="+this.selectedUnit1+"&to="+this.selectedUnit2+"&amount=1");
    if(!response.ok){
      throw new Error('HTTP error! Status: ${response.status}');
    }

    let data = await response.json();

    this.fillTable(data);
  }
}
