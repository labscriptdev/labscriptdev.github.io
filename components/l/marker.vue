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
        default: 10,
      },
      tileLayer: {
        type: [ String ],
        default: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },

    watch: {
      $props: {deep:true, handler(props) {
        if (props.zoom != this.map.getZoom()) {
          this.map.setZoom(props.zoom);
        }
      }},
    },

    methods: {
      mapInit() {
        this.map = L.map(this.$el, { center: this.center, zoom: this.zoom });
        L.tileLayer(this.tileLayer, {}).addTo(this.map);

        this.map.on('moveend', async ev => {
          this.$emit('update:center', Object.values(this.map.getCenter()));
        });

        this.map.on('zoomend', async ev => {
          this.$emit('update:zoom', this.map.getZoom());
        });

        [
          'zoomlevelschange', 'resize', 'unload', 'viewreset', 'load', 'zoomstart', 'movestart', 'zoom', 'move', 'zoomend', 'moveend',
          'popupopen', 'popupclose', 'autopanstart', 'tooltipopen', 'tooltipclose', 'locationerror', 'locationfound', 'click', 'dblclick',
          'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'contextmenu', 'keypress', 'keydown', 'keyup', 'preclick', 'zoomanim',
        ].forEach(evt => {
          this.map.on(evt, ev => this.$emit(evt, ev));
        });
      },
    },

    data() {
      return {
        map: false,
      };
    },

    mounted() {
      this.mapInit();
    },
  };
</script>