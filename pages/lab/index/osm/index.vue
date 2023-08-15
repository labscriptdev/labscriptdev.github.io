<template>
  <app-layout>
    <v-row no-gutters>
      <v-col cols="6">
        <l-map
          ref="mapRef"
          v-model:zoom="map.zoom"
          :center="map.center"
          style="height:400px;"
          :useGlobalLeaflet="false"
        >
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
          <l-marker :latLng="{ lat: map.center[0], lng: map.center[1] }" />
        </l-map>
      </v-col>

      <v-col cols="6">
        {{ `https://c.tile.openstreetmap.org/${map.zoom}/${map.xy[0]}/${map.xy[1]}.png` }} <br>
        <a :href="map.osmURL" target="_blank">{{ map.osmURL }}</a><br>
        <img :src="`https://c.tile.openstreetmap.org/${map.zoom}/${map.xy[0]}/${map.xy[1]}.png`" alt="">
      </v-col>
    </v-row>

    <pre>char: {{ char }}</pre>
    <pre>map: {{ map }}</pre>
    <pre>map2: {{ map2 }}</pre>
  </app-layout>
</template>

<script setup>
  import { reactive, ref, computed, onMounted } from 'vue';

  import 'leaflet/dist/leaflet.css';
  import { LMap, LTileLayer, LMarker, LIcon } from '@vue-leaflet/vue-leaflet';

  import hotkeys from 'hotkeys-js';

  hotkeys('w, up', (ev) => {
    char.coords[0] += char.speed;
    map.update();
  });
  
  hotkeys('s, down', (ev) => {
    char.coords[0] -= char.speed;
    map.update();
  });

  hotkeys('a, left', (ev) => {
    char.coords[1] -= char.speed;
    map.update();
  });

  hotkeys('d, right', (ev) => {
    char.coords[1] += char.speed;
    map.update();
  });
  
  hotkeys('f+a+l+a', (ev) => {
    console.clear();
    console.log('fala');
  });

  const char = reactive({
    speed: .00001,
    coords: [ 0, 0 ],
  });

  const mapRef = ref(null);
  const map = reactive({
    zoom: 18,
    center: [ 0, 0 ],
    xy: [ 0, 0 ],
    bboxArr: [ 0, 0, 0, 0 ],
    bboxObj: { _southWest: { lat:0, lng:0 }, _northEast: { lat:0, lng:0 } },
    osmURL: '',
    update() {
      const lat = char.coords[0];
      const lng = char.coords[1];

      map.center[0] = char.coords[0];
      map.center[1] = char.coords[1];

      (() => {
        const R = 6378137,
          sphericalScale = 0.5 / (Math.PI * R),
          d = Math.PI / 180,
          max = 1 - 1E-15,
          sin = Math.max(Math.min(Math.sin(lat * d), max), -max),
          scale = 256 * Math.pow(2, map.zoom);
  
        map.xy[0] = R * lng * d;
        map.xy[0] = scale * (sphericalScale * map.xy[0] + 0.5);
        map.xy[0] = Math.floor(map.xy[0] / 256);
  
        map.xy[1] = R * Math.log((1 + sin) / (1 - sin)) / 2;
        map.xy[1] = scale * (-sphericalScale * map.xy[1] + 0.5);
        map.xy[1] = Math.floor(map.xy[1] / 256);
      })();

      if (mapRef.value && mapRef.value.leafletObject) {
        const bbox = mapRef.value.leafletObject.getBounds();
        map.bboxObj = bbox;
        map.bboxArr = [ bbox._southWest.lat, bbox._southWest.lng, bbox._northEast.lat, bbox._northEast.lng ];
        map.osmURL = `https://overpass-api.de/api/interpreter?data=[out:json];node(${map.bboxArr.join(',')});out;`;

        mapRef.value.leafletObject.panTo(map.center);
      }
    },
  });

  onMounted(() => {
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        char.coords[0] = geo.coords.latitude;
        char.coords[1] = geo.coords.longitude;
        map.update();
      },
      () => {}
    );
  });

</script>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-map',
      name: 'OSM',
      description: 'Open Street Map',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/osm',
    },
  };
</script>

<!-- <template>
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
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/osm',
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
</script> -->