<template>
  <app-layout>
    <div ref="rootRef">
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
            <l-rectangle :bounds="map.minArea.bounds" ref="minAreaRef" />
            <l-rectangle :bounds="map.maxArea.bounds" ref="maxAreaRef" />
          </l-map>
        </v-col>
  
        <v-col cols="6">
          <div v-html="map.svg"></div>
          <div style="font-family:monospace;">{{ map.svg }}</div>
          <!-- <pre>{{ `viewBox="${map.maxArea.bounds[0][1]} ${map.maxArea.bounds[0][0]} ${map.maxArea.bounds[1][1]-map.maxArea.bounds[0][1]} ${map.maxArea.bounds[1][0]-map.maxArea.bounds[0][0]}"` }}</pre> -->
          <!-- {{ `https://c.tile.openstreetmap.org/${map.zoom}/${map.xy[0]}/${map.xy[1]}.png` }} <br>
          <a :href="map.osmURL" target="_blank">{{ map.osmURL }}</a><br>
          <img :src="`https://c.tile.openstreetmap.org/${map.zoom}/${map.xy[0]}/${map.xy[1]}.png`" alt=""> -->
        </v-col>
      </v-row>
  
      <pre>char: {{ char }}</pre>
      <pre>map.svg: {{ map.svg }}</pre>
    </div>
  </app-layout>
</template>

<script setup>
  import _ from 'lodash';
  import axios from 'axios';
  import { reactive, ref, computed, onMounted, getCurrentInstance } from 'vue';
  const { ctx } = getCurrentInstance();

  import 'leaflet/dist/leaflet.css';
  import { LMap, LTileLayer, LMarker, LIcon, LRectangle } from '@vue-leaflet/vue-leaflet';

  import hotkeys from 'hotkeys-js';

  hotkeys('w, up', (ev) => {
    char.coords[0] += char.speed;
    map.center[0] += char.speed;
    map.update();
  });
  
  hotkeys('s, down', (ev) => {
    char.coords[0] -= char.speed;
    map.center[0] -= char.speed;
    map.update();
  });

  hotkeys('a, left', (ev) => {
    char.coords[1] -= char.speed;
    map.center[1] -= char.speed;
    map.update();
  });

  hotkeys('d, right', (ev) => {
    char.coords[1] += char.speed;
    map.center[1] += char.speed;
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

  const useMapData = (options={}) => {

    options = _.merge({
      zoom: 15,
      center: [ 0, 0 ],
    }, options);

    const r = reactive({
      ...options,

      minArea: {
        size: .001,
        bounds: [[0, 0], [0, 0]],
      },
      maxArea: {
        size: .005,
        bounds: [[0, 0], [0, 0]],
      },
      osm: {
        loading: false,
        data: { elements: [] },
        to: false,
        async load() {
          if (r.osm.to) clearTimeout(r.osm.to);
          r.osm.to = setTimeout(async () => {
            const bbox = [ ...r.maxArea.bounds[0], ...r.maxArea.bounds[1] ];
            r.osm.loading = true;
            const { data } = await axios.get(`https://overpass-api.de/api/interpreter?data=[out:json];node(${bbox.join(',')});out;`);
            r.osm.loading = false;
            r.osm.data = data;
          }, 500);
        },
      },

      update() {
        r.updateAreas();

        getRef('minAreaRef', (comp) => {
          comp.leafletObject.setBounds(r.minArea.bounds);
        });

        getRef('maxAreaRef', (comp) => {
          comp.leafletObject.setBounds(r.maxArea.bounds);
        });
      },

      updateAreas() {
        if (
          (
            r.minArea.bounds[0][0]==0
            && r.minArea.bounds[0][1]==0
            && r.minArea.bounds[1][0]==0
            && r.minArea.bounds[1][1]==0
          )
          || r.center[0] < r.minArea.bounds[0][0]
          || r.center[0] > r.minArea.bounds[1][0]
          || r.center[1] < r.minArea.bounds[0][1]
          || r.center[1] > r.minArea.bounds[1][1]
        ) {
          r.minArea.bounds[0] = [ r.center[0]-r.minArea.size, r.center[1]-r.minArea.size ];
          r.minArea.bounds[1] = [ r.center[0]+r.minArea.size, r.center[1]+r.minArea.size ];
          r.maxArea.bounds[0] = [ r.center[0]-r.maxArea.size, r.center[1]-r.maxArea.size ];
          r.maxArea.bounds[1] = [ r.center[0]+r.maxArea.size, r.center[1]+r.maxArea.size ];
          r.osm.load();
        }
      },

      coordsToMercador([ lat, lng ], zoom) {
        const R = 6378137,
          sphericalScale = 0.5 / (Math.PI * R),
          d = Math.PI / 180,
          max = 1 - 1E-15,
          sin = Math.max(Math.min(Math.sin(lat * d), max), -max),
          scale = 256 * Math.pow(2, zoom);
  
        let x = R * lng * d;
        x = scale * (sphericalScale * x + 0.5);
        x = Math.floor(x / 256);
  
        let y = R * Math.log((1 + sin) / (1 - sin)) / 2;
        y = scale * (-sphericalScale * y + 0.5);
        y = Math.floor(y / 256);

        return [ x, y, ];
      },

      // mercator: computed(() => {
      //   return r.coordsToMercador(r.center, r.zoom);
      // }),

      svg: computed(() => {
        const numberPositive = (n) => {
          console.log(n);
          return Math.max(n, n*-1);
        }
        let lines = [`<svg width="400" height="400"`];
        lines.push(`viewBox="${r.maxArea.bounds[0][1]} ${r.maxArea.bounds[0][0]} ${numberPositive(r.maxArea.bounds[0][1]-r.maxArea.bounds[1][1])} ${numberPositive(r.maxArea.bounds[0][0]-r.maxArea.bounds[1][0])}"`);
        lines.push(`style="width:100%; border:solid 1px red;">`);
        lines.push(`</svg>`);

        console.clear();
        console.log(JSON.stringify(r.osm.data.elements, null, 2));
        return lines.join('');
      }),
    });

    watch([ r.center ], ([ center ]) => {
      r.update();
    });

    r.update();
    return r;
  };

  const getRef = (name, callback) => {
    const reff = ctx.$refs[name] || false;
    if (reff && callback!==null && typeof callback=='function') {
      callback(reff);
    }
    return reff;
  };

  const rootRef = ref(null);
  const mapRef = ref(null);
  const map = useMapData();

  onMounted(() => {
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        char.coords[0] = geo.coords.latitude;
        char.coords[1] = geo.coords.longitude;
        map.update();

        map.center[0] = geo.coords.latitude;
        map.center[1] = geo.coords.longitude;
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