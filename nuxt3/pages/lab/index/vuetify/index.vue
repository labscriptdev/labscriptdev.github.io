<template>
  <app-layout v-bind="{ containerCard: false }">
    <v-defaults-provider :defaults="defaults">
      <v-row>
        <v-col cols="12" md="4">
          <v-card title="Form">
            <v-card-text>
              <v-text-field label="Text field" />
              <v-select label="Select" />
              <v-autocomplete label="Autocomplete" />
              <v-combobox label="Combobox" />
              <v-file-input label="File input" />
              <v-textarea label="Textarea" />
            </v-card-text>
            <v-card-actions class="border-t">
              <v-spacer />
              <v-btn>Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card>
            <v-list>
              <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.png" title="John Leider" subtitle="john@google.com">
                <template #append>
                  <v-btn
                    size="small"
                    variant="text"
                    icon="mdi-menu-down"
                  />
                </template>
              </v-list-item>
            </v-list>

            <v-divider />
    
            <v-tabs>
              <v-tab>Tab 1</v-tab>
              <v-tab>Tab 2</v-tab>
              <v-tab>Tab 3</v-tab>
            </v-tabs>
    
            <v-list>
              <v-list-item prepend-icon="mdi-circle">Item 1</v-list-item>
              <v-list-item prepend-icon="mdi-circle">Item 2</v-list-item>
              <v-list-item prepend-icon="mdi-circle">Item 3</v-list-item>
            </v-list>

            <v-divider />
            
            <v-table
              v-bind="{
                fixedHeader: true,
                height: '300px',
              }"
            >
              <thead>
                <tr>
                  <td>field1</td>
                  <td>field2</td>
                  <td>field3</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="n in 10">
                  <td>field1 {{ n }}</td>
                  <td>field1 {{ n }}</td>
                  <td>field1 {{ n }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>footer1</td>
                  <td>footer2</td>
                  <td>footer3</td>
                </tr>
              </tfoot>
            </v-table>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card>
            <v-img cover height="200" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" />
  
            <v-card-item>
              <v-card-title>Cafe Badilico</v-card-title>
  
              <v-card-subtitle>
                <span class="me-1">Local Favorite</span>
  
                <v-icon
                  color="error"
                  icon="mdi-fire-circle"
                  size="small"
                ></v-icon>
              </v-card-subtitle>
            </v-card-item>
  
            <v-card-text>
              <v-row class="mx-0">
                <v-rating
                  :model-value="4.5"
                  color="amber"
                  density="compact"
                  half-increments
                  readonly
                  size="small"
                ></v-rating>
  
                <div class="text-grey ms-4">
                  4.5 (413)
                </div>
              </v-row>
  
              <div class="my-4 text-subtitle-1">
                $ • Italian, Cafe
              </div>
  
              <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
            </v-card-text>
  
            <v-card-item>
              <v-timeline density="compact" align="start">
                <v-timeline-item>Item description</v-timeline-item>
                <v-timeline-item>Item description</v-timeline-item>
                <v-timeline-item>Item description</v-timeline-item>
              </v-timeline>
            </v-card-item>
  
            <v-divider />
  
            <v-card-title>Tonight's availability</v-card-title>
  
            <div class="px-4">
              <v-chip-group>
                <v-chip>5:30PM</v-chip>
                <v-chip>7:30PM</v-chip>
                <v-chip>8:00PM</v-chip>
                <v-chip>9:00PM</v-chip>
              </v-chip-group>
            </div>
  
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" variant="tonal">Reserve</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-defaults-provider>

    <br>
    <v-row no-gutters>
      <v-col cols="2" v-for="c in color.data" :key="c" :class="`bg-${c} text-center py-1`">
        {{ c }}
      </v-col>
    </v-row>
    
    <pre>{{ color }}</pre>

    <template #drawer>
      <v-defaults-provider
        :defaults="{
          VSelect: { variant: 'outlined', density: 'compact' },
          VCombobox: { variant: 'outlined', density: 'compact' },
        }"
      >
        <div class="pa-2">
          <v-combobox
            v-model="custom.color"
            v-bind="{
              label: 'Color',
              items: color.data,
            }"
          />
          <v-combobox
            v-model="custom.variantInput"
            v-bind="{
              label: 'Variant input',
              items: custom.options.variantInput,
            }"
          />
          <v-combobox
            v-model="custom.variantBtn"
            v-bind="{
              label: 'Variant BTN',
              items: custom.options.variantBtn,
            }"
          />
          <!-- <pre>custom: {{ custom }}</pre> -->
          <!-- <pre>defaults: {{ defaults }}</pre> -->
        </div>
      </v-defaults-provider>
    </template>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-vuetify',
      name: 'Vuetify',
      description: 'Vuetify',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/vuetify',
    },
  };
</script>

<script setup>
  import { ref, computed } from 'vue';

  const color = ref({
    data: (() => {
      let names = [];
      const aliasColors = ['primary', 'secondary', 'warning', 'error', 'info'];
      const colors = [ ...aliasColors, 'black', 'grey', 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey'];
      const types = ['lighten', 'darken', 'accent'];

      for(let color of colors) {
        names.push(color);

        for(let type of types) {
          for(let n of [1, 2, 3, 4, 5]) {

            // darken e accent não tem -5
            if (['darken', 'accent'].includes(type) && [5].includes(n)) continue;

            // cores primárias não tem types
            if (aliasColors.includes(color) && types.includes(type)) continue;

            // cores sem dark, lighten, accent
            if (['black', 'white'].includes(color) && ['lighten', 'darken', 'accent'].includes(type)) continue;

            // cores sem accent
            if (['grey', 'brown', 'blue-grey'].includes(color) && ['accent'].includes(type)) continue;

            names.push(`${color}-${type}-${n}`);
          }
        }
      }

      return names;
    }) (),
  });

  const custom = ref({
    color: 'primary',
    variantInput: 'filled',
    variantInputBtn: 'elevated',
    options: {
      variantInput: ['outlined', 'plain', 'underlined', 'filled', 'solo'],
      variantBtn: ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'],
    },
  });

  const defaults = computed(() => ({
    VTabs: {
      color: custom.value.color,
    },
    VTimelineItem: {
      dotColor: custom.value.color,
    },
    VBtn: {
      variant: custom.value.variantBtn,
    },
    VTextField: {
      variant: custom.value.variantInput,
    },
    VSelect: {
      variant: custom.value.variantInput,
    },
    VAutocomplete: {
      variant: custom.value.variantInput,
    },
    VCombobox: {
      variant: custom.value.variantInput,
    },
    VFileInput: {
      variant: custom.value.variantInput,
    },
    VTextarea: {
      variant: custom.value.variantInput,
    },
  }));
</script>