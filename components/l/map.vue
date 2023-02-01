<template>
  <div style="height:400px;">
    <!--  -->
  </div>
</template>

<script>
  import base from './base.vue';
  import L from 'leaflet';

  export default {
    extends: base,

    props: {
      center: {
        type: Array,
        default: () => ([0, 0]),
      },
      zoom: {
        type: Number,
        default: 5,
      },
      tileLayer: {
        type: [ String ],
        default: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
      bounds: {
        type: Array,
        default: () => ([0, 0, 0, 0]),
      },
    },

    watch: {
      $props: {deep:true, handler(props) {
        if (props.zoom != this.map.getZoom()) {
          this.map.setZoom(props.zoom);
        }
        
        if (props.tileLayer != this.mapTileLayer._url) {
          this.mapTileLayer.setUrl(props.tileLayer);
        }
      }},
    },

    methods: {
      mapInit() {
        this.map = L.map(this.$el, { center: this.center, zoom: this.zoom });
        this.mapTileLayer = L.tileLayer(this.tileLayer, {}).addTo(this.map);

        this.map.on('moveend', async ev => {
          const center = Object.values(this.map.getCenter());
          this.$emit('update:center', center);
          this.$emit('update:bounds', this.getBounds());
          // this.emitMerge('update:center', { center });
        });

        this.map.on('zoomend', async ev => {
          this.$emit('update:zoom', this.map.getZoom());
          this.$emit('update:bounds', this.getBounds());
          // this.emitMerge('update:zoom', { zoom });
        });

        [
          'zoomlevelschange', 'resize', 'unload', 'viewreset', 'load', 'zoomstart', 'movestart', 'zoom', 'move', 'zoomend', 'moveend',
          'popupopen', 'popupclose', 'autopanstart', 'tooltipopen', 'tooltipclose', 'locationerror', 'locationfound', 'click', 'dblclick',
          'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'contextmenu', 'keypress', 'keydown', 'keyup', 'preclick', 'zoomanim',
        ].forEach(evt => {
          this.map.on(evt, event => {
            this.emitMerge(`map:${evt}`, { event });
            this.emitMerge('map:any', { event });
          });
        });

        // init
        const event = new Event('init');
        this.emitMerge('map:init', { event });
        this.emitMerge('map:any', { event });
      },

      emitMerge(type, merge = {}) {
        this.$emit(type, {
          type,
          map: this.map,
          zoom: this.map.getZoom(),
          center: this.map.getCenter(),
          bounds: this.getBounds(),
          osmUrl: this.getOsmUrl(),
          xy: this.getXY(),
          ...merge,
        });
      },

      getOsmUrl() {
        const bbox = this.getBounds().join(',');
        return `https://api.openstreetmap.org/api/0.6/map?[out:json];out;&bbox=${bbox}`;
      },

      getBounds() {
        const bounds = this.map.getBounds();
        return [ bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth() ];
      },

      getXY() {
        const [ lat, lng ] = this.center, zoom = this.map.getZoom();
        const x = (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2, zoom)));
        const y = (Math.floor((lng+180)/360*Math.pow(2, zoom)));
        return { x, y };
      },
    },

    data() {
      return {
        map: false,
        mapTileLayer: false,
      };
    },

    mounted() {
      this.mapInit();
    },
  };
</script>