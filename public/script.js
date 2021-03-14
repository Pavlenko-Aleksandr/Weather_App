import {View} from './components/View.js';
import {ViewWidgets} from './components/ViewWidgets.js';
import {Model} from './components/Model.js';
import {Controller} from './components/Controller.js';

const view = new View();
const viewWidgets = new ViewWidgets();
const model = new Model(view, viewWidgets);
const controller = new Controller(model, view, viewWidgets);

viewWidgets.initRenederGeoExchange();
view.initReneder();
controller.addHandle();