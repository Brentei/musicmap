import { Component, OnInit } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map = null;

  constructor() {}

  ngOnInit() {
    this.initalizeMap();
  }

  initalizeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          visible: true,
          preload: Infinity,
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([13.06072, 47.78869]),
        zoom: 8
      })
    });
  }
}
