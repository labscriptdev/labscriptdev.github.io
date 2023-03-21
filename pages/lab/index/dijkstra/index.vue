<template>
  <app-layout>
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
        
        <br>
        <div>All points:</div>
        <v-table class="border">
          <colgroup>
            <col width="*">
            <col width="150px">
            <col width="150px">
          </colgroup>
          <tbody>
            <tr v-for="p in points.items">
              <td>{{ p.id }}</td>
              <td><input type="number" v-model="p.x" style="width:100%;"></td>
              <td><input type="number" v-model="p.y" style="width:100%;"></td>
            </tr>
          </tbody>
        </v-table>
        <!-- <pre>{{ points.path }}</pre> -->
      </v-col>
      <v-col cols="12" lg="6">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:400px;" class="border bg-grey-lighten-4">
          <template v-for="c in points.connections">
            <line v-bind="c.bind" style="stroke:#ff000088; stroke-width:.5;" />
          </template>

          <template v-for="p in points.items">
            <g
              :transform="`translate(${p.x}, ${p.y})`"
            >
              <circle cx="0" cy="0" r="5" stroke="black" stroke-width="1" fill="red" />
              <text x="0" y="0" text-anchor="middle" alignment-baseline="middle" font-size="3px">{{ p.id }}</text>
            </g>
          </template>

          <template v-for="c in points.path.items">
            <line v-bind="c.bind" style="stroke:#00ff0088; stroke-width:2;" />
          </template>
        </svg>

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
    </v-row>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: true,
      icon: 'mdi-code-json',
      name: 'Dijkstra\'s algorithm',
      description: 'Dijkstra\'s algorithm',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/dijkstra',
    },
  };
</script>

<script setup>
  import { ref, computed } from 'vue';
  import _ from 'lodash';

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
        const random = _.random(1, 3, 100 / max);
        for(let i=0; i<=random; i++) {
          const pointRand = _.sample(this.items);
          if (![ p.id, ...p.connections ].includes(pointRand.id)) {
            p.connections.push(pointRand.id);
          }
        }
      });

      this.path.from = _.sample(this.items).id;
      this.path.to = _.sample(this.items).id;
    },
  });

  const test = ref({
    randomSize: 10,
    addRandom() {
      points.value.items = [];
      points.value.addRandom(this.randomSize);
    },
  });

  test.value.addRandom();
</script>