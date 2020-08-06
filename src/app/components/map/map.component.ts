import { Component, OnInit } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Style,
  Stroke,
  Fill,
  Circle as CircleStyle,
  Text,
  RegularShape,
} from 'ol/style';
import Group from 'ol/layer/Group';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { BingMaps, Cluster } from 'ol/source';
import { transform } from 'ol/proj';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Vector } from 'ol/source';
import { Vector as LayerVector } from 'ol/layer';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import Select from 'ol/interaction/Select';
import { singleClick } from 'ol/events/condition';
import { Attribution, ScaleLine } from 'ol/control';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate';
import Popup from 'ol/Overlay';


const features = [];


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  bingMapApiKey =
    'ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp';
  baseLayer = [];
  overlays = [];
  map = null;
  markerSource = new Vector();
  marker = new Feature();
  
  //vectorSourceGEOJson;
  //styleCache = {};
  // clusterSource;
  vector;
  
  //Inital View
  initView = new View({
    center: fromLonLat([13.06072, 47.78869]),
    zoom: 12,
  });

  markerStyle = new Style({
    image: new Icon({
      scale: 0.1,
      src: '../assets/images/marker.png',
    }),
  });

  wfsStyle = new Style({
    image: new Icon({
      scale: 0.1,
      src: '../assets/images/marker.png',
    }),
  });

  private drawMarker(posMarker) {
    let marker = new Feature({
      geometry: new Point(posMarker),
    });
 

    console.log('draw marker at ' + posMarker);
    marker.setStyle(this.markerStyle);
    this.markerSource.addFeature(marker);
  }

  select = new Select({
    condition: singleClick,
    layers: this.overlays,
    style: (feature) => {
      return this.selectedStyle(feature);
    },
  });

  selectedStyle = function (feature) {
    let style;
    let name = feature.getProperties().name;

    style = new Style({
      text: new Text({
        text: name,
        scale: 2,
      }),
      stroke: new Stroke({
        color: '#eb4034',
        width: 1,
      }),
      fill: new Fill({
        color: '#96312a',
      }),
    });
    return style;
  };

  vectorSourceGEOJson = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      // URL used on server
      /*let url =   '../geoserver/cite/ows?service=WFS&' +
              'version=1.0.0&request=GetFeature&typeName=cite:salzburg_info_api&' +
            'maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857&'
      // URL used for local testing pls comment out befor pushing or deployment*/
      let url ='http://human.zgis.at/geoserver/music_map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=music_map:salzburg_info_api&outputFormat=application%2Fjson';
      //local testing url
      /* let url = 'http://localhost:8080/geoserver/musicmap/ows?service=WFS&' +
        'version=1.0.0&request=GetFeature&typeName=musicmap%3Asalzburg_info_api&' +
        'maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857&';*/

      return url;
    },
  });

  clusterSource = new Cluster({
    distance: 40,
    source: this.vectorSourceGEOJson,
    // geometryFunction: function (feature) {
    //   var geom = feature.getGeometry();
    //   return geom.getType() == 'Point' ? geom : null;
    // }
  });

  constructor() {}

  ngOnInit() {
    this.initializeData();
    console.log('start init');
    this.initalizeMap();
    //this.createOverlays;
    //this.drawMarker(this.nawiPosition);
  }

  private initializeData() {
    this.vector = new VectorLayer({
      visible: true,
      source: this.clusterSource,
      style: this.wfsStyle,
      zIndex: 1,
    });
  }

    
  public initalizeMap() {
    console.log('start init map');
    this.markerSource.addFeature(this.marker);
    var markername = this.markerSource.get('name');
    /**
     * Elements that make up the popup.
     */
    
    var container = document.getElementById('popup');
    var contentElement = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    /**
     * Create an overlay to anchor the popup to the map.
     */
    var popupOverlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    closer.onclick = function () {
      popupOverlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    this.map = new Map({
      target: 'map',
      layers: [
        // new Tile({
        //   source: new OSM()
        // }),
        // this.vector
        new Group({
          layers: [
            new Tile({
              source: new OSM({
                crossOrigin: 'anonymus',
              }),
            }),
          ],
          //this.createBaselayerGroup()
        }),
        this.vector,
        // new Group({
        //   layers:  this.vector
        // })
      ],
      overlays: [popupOverlay],
      controls: [new Attribution(), new ScaleLine({})],
      view: this.initView,
    });

    /**
     * Add a click handler to the map to render the popup.
     */
    this.map.on('click',  (evt) => {
      // Check if its a feature (marker) and display popup if true
      var feature = this.map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });  
        if (feature) {
          var geometry = feature.getGeometry();
          var coord = geometry.getCoordinates();
          
          var content = '<h3>' + markername + '</h3>';
          content += '<h5>' + feature.get('name'); + '</h5>';
          
          contentElement.innerHTML = content;
          popupOverlay.setPosition(coord);
          
          console.info(feature.getProperties());
      }  
      
      /**
       * var coordinate = evt.coordinate;
      var hdms = toStringHDMS(toLonLat(coordinate));
      content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
      '</code>';
      popupOverlay.setPosition(coordinate);
       * 
       */
      
      
      
    });

    this.map.addInteraction(this.select);
  }

  private createBaselayerGroup() {
    let bingStyles = ['Road', 'Arial', 'ArialWithLabels'];
    let bingLabelNames = ['Bing Road', 'Bing Areal', 'Bing Arial with Label'];

    bingStyles.forEach(function (style, i) {
      this.baseLayer.push(
        new Tile({
          visible: true,
          preload: Infinity,
          source: new BingMaps({
            key: this.bingMapApiKey,
            imagerySet: bingStyles[i],
          }),
        })
      );
    });
    return this.baseLayer;
  }

  createOverlays() {
    // overlays.push(
    //   new LayerVector({
    //     visible: true,
    //     source: this.markerSource,
    //     zIndex:1
    //   })
    // )

    //   overlays.push(
    //     new VectorLayer({
    //       visible:true,
    //       source: this.vectorSourceLokalGeoJson,
    //       style: this.markerStyle,
    //       zIndex: 1
    //     })
    //   )

    this.overlays.push(
      new VectorLayer({
        visible: true,
        source: this.clusterSource,
        style: this.wfsStyle,
        zIndex: 1,
      })
    );
    return this.overlays;
  }
}
