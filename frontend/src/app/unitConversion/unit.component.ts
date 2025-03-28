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
  selectedUnit1!: any;
  selectedUnit2!: any;
  ammount!: number;
  category!: string;

  currentUnits!: Array<any>;
  tableData!: string[][];

  categories!: string[];
  lengthUnits!: Array<any>;
  volumeUnits!: Array<any>;
  
  constructor(private router: Router) {
    this.generateUnits();
  }

  generateUnits(){
    this.categories = ['length', 'volume'];
    this.lengthUnits = [{name: 'm',value: 1}, {name: 'cm',value: 100}, {name: 'mm',value: 1000}, {name: 'in',value: 0.0254}];
    this.volumeUnits = [{name: 'l',value: 1}, {name: 'dm2',value: 1}, {name: 'imp gal',value: 4.54609}];
    this.currentUnits = this.lengthUnits;

    this.changeCategory();
  }

  swapSelections(){
    [this.selectedUnit1, this.selectedUnit2] = [this.selectedUnit2, this.selectedUnit1];
  }

  fillTable(unit: number){
    if(this.ammount == undefined || this.ammount == null){
      this.ammount = 1;
    }

    this.tableData = [
      [this.selectedUnit1.name, this.selectedUnit2.name],
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

  changeCategory(){
    switch(this.category){
      case "length": this.currentUnits = this.lengthUnits; break;
      case "volume": this.currentUnits = this.volumeUnits; break;
    }

    this.selectedUnit1 = this.currentUnits[0];
    this.selectedUnit2 = this.currentUnits[1];

    this.calculate();
  }

  calculate(){
    console.log(this.selectedUnit1);
    console.log(this.selectedUnit2);
    let data = 1;
    for(let i=0; i<this.currentUnits.length; i++){
      if(this.currentUnits[i].name == this.selectedUnit1 || this.currentUnits[i].name == this.selectedUnit1.name){
        data *= this.currentUnits[i].value;
      }
      else if(this.currentUnits[i].name == this.selectedUnit2 || this.currentUnits[i].name == this.selectedUnit2.name){
        data /= this.currentUnits[i].value;
      }
    }

    this.fillTable(data);
  }
}
