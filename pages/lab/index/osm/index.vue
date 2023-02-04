<template>
  <app-layout>
    <v-row no-gutters>
      <v-col cols="6">
        <l-map
          v-model:tileLayer="osm.tileLayer"
          v-model:zoom="osm.zoom"
          v-model:center="osm.center"
          v-model:bounds="osm.bounds"
          @map:any="osm.onMapEvent($event)"
          style="height:500px;"
        ></l-map>
        <v-select v-model="osm.tileLayer" :items="tileLayers" item-title="title" item-value="value" />
      </v-col>

      <v-col cols="6">
        <threejs-scene v-model="scene" style="height:500px;" />
      </v-col>
    </v-row>

    <pre>zoom: {{ osm.zoom }}</pre>
    <pre>osm.center: {{ osm.center }}</pre>
    <pre>osm.bounds: {{ osm.bounds }}</pre>
    <!-- <pre>xy: {{ osm.xy }}</pre> -->
    <!-- <pre>osmBuildings: {{ osm.osmBuildings }}</pre> -->
    <!-- <pre>osm.osmData.elements: {{ osm.osmData.elements }}</pre> -->
    <!-- <v-img :src="osm.xyUrl" height="300" /> -->
    <!-- <pre>{{ $data }}</pre> -->
  </app-layout>
</template>

<script>
  import axios from 'axios';

  export default {
    meta: {
      active: false,
      icon: 'mdi-map',
      name: 'OSM',
      description: 'Open Street Map',
    },

    data() {
      return {
        osm: new Osm(),
        scene: new Scene(),

        // https://leaflet-extras.github.io/leaflet-providers/preview/
        tileLayers: [
          {
            title: 'Default',
            value: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          },
          {
            title: 'OSM Humanitarian',
            value: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          },
          {
            title: 'World Imagery',
            value: 'http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          },
          {
            title: 'World Topo Map',
            value: 'http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          },
          {
            title: 'Dark Matter',
            value: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          },
          {
            title: 'Toner',
            value: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png',
          },
          {
            title: 'Watercolor',
            value: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png',
          },
          {
            title: 'aaa',
            value: 'https://tile.mapzen.com/mapzen/terrain/v1/normal/{z}/{x}/{y}.png',
          },
        ],
      };
    },
  };

  class Osm {
    constructor() {
      this.tileLayer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      this.zoom = 18;
      this.center = [-19.920421630138943, -43.936042785661876];
      this.bounds = [0, 0, 0, 0];
      this.xy = [0, 0];
      this.xyUrl = 'https://tile.openstreetmap.org/18/99080/145879.png';
      this.osmBuildings = {};
      this.coords = { lat: 0, lng: 0 };
      this.osmUrl = false;
      this.osmData = {elements:[]};
      this._t = {};
    }

    onMapEvent(ev) {
      this.osmUrl = ev.osmUrl;
      this.bounds = ev.bounds;
      this.xy = ev.xy;
      this.xyUrl = `https://tile.openstreetmap.org/${this.zoom}/${this.xy.y}/${this.xy.x}.png`;
      this.debounce(1000, async () => {
        
        if (this.zoom>=15 && this.zoom<=16) {
          // https://c.data.osmbuildings.org/0.2/dixw8kmb/tile/15/17605/10745.json
          const { data: osmBuildings } = await axios.get(`https://c.data.osmbuildings.org/0.2/dixw8kmb/tile/${this.zoom}/${this.xy.y}/${this.xy.x}.json`);
          this.osmBuildings = osmBuildings;
        }

        if (this.zoom==18) {
          const { data } = await axios.get(this.osmUrl);
          this.osmData = data;
        }
      });
    }

    debounce(wait, func) {
      const k = btoa(func.toString());
      if (this._t[k]) clearTimeout(this._t[k]);
      this._t[k] = setTimeout(func, wait);
    }
  };

  class Scene {
    constructor() {
      this.options = {
        gridHelper: true,
        orbitControls: true,
      };
    }
  };
</script>