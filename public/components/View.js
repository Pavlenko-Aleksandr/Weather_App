export class View {
    constructor() {
      this.mainBlock = document.querySelector("#root");
      this.input = document.createElement("input");
      this.input.classList.add("inputEnterCity");
      this.input.placeholder = "Enter the city";
      this.addCityButton = document.createElement("button");
      this.addCityButton.innerHTML = "Add";
      this.addCityButton.classList.add("addCityBtn");
      this.listOfCities = document.createElement("ul");
      this.listOfCities.classList.add("listCities");
    }
    
    initReneder = () => {
      this.mainBlock.append(this.input, this.addCityButton, this.listOfCities);
    }
     
    renderListOfCities = (nameOfCity, id, temp, clouds, windSpeed) => {
      const item = document.createElement("li");
      item.classList.add("listCitiesItem");
      const text = document.createElement("div");
      text.classList.add("divForCitiesInList");
      text.innerHTML = `${nameOfCity} <br>
      ${temp}&#8451, ${clouds}, wind:${windSpeed}m/s`;
      const delCityButton = document.createElement("button");
      delCityButton.classList.add ("listBtnDelete");
      delCityButton.innerHTML = "Delete";
      delCityButton.setAttribute("data-action", "delete");
      delCityButton.setAttribute("data-id", id);
      const editCityButton = document.createElement("button");
      editCityButton.innerHTML = "Edit";
      editCityButton.classList.add("listBtnEdit");
      editCityButton.setAttribute("data-action", "edit");
      editCityButton.setAttribute("data-id", id);
      const wrapperForEdit = document.createElement("div");
      wrapperForEdit.classList.add('hide');
      const inputForEdit = document.createElement("input");
      inputForEdit.value = nameOfCity;
      inputForEdit.classList.add("inputEditCity");
      const saveEditions = document.createElement("button");
      saveEditions.classList.add("listBtnSave");
      saveEditions.innerHTML = "Save";
      saveEditions.setAttribute("data-action", "saveedit" );
      saveEditions.setAttribute("data-id", id); 
      wrapperForEdit.append(inputForEdit, saveEditions);
      item.append(text, editCityButton, wrapperForEdit, delCityButton);
      this.listOfCities.append(item);  
    }
    updateCity(newCityDiv, name, temp, clouds, windSpeed) {
      newCityDiv.innerHTML = `${name} <br>                    
      ${temp}&#8451, Clouds:${clouds}, Wind:${windSpeed}m/s`; 
    }
  }