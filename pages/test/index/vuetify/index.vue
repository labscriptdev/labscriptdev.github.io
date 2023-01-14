<template>
  <div>
    <template v-for="t in [{name:'Background', field:'bg'}, {name:'Text', field:'text'}]">
      <div class="text-uppercase font-weight-bold py-2">{{ t.name }}</div>
      <div class="d-flex flex-wrap">
        <template v-for="c in colorClasses()">
          <v-tooltip>
            <pre>{{ c[ t.field ] }}</pre>
            <template #activator="{ props }">
              <div
                v-bind="props"
                :class="[ c[ t.field ], 'text-center', 'border' ]"
                style="width:calc(100% / 16); padding:5px;"
                @click="useClipboard.copy(c.bg)"
              >
                text
              </div>
            </template>
          </v-tooltip>
        </template>
      </div>
    </template>

    <app-alert v-model="useClipboard.copied" type="snackbar" color="success">
      Texto copiado: {{ useClipboard.text }}
    </app-alert>
  </div>
</template>

<script>
  import { useClipboard } from '@vueuse/core';

  export default {
    methods: {
      colorClasses() {
        let colors = [];
        for(let color of ['primary', 'black', 'grey', 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey']) {
          colors.push({
            bg: `bg-${color}`,
            text: `text-${color}`,
          });

          for(let type of ['lighten', 'darken', 'accent']) {
            for(let n of [1, 2, 3, 4, 5]) {
              colors.push({
                bg: `bg-${color}-${type}-${n}`,
                text: `text-${color}-${type}-${n}`,
              });
            }
          }
        }
        return colors;
      },
    },

    data() {
      return {
        useClipboard: useClipboard(),
      };
    },
  };
</script>