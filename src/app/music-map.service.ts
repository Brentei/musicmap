import { Injectable } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Geolocation from 'ol/Geolocation';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from 'ol/format/GeoJSON';
import {Style} from "ol/style";
import {Stroke} from "ol/style";
import Group from "ol/layer/Group";
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import {BingMaps} from "ol/source";
import {transform} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import {Vector} from "ol/source";
import {Vector as LayerVector } from "ol/layer";
import {Feature} from "ol";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";

@Injectable({
  providedIn: 'root'
})
export class MusicMapService {

  constructor() { }
}
