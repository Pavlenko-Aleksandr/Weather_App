class Model {
  constructor() {
    this.cities = JSON.parse(localStorage.getItem('cities')) || [];
  }

  bindCityListChanged(callback) {
    this.onCityListChanged = callback;
  }

  _commit(cities) {
    this.onCityListChanged(cities);
    localStorage.setItem('cities', JSON.stringify(cities));
  }

  addCity(name, icon, temp, speed) {
    const city = {
      id: this.cities.length > 0 ? this.cities[this.cities.length - 1].id + 1 : 1,
      name,
      icon,
      temp,
      speed,
      complete: false,
    }
    this.cities.push(city);
    this._commit(this.cities);
  }

  deleteCity(id) {
    this.cities = this.cities.filter(city => city.id !== id);
    this._commit(this.cities);
  }
}

class View {
  constructor() {
    this.app = document.querySelector('#root');
    this.widgetWeather = document.querySelector('#widgetWeather');
    this.widgetExchangeRate = document.querySelector('#widgetExchangeRate');
    this.form = this.createElement('form');
    this.input = this.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Enter the city...';
    this.input.name = 'city';
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Add';
    this.form.append(this.input, this.submitButton);
    this.title = this.createElement('h1');
    this.title.textContent = 'City weather forecast';
    this.cityList = this.createElement('ul', 'city-list');
    this.app.append(this.title, this.form, this.cityList);
    this._temporaryCityText = '';
    this._initLocalListeners();
  }

  viewWidget(name, icon, temp, speed) {
    this.h2 = this.createElement('h2');
    this.itemIcon = document.createElement ('div');
    this.itemWind = document.createElement ('div');
    this.itemTemp = document.createElement ('div');
    this.h2.textContent = name;
    this.itemIcon.innerHTML = icon;
    this.itemTemp.innerHTML = `Air temperature ${temp}`;
    this.itemWind.innerHTML = `Wind ${speed}m/s`;
    this.widgetWeather.append(
      this.h2,
      this.itemIcon,
      this.itemWind,
      this.itemTemp
    );
  }

  exchangeRate(rate) {
    this.h2 = this.createElement('h2');
    this.h2.innerText = 'Exchange Rate';
    this.exchange = document.createElement ('span');
    this.exchange.innerHTML = rate;
    this.widgetExchangeRate.append(
      this.h2,
      this.exchange
    )
  }

  get _cityText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = '';
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  displayCities = (cities) => {
    while (this.cityList.firstChild) {
      this.cityList.removeChild(this.cityList.firstChild);
    }
    if (cities.length === 0) {
      this.p = this.createElement('p');
      this.p.textContent = 'Nothing has been selected. Enter the city';
      this.cityList.append(this.p);
    } else {
      cities.forEach(city => {
        this.li = this.createElement('li');
        this.li.id = city.id;
        this.span = this.createElement('span');
        this.span.contentEditable = true;
        this.span.classList.add('editable');
        if (cities.length) {
          this.h2 = this.createElement('h2');
          this.itemIcon = document.createElement ('div');
          this.itemWind = document.createElement ('div');
          this.itemTemp = document.createElement ('div');
          this.h2.value = city.name;
          this.itemIcon.value = city.icon;
          this.itemTemp.value = city.temp;
          this.itemWind.value = city.speed;
          this.h2.innerHTML = city.name;
          this.itemIcon.innerHTML = city.icon;
          this.itemTemp.innerHTML = `Air temperature ${city.temp}`;
          this.itemWind.innerHTML = `Wind ${city.speed}m/s`;
          this.span.append(
            this.h2,
            this.itemIcon,
            this.itemWind,
            this.itemTemp
          )
        } else {
          this.span.textContent = city.name;
        }
        this.deleteButton = this.createElement('button', 'delete');
        this.deleteButton.textContent = 'Delete';
        this.li.append(this.span, this.deleteButton);
        this.cityList.append(this.li);
      })
    }
    console.log(cities);
  }

  _initLocalListeners() {
    this.cityList.addEventListener('input', event => {
      if (event.target.className === 'editable') {
        this._temporaryCityText = event.target.innerText;
      }
    })
  }

  bindAddCity(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      if (this._cityText) {
        handler(this._cityText);
        this._resetInput();
      }
    })
  }

  bindDeleteCity(handler) {
    this.cityList.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindCityListChanged(this.onCityListChanged);
    this.view.bindAddCity(this.handleAddCity);
    this.view.bindDeleteCity(this.handleDeleteCity);
    this.onCityListChanged(this.model.cities);
    this.view.submitButton.addEventListener("click", this.handleSubmit);
    this.getWeathetForLocation();
    setInterval(this.getExchangeRate(), 3600000);
  }

  getExchangeRate() {
    const url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
    fetch(url).then(response => {
      if (response.status !== 200) {
        console.error(`Status Code: ${response.status}`);
      }
      return response.json();
    }).then(currObject => {
      const rate = `${currObject[0].ccy}/${currObject[0].base_ccy} : ${currObject[0].buy}</br>
                    ${currObject[0].base_ccy}/${currObject[0].ccy} : ${currObject[0].sale}</br>
                    ${currObject[1].ccy}/${currObject[1].base_ccy} : ${currObject[1].buy}</br>
                    ${currObject[1].base_ccy}/${currObject[1].ccy} : ${currObject[1].sale}</br>
                    ${currObject[2].ccy}/${currObject[2].base_ccy} : ${currObject[2].buy}</br>
                    ${currObject[2].base_ccy}/${currObject[2].ccy} : ${currObject[2].sale} `;
      this.view.exchangeRate(rate);
    });  
  }

  getWeathetForLocation = () => {
    const searchForCurrentLacotion = options => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };
  
    searchForCurrentLacotion()
      .then((position) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=20233a4d650b378125309bd01c2c8c51`;
          fetch(url).then(response => {
            if (response.status !== 200) {
              console.error(`Status Code: ${response.status}`);
            }
            return response.json();
          }).then(data => {
            const name = data.name,
            icon = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`,
            temp = Math.round(data.main.temp) + '&#8451',
            speed = data.wind.speed;
            this.view.viewWidget(name, icon, temp, speed);
          });
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      })
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    const value = this.view.input.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=20233a4d650b378125309bd01c2c8c51`;
    fetch(url).then(response => {
      if (response.status !== 200) {
        console.error(`Status Code: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      const name = data.name,
            icon = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">`,
            temp = Math.round(data.main.temp) + '&#8451',
            speed = data.wind.speed;
              
        this.model.addCity(name, icon, temp, speed);
        this.view.input.value = "";
        this.view.displayCities(this.model.cities);
    })
  }

  onCityListChanged = cities => {
    this.view.displayCities(cities);
  }

  handleAddCity = cityText => {
    this.model.addCity(cityText);
  }

  handleDeleteCity = id => {
    this.model.deleteCity(id);
  }
}

const app = new Controller(new Model(), new View());
