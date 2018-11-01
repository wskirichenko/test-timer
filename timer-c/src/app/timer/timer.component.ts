import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  constructor() {}
  hoursContainer;
  minutesContainer;
  secondsContainer;
  tickElements;
  seconds;
  zero_time;
  flagStop: string = localStorage.getItem('flagStop');
  flagStart: string = localStorage.getItem('flagStart');
  // last2 = this.last.setUTCHours(-1);
  tickState = true;

  interval = setInterval(() => {
    if (
      localStorage.getItem('flagStop') === '0' &&
      localStorage.getItem('flagStart') === '1'
    ) {
      this.seconds += 1;
      this.updateTime();
      if (this.seconds % 50 === 0) {
        // Каждые 50 секунд сохраняем значение таймера
        this.rememberSeconds();
      }
    }
  }, 1000);

  ngOnInit() {
    this.hoursContainer = document.querySelector('.hours');
    this.minutesContainer = document.querySelector('.minutes');
    this.secondsContainer = document.querySelector('.seconds');
    this.tickElements = Array.from(document.querySelectorAll('.tick'));

    this.seconds = +localStorage.getItem('seconds');
    this.zero_time = new Date(1970, 0, 1);
    this.zero_time.setSeconds(this.seconds);
    this.updateTime();
  }

  rememberSeconds() {
    localStorage.setItem('seconds', this.seconds);
  }

  updateTime() {
    this.zero_time = new Date(1970, 0, 1);

    this.zero_time.setSeconds(this.seconds);
    // console.log('sec = ', this.seconds);
    let nowHours = this.zero_time.getHours().toString();
    let nowMinutes = this.zero_time.getMinutes().toString();
    let nowSeconds = this.zero_time.getSeconds().toString();

    this.updateContainer(this.hoursContainer, nowHours);
    this.updateContainer(this.minutesContainer, nowMinutes);
    this.updateContainer(this.secondsContainer, nowSeconds);
  }

  tick() {
    this.tickElements.forEach(t => t.classList.toggle('tick-hidden'));
  }

  updateContainer(container, newTime) {
    let time = newTime.split('');

    if (time.length === 1) {
      time.unshift('0');
    }

    let first = container.firstElementChild;
    if (first.lastElementChild.textContent !== time[0]) {
      this.updateNumber(first, time[0]);
    }

    let last = container.lastElementChild;
    if (last.lastElementChild.textContent !== time[1]) {
      this.updateNumber(last, time[1]);
    }
  }

  updateNumber(element, number) {
    // element.lastElementChild.textContent = number
    const second = element.lastElementChild.cloneNode(true);
    second.textContent = number;

    element.appendChild(second);
    element.classList.add('move');

    setTimeout(function() {
      element.classList.remove('move');
    }, 990);
    setTimeout(function() {
      element.removeChild(element.firstElementChild);
    }, 990);
  }

  onStart() {
    if (localStorage.getItem('flagStart') === '0') {
      // Если таймер нe включён - включить его
      // Получаю значение таймера из памяти
      this.seconds = +localStorage.getItem('seconds');
      // this.seconds = 0;
      // Включаю таймер
      localStorage.setItem('flagStart', '1');
      localStorage.setItem('flagStop', '0');
    }
  }

  onStop() {
    // Изначально flagStop = 0 (стоп не был нажат)
    if (localStorage.getItem('flagStop') === '0') {
      // Устанавливаю flagStop = 1 (нажат стоп)
      localStorage.setItem('flagStop', '1');
      // Запоминаю значение таймера
      this.rememberSeconds();
      // this.seconds = 0;
      localStorage.setItem('flagStart', '0');
    }
  }
}
