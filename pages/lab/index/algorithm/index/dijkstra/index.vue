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
              v-model.number="point.fromId"
              v-bind="{ type: 'number', hideDetails: true, min: 0, max: point.data.length-1 }"
            />
          </div>
          <div class="flex-grow-1">
            <div>To</div>
            <v-text-field
              v-model.number="point.toId"
              v-bind="{ type: 'number', hideDetails: true, min: 0, max: point.data.length-1 }"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style="width:100%; margin:0 auto;"
          class="border bg-grey-lighten-4"
          @mouseup.prevent="drag.stop($event)"
        >
          <template v-for="e in point.edges">
            <line
              style="stroke:#ff000088; stroke-width:.3;"
              v-bind="{
                x1: e.x1,
                y1: e.y1,
                x2: e.x2,
                y2: e.y2,
              }"
            />
          </template>
          <template v-for="e in (point.path.edges || [])">
            <line
              style="stroke:#00ff0088; stroke-width:2;"
              v-bind="{
                x1: e.x1,
                y1: e.y1,
                x2: e.x2,
                y2: e.y2,
              }"
            />
          </template>
          <template v-for="p in point.data">
            <g
              :transform="`translate(${p.x}, ${p.y})`"
              @mousedown.prevent="drag.init($event, p)"
              style="cursor:grab;"
            >
              <circle cx="0" cy="0" r="5" fill="orange" />
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
  
  const point = ref({
    fromId: 0,
    toId: 5,
    data: [
      { id: 0, x: 5, y: 5 },
      { id: 1, x: 40, y: 15 },
      { id: 2, x: 95, y: 20 },
      { id: 3, x: 10, y: 60 },
      { id: 4, x: 65, y: 65 },
      { id: 5, x: 90, y: 50 },
      { id: 6, x: 30, y: 90 },
      { id: 7, x: 55, y: 90 },
      { id: 8, x: 95, y: 95 },
    ],
    edges: computed(() => {
      let edges = [];
      const maxEdges = 3;

      point.value.data.forEach(p => {

        let pointEdges = point.value.data

          // remove self id from list
          .filter(pp => pp.id != p.id)

          // insert size in each line
          .map(pp => {
            const size = (() => {
              const diffx = p.x - pp.x;
              const diffy = p.y - pp.y;
              return Math.sqrt(diffx * diffx + diffy * diffy);
            })();

            return {
              size,
              fromId: p.id,
              toId: pp.id,
            };
          })

          // previne backway
          .filter(e => {
            const backway = edges.filter(ee => {
              return ee.fromId==e.toId;
            });
            return !backway.length;
          })
        ;

        pointEdges = _.orderBy(pointEdges, ['size'], ['asc']);
        pointEdges = _.slice(pointEdges, 0, maxEdges);
        pointEdges.forEach(pp => {
          const from = point.value.getPoint(pp.fromId);
          const to = point.value.getPoint(pp.toId);

          edges.push({
            fromId: from.id,
            toId: to.id,
            size: pp.size,
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
          });
        });
      });

      return edges;
    }),
    path: computed(() => {
      const self = point.value;

      const calculatePath = (options={}, paths={}) => {
        options = _.merge({
          id: false,
          deep: 0,
          visited: [],
          sizes: [],
          children: [],
        }, options);

        options.visited.push(options.id);
        paths[ options.visited.join('-') ] = {
          size: options.sizes.reduce((total, n) => total+n, 0),
          path: options.visited,
        };

        options.children = self.edges
          .filter(e => {
            return e.fromId==options.id
              && !options.visited.includes(e.toId);
          })
          .map(e => {
            return calculatePath({
              id: e.toId,
              deep: options.deep+1,
              visited: options.visited,
              sizes: [ ...options.sizes, e.size ],
            }, paths);
          })
        ;

        if (options.deep==0) {
          return Object.values(paths)
            .filter(p => self.toId == p.path.at(-1))
            .sort((a, b) => a.size - b.size)
            .map(p => {
              return {
                size: p.size,
                // path: p.path,
                edges: p.path
                  .map((pointId, index) => {
                    if (!p.path[index+1]) return null;
                    const from = self.getPoint(pointId);
                    const next = self.getPoint(p.path[index+1]);
                    return {
                      fromId: from.id,
                      toId: next.id,
                      x1: from.x,
                      y1: from.y,
                      x2: next.x,
                      y2: next.y,
                    };
                  })
                  .filter(v => !!v),
              };
            })
            .at(0);
        }

        return options;
      };

      return calculatePath({
        id: self.fromId,
      });
    }),
    getPoint(id) {
      return this.data.filter(p => p.id==id).at(0) || false;
    },
    addRandom(size=10) {
      this.data = [];
      for(let id=0; id<size; id++) {
        const x = Math.round(Math.random()*100);
        const y = Math.round(Math.random()*100);
        this.data.push({ id, x, y });
      }
    },
  });

  const test = ref({
    randomSize: 10,
    addRandom() {
      point.value.addRandom(this.randomSize);
      point.value.fromId = 0;
      point.value.toId = this.randomSize-1;
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
      this.point = point;
      this.svg.addEventListener('mousemove', this.svgMousemove);
    },
    stop(ev) {
      this.svg.removeEventListener('mousemove', this.svgMousemove);
    },
    svgMousemove: (ev) => {
      const offset = drag.value.svg.clientWidth / 100;
      drag.value.point.x = ev.offsetX / offset;
      drag.value.point.y = ev.offsetY / offset;
    },
  });
</script>