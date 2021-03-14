export class Model {
    constructor(view, viewWidgets) {
      this.view = view;
      this.viewWidgets = viewWidgets;  
    }
  
    loadList ()  {
      this.getCitiesFromDatabaseForRender();
    }
  
    makeWeatherRequest (latitude, longitude) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0cd4dad69776f1d69d19253c4157324e`)
      .then(response => response.json())
      .then(response => {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.viewWidgets.renderGeoWeather(name, temp, clouds, windSpeed);
      })
      .catch(err => {
        this.view.viewWidgets.geoHeader.innerText = `${err.status}`;
        setTimeout(()=>{
          this.view.viewWidgets.geoHeader.innerText ="";
        }, 1000);
      }); 
    }
  
    makeExchangeCourseRequest () {
      fetch(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
      .then(response => response.json())
      .then(response =>{
        const buyUSD = Math.round(parseFloat(response[0].buy)*100) / 100;
        const saleUSD = Math.round(parseFloat(response[0].sale)*100) / 100;
        const buyEUR = Math.round(parseFloat(response[1].buy)*100) / 100;
        const saleEUR = Math.round(parseFloat(response[1].sale)*100) / 100;
        const buyRUR = Math.round(parseFloat(response[2].buy)*100) / 100;
        const saleRUR = Math.round(parseFloat(response[2].sale)*100) / 100;
        this.viewWidgets.renderExchangeCourse(buyUSD, saleUSD, buyEUR, saleEUR, buyRUR, saleRUR);
      })
      .catch(err => {
        this.view.viewWidgets.exchHeader.innerText = `${err.status}`;
        setTimeout(()=>{
          this.view.viewWidgets.exchHeader.innerText ="";
       }, 1000);
      });
    }
  
    getNameOfTheCityToAdd (inputAdd) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputAdd}&appid=0cd4dad69776f1d69d19253c4157324e`)
      .then(response => response.json())
      .then(response => {
        if (response.cod === "404") {
          this.view.input.value = `${response.message}`;
          setTimeout(()=>{
            this.view.input.value ="";
          }, 1000);
        } else {
          const temp = parseInt(response.main.temp - 273.15);
          const clouds = response.weather[0].description;
          const windSpeed = parseInt(response.wind.speed);
          const name = response.name;
          this.addCityToList(name, temp, clouds, windSpeed);
        }
      })
      .catch(err => {
        this.view.input.value = `${err.status}`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 1000);
      });
      this.view.input.value = '';
    }
    
    addCityToList (name, temp, clouds, windSpeed) {
      const obj = {
        name:name,
      };
      fetch(`/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
      })
      .then(response => response.json())
      .then(response => {
        this.view.renderListOfCities(response.name, response._id, temp, clouds, windSpeed);
      })
      .catch(err => {
        this.view.input.value = `${err.status}`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 1000);
      });
      this.view.input.value = '';
    }
  
    deleteCityFromDatabase (cityId) {
      fetch(`/cities/${cityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      })
      .then(response => {
        this.getCitiesFromDatabaseForRender();
      })
      .catch(err => {
        this.view.input.value = `${err.status}`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 1000);
      });    
    }
  
    getCitiesFromDatabaseForRender () {
      fetch(`/cities`)
      .then(response => response.json())
      .then(response => {
        this.prepareForRender(response);
      })
      .catch(err => {
        this.view.input.value = `${err.status}`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 1000);
      });   
    }
  
    prepareForRender = (arrOfCities) => {
      arrOfCities.forEach(item => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${item.name}&appid=0cd4dad69776f1d69d19253c4157324e`)
        .then( response => response.json())
        .then(response => {
          const temp = parseInt(response.main.temp - 273.15);
          const clouds = response.weather[0].description;
          const windSpeed = parseInt(response.wind.speed);
          const name = response.name;
          this.view.renderListOfCities(name, item._id, temp, clouds, windSpeed);
        })
        .catch(err => {
          this.view.input.value = `${err.status}`;
          setTimeout(()=>{
            this.view.input.value ="";
          }, 1000);
        });   
      });
    }
  
    editCityInDatabase = (cityId, name) => {
      const obj = {
        name:name
      };
      fetch(`/cities/${cityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
      })
      .catch(err => {
        this.view.input.value = `${err.status}`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 1000);
      });
      this.view.input.value = '';    
    }
  
    editCityInList = (saveEditions, newCityName) => {
      const newCityLi = saveEditions.closest("li");
      const newCityDiv = newCityLi.firstElementChild;
      const cityId = saveEditions.dataset.id;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${newCityName}&appid=0cd4dad69776f1d69d19253c4157324e`)
      .then(response => response.json())
      .then(response => {
        if (response.cod === "404") {
          this.view.input.value = `${response.message}`;
          setTimeout(()=>{
            this.view.input.value ="";
          }, 1000);
        } else {
        const temp = parseInt(response.main.temp - 273.15);
        const clouds = response.weather[0].description;
        const windSpeed = parseInt(response.wind.speed);
        const name = response.name;
        this.editCityInDatabase(cityId, name);
        this.view.updateCity(newCityDiv, name, temp, clouds, windSpeed);
        }
      })
      .catch(err => {
        this.view.input.value = `${err.status}`;
        setTimeout(()=>{
          this.view.input.value ="";
        }, 1000);
      });
    }
  }