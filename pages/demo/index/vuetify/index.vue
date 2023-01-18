<template>
  <app-layout>
    <!-- <v-card>
      <v-tabs v-model="tab">
        <template v-for="t in [{name:'Background', field:'bg'}, {name:'Text', field:'text'}]">
          <v-tab :value="t.field">{{ t.name }}</v-tab>
        </template>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <template v-for="t in [{name:'Background', field:'bg'}, {name:'Text', field:'text'}]">
            <v-window-item :value="t.field">
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
            </v-window-item>
          </template>
        </v-window>
      </v-card-text>
    </v-card> -->

    <v-row class="pa-5">
      <!-- <v-col cols="12" md="4"></v-col>
      <v-col cols="12" md="4"></v-col> -->
      <v-col cols="12" md="3">
        <v-card>
          <v-toolbar density="compact">
            <v-toolbar-title>Form</v-toolbar-title>
            <v-btn icon="mdi-logout"></v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field label="Text field" />
            <v-text-field label="Password" type="password" />
            <v-textarea label="Textarea" />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="success">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        --
      </v-col>
    </v-row>

    <app-alert v-model="useClipboard.copied" type="snackbar" color="success">
      Texto copiado: {{ useClipboard.text }}
    </app-alert>

    <template #drawer>
      <div class="d-flex flex-wrap">
        <div
          v-for="c in colorClasses()"
          :class="[c.bg, 'py-1', 'px-2']"
          @click="useClipboard.copy(c.name)"
        >
          {{ c.bg }}
        </div>
      </div>
    </template>
  </app-layout>
</template>

<script>
  import { useClipboard } from '@vueuse/core';

  export default {
    methods: {
      colorClasses() {
        const classes = [];
        const aliasColors = ['primary', 'secondary', 'warning', 'error', 'info'];
        const colors = [ ...aliasColors, 'black', 'grey', 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey'];

        for(let color of colors) {
          classes.push({
            name: `${color}`,
            bg: `bg-${color}`,
            text: `text-${color}`,
          });

          for(let type of ['lighten', 'darken', 'accent']) {
            for(let n of [1, 2, 3, 4, 5]) {

              if (aliasColors.includes(color) && ['lighten', 'accent'].includes(type)) continue;
              if (aliasColors.includes(color) && ['darken'].includes(type) && [2, 3, 4, 5].includes(n)) continue;

              classes.push({
                name: `${color}-${type}-${n}`,
                bg: `bg-${color}-${type}-${n}`,
                text: `text-${color}-${type}-${n}`,
              });
            }
          }
        }
        return classes;
      },
    },

    data() {
      return {
        tab: 'bg',
        useClipboard: useClipboard(),
      };
    },
  };
</script>