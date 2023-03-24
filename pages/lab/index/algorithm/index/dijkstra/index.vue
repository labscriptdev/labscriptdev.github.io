<!-- https://www.youtube.com/watch?v=EFg3u_E6eHU&ab_channel=SpanningTree -->
<template>
  <v-defaults-provider
    :defaults="{
      VTextField: {
        variant: 'outlined',
        density: 'compact',
      },
    }"
  >
    <div class="font-weight-bold">Objetivo: encontrar o menor caminho entre os pontos</div>
    <br>
    <v-row>
      <v-col cols="12" lg="6">
        <div class="d-flex align-center" style="gap:15px;">
          <div style="max-width:200px;">
            <v-text-field
              v-model="test.randomSize"
              v-bind="{
                type: 'number',
                hideDetails: true,
              }"
            />
          </div>
          <div class="flex-grow-1">
            <v-btn block @click="test.addRandom();">Create {{ test.randomSize }} points</v-btn>
          </div>
        </div>
        
        <br><br>
        <div class="d-flex" style="gap:10px;">
          <div class="flex-grow-1">
            <div>Find path from</div>
            <v-text-field
              v-model.number="points.path.from"
              v-bind="{ type: 'number', hideDetails: true, min: 0, max: points.items.length-1 }"
            />
          </div>
          <div class="flex-grow-1">
            <div>To</div>
            <v-text-field
              v-model.number="points.path.to"
              v-bind="{ type: 'number', hideDetails: true, min: 0, max: points.items.length-1 }"
            />
          </div>
        </div>
  
        <br>
        <div>Paths:</div>
        <v-table class="border">
          <thead>
            <tr>
              <td>From</td>
              <td>To</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in points.path.items">
              <td>{{ p.from }}</td>
              <td>{{ p.to }}</td>
            </tr>
          </tbody>
        </v-table>
        
      </v-col>
      <v-col cols="12" lg="6">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style="width:100%; margin:0 auto;"
          class="border bg-grey-lighten-4"
          @mouseup.prevent="drag.stop($event)"
        >
          <template v-for="c in points.connections">
            <line v-bind="c.bind" style="stroke:#ff000088; stroke-width:.5;" />
          </template>

          <template v-for="c in points.path.items">
            <line v-bind="c.bind" style="stroke:#00ff0088; stroke-width:2;" />
          </template>
  
          <template v-for="p in points.items">
            <g
              :transform="`translate(${p.x}, ${p.y})`"
              @mousedown.prevent="drag.init($event, p)"
            >
              <circle cx="0" cy="0" r="5"
                :fill="pointColor(p)"
              />
              <text x="0" y="0" text-anchor="middle" alignment-baseline="middle" font-size="3px">{{ p.id }}</text>
            </g>
          </template>
        </svg>
      </v-col>
    </v-row>
  </v-defaults-provider>
</template>

<script>
  export default {
    meta: {
      icon: null,
      name: 'Dijkstra',
    },
  };
</script>

<script setup>
  import { ref, computed } from 'vue';
  import _ from 'lodash';

  const pointColor = (point) => {
    if (point.id==points.value.path.from) return 'green';
    if (point.id==points.value.path.to) return 'red';
    return 'orange';
  };

  const points = ref({
    items: [],
    path: {
      from: null,
      to: null,
      explored: [],
      items: computed(() => {
        const self = points.value;
        let pathItems = [];

        if (self.path.from===null && self.path.to===null) {
          return [];
        }

        const getNearestConnection = (point, ignore=[]) => {
          return self.connections
            .filter(c => c.from==point.id && !ignore.includes(c.from))
            .reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr), false);
        };

        const from = self.getPoint(self.path.from);
        const to = self.getPoint(self.path.to);

        self.path.explored = [ from.id ];

        if (from.id != to.id) {
          let nearestConnection = getNearestConnection(from);
          pathItems.push(nearestConnection);
  
          while(nearestConnection && nearestConnection.to != to.id) {
            self.path.explored.push(nearestConnection.from);

            let pointTo = self.getPoint(nearestConnection.to);
            nearestConnection = getNearestConnection(pointTo, self.path.explored);
            if (nearestConnection) pathItems.push(nearestConnection);
          }
        }


        return pathItems;
      }),
    },
    getPoint(id) {
      return this.items.filter(p => p.id==id).at(0) || false;
    },
    connections: computed(() => {
      let connections = [];

      points.value.items.forEach(point => {
        point.connections.forEach(pointId => {
          const point2 = points.value.items.filter(p => p.id==pointId).at(0);
          const x1 = point.x;
          const y1 = point.y;
          const x2 = point2.x;
          const y2 = point2.y;

          const distance = (() => {
            const diffx = x1 - x2;
            const diffy = y1 - y2;
            return Math.sqrt(diffx * diffx + diffy * diffy);
          })();

          connections.push({
            from: point.id,
            to: point2.id,
            distance,
            bind: { x1, y1, x2, y2 },
           });
        });
      });

      return connections;
    }),
    addRandom(max=10) {
      
      for(let p=0; p<max; p++) {
        const id = this.items.length;

        this.items.push({
          id,
          x: Math.round(Math.random()*100),
          y: Math.round(Math.random()*100),
          connections: [],
        });
      }

      this.items.forEach(p => {
        let distances = this.items.map(pp => {
          const distance = (() => {
            const diffx = p.x - pp.x;
            const diffy = p.y - pp.y;
            return Math.sqrt(diffx * diffx + diffy * diffy);
          })();

          return {
            distance,
            fromId: p.id,
            toId: pp.id,
            toConnections: pp.connections,
          };
        });

        distances = distances.filter(d => d.distance > 0);
        distances = distances.filter(d => !d.toConnections.includes(p.id));
        distances = _.orderBy(distances, ['distance'], ['asc']);
        distances = _.slice(distances, 0, 3);

        distances.forEach(({ toId }) => {
          p.connections.push(toId);
        });
      });
    },
  });

  const test = ref({
    randomSize: 10,
    addRandom() {
      points.value.items = [];
      points.value.addRandom(this.randomSize);
      points.value.path.from = 0;
      points.value.path.to = 1;
    },
  });

  test.value.addRandom();

  const drag = ref({
    svg: false,
    target: false,
    point: false,
    init(ev, point) {
      this.svg = ev.currentTarget.closest("svg");
      this.target = ev.currentTarget;
      this.target.style.cursor = 'pointer';
      this.point = point;
      this.svg.addEventListener('mousemove', this.svgMousemove);
    },
    stop(ev) {
      this.svg.removeEventListener('mousemove', this.svgMousemove);
    },
    svgMousemove: (ev) => {
      drag.value.point.x = ev.offsetX / 6;
      drag.value.point.y = ev.offsetY / 6;
    },
  });
</script>