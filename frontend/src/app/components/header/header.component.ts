import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Button, ButtonModule } from 'primeng/button'; import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Menubar, CommonModule, RouterModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  isDarkMode: boolean = false;

  constructor() {
    this.applyDarkModePreference();
  }


  async ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: PrimeIcons.HOME,
        route: '/'
      },
      {
        label: 'Calculator',
        icon: PrimeIcons.CALCULATOR,
        items: [
          {
            label: 'Currency Converter',
            icon: PrimeIcons.DOLLAR,
            route: '/currency'
          },
          {
            label: 'Unit Conversion',
            icon: PrimeIcons.SORT_ALT,
            route: '/youtube'
          },
          {
            label: 'Scientific',
            icon: PrimeIcons.MICROCHIP,
            route: '/calculator'
          },
        ]
      },
      {
        label: 'Generators',
        icon: PrimeIcons.SPARKLES,
        items: [
          {
            label: 'Password',
            icon: PrimeIcons.KEY,
            route: '/password'
          },
          {
            label: 'QR Code',
            icon: PrimeIcons.QRCODE,
            route: '/qrcode'
          },
          {
            label: 'GIF',
            icon: PrimeIcons.IMAGES,
            route: '/gif'
          },
        ]
      },
      {
        label: 'Converter',
        icon: PrimeIcons.ARROW_RIGHT_ARROW_LEFT,
        items: [
          {
            label: 'Favicon',
            icon: PrimeIcons.PLAY_CIRCLE,
            route: '/favicon'
          },
          {
            label: 'Compression',
            icon: PrimeIcons.PERCENTAGE,
            route: '/compress'
          },
          {
            label: 'Zip & Unzip',
            icon: PrimeIcons.BOX,
            route: '/package'
          },
        ]
      },
    ];

    this.applyLogoInvert();
  }

  applyDarkModePreference() {
    if (localStorage['theme'] === "dark") {
      const element = document.querySelector('html');
      if (element) {
        element.classList.add('dark');
        this.toggleDarkMode();
      }
    } else {
      localStorage['theme'] = "light";
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');

    if (element) {
      this.isDarkMode = element.classList.toggle('my-app-dark');
    }
  }


  applyLogoInvert() {
    const logoImg = document.getElementById('logo-png');
    if (logoImg instanceof HTMLImageElement) {
      if (document.body.classList.contains('my-app-dark')) {
        logoImg.src = '/assets/logoToolifyLight.png';
      } else {
        logoImg.src = '/assets/logoToolifyDark.png';
      }
    }
  }
}
