export class Controller { 
    constructor(model, view, viewWidgets) {
      this.model = model;
      this.view = view;
      this.viewWidgets = viewWidgets;
      const loadAllContent = this.loadAllContent.bind(this); 
    }
  
    loadAllContent = () => {
      this.getGeolocation();
      this.getExchangeCourse();
      this.model.loadList();
    }
  
    locationNotReceived = () => {
      this.viewWidgets.geoHeader.innerText = "You can't tell your location";
    }
  
    locationReceived = (position) => {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.model.makeWeatherRequest(latitude, longitude);
    }
  
    getGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => this.locationReceived(position), (position)=>this.locationNotReceived(position));
      } else {
        this.viewGeoExchange.geoHeader.innerText = "There is some problems with your browser";
      }
    }
  
    getExchangeCourse = () => {
      this.model.makeExchangeCourseRequest();
      setInterval(()=>this.model.makeExchangeCourseRequest(), 3600000);
    }
    
    addCity = () => {
      const inputAdd = this.view.input.value;
      if (inputAdd !== "") {
      this.model.getNameOfTheCityToAdd(inputAdd);
      }
    }
  
    showEdit = (buttonEdit) => {
      const wrapperForshow = buttonEdit.nextElementSibling;
      wrapperForshow.classList.toggle("show");
    }
  
    editCity = (saveEditions) => {
      const inputForSaveEdit = saveEditions.previousElementSibling;
      let newCityName = inputForSaveEdit.value;
      const wrapper = saveEditions.parentElement;
      if (newCityName == "") {
        wrapper.classList.toggle("show");
      } else {
        this.model.editCityInList(saveEditions, newCityName);
        wrapper.classList.toggle("show");
      }
    }
  
    deleteCity = (buttonDelete) => {
      const cityId = buttonDelete.dataset.id;
      this.view.listOfCities.innerHTML = "";
      this.model.deleteCityFromDatabase(cityId);
    }
  
    addHandle = () => {
      document.addEventListener("DOMContentLoaded", () => this.loadAllContent());
      this.view.addCityButton.addEventListener("click", () => this.addCity());
      this.view.listOfCities.addEventListener("click", (ev) => {
        const targetButtonEdit = ev.target;
        const actionEdit = ev.target.dataset.action;
        if (actionEdit === "edit") {
          this.showEdit(targetButtonEdit);
        }  
      });
      this.view.listOfCities.addEventListener("click", (ev) => {
        const targetButtonDel = ev.target;
        const actionDel = ev.target.dataset.action;
        if (actionDel === "delete") {
          this.deleteCity(targetButtonDel);
        }  
      });
      this.view.listOfCities.addEventListener("click", (ev) => {
        const saveEditButton = ev.target;
        const actionSave = ev.target.dataset.action;
        if (actionSave === "saveedit") {
          this.editCity(saveEditButton);
        }
      });
    }
  }