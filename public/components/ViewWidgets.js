export class ViewWidgets {
    constructor() {
      this.mainBlock = document.querySelector("#root");
      this.wrapperForGeoExchange = document.createElement("div");
      this.wrapperForGeoExchange.classList.add("wrapperForGeoExchange"); 
      this.wrapperForGeo = document.createElement("div");
      this.wrapperForGeo.classList.add("wrapperForGeo");
      this.geoHeader = document.createElement("h3");
      this.geoHeader.classList.add("geoHeader");
      this.geoHeader.innerText = "Your city";
      this.geoContentOne = document.createElement("div");
      this.geoContentOne.classList.add("geoContentOne");
      this.geoContentTwo = document.createElement("div");
      this.geoContentTwo.classList.add("geoContentTwo");
      this.wrapperForExchange = document.createElement("div");
      this.wrapperForExchange.classList.add("wrapperForExchange");
      this.exchHeader = document.createElement("h3");
      this.exchHeader.classList.add("exchHeader");
      this.exchHeader.innerText = "Exchange Course ";
      this.exchangeContentUSD = document.createElement("div");
      this.exchangeContentUSD.classList.add("exchangeContentUSD");
      this.exchangeContentEUR = document.createElement("div");
      this.exchangeContentEUR.classList.add("exchangeContentEUR");
      this.exchangeContentRUR = document.createElement("div");
      this.exchangeContentRUR.classList.add("exchangeContentRUR");
    }
  
    initRenederGeoExchange = () => {
      this.wrapperForExchange.append(this.exchHeader, this.exchangeContentUSD, this.exchangeContentEUR, this.exchangeContentRUR);
      this.wrapperForGeo.append(this.geoHeader, this.geoContentOne, this.geoContentTwo);
      this.wrapperForGeoExchange.append(this.wrapperForGeo, this.wrapperForExchange);
      this.mainBlock.append(this.wrapperForGeoExchange);
    }
  
    renderGeoWeather = (name, temp, clouds, windSpeed) => {
      this.geoContentOne.innerHTML = name;
      this.geoContentTwo.innerHTML = `${temp}&#8451, ${clouds}, wind:${windSpeed}m/s`;
    }
  
    renderExchangeCourse = (buyUSD, saleUSD, buyEUR, saleEUR, buyRUR, saleRUR) => {
      this.exchangeContentUSD.innerHTML = `USD: ${buyUSD}/${saleUSD}`; 
      this.exchangeContentEUR.innerHTML = `EUR: ${buyEUR}/${saleEUR}`;
      this.exchangeContentRUR.innerHTML = `RUR: ${buyRUR}/${saleRUR}`;
    }
  }