<template>

  <div style="display:flex;">
    <div style="flex-grow:1;">

      <!-- render -->
      <div style="display:flex;" :style="getStyle(data.modelValue.style)">
        <div v-for="r in data.modelValue.rows" :style="getStyle(r.style)">
          <template v-for="e in r.elements">
            <div @click="editRow=r; editElement=e;">
              <component
                :is="e.is"
                v-model="e.model"
                :editable="false"
              />
            </div>
          </template>
        </div>
      </div>

    </div>

    <div class="ps-3" style="min-width:300px; max-width:300px;">
      
      <!-- editor -->
      <div>
        <v-text-field v-model="data.modelValue.name" />

        <div v-if="editElement">
          <component
            :is="editElement.is"
            v-model="editElement.model"
            :editable="true"
          />
        </div>

        <div v-if="editRow">
          <v-tabs v-model="previewSize">
            <v-tab v-for="(s, s_attr) in sizes" :value="s_attr">
              <v-icon>{{ s.icon }}</v-icon>
            </v-tab>
          </v-tabs>
          <v-window v-model="previewSize">
            <v-window-item v-for="(s, s_attr) in sizes" :value="s_attr" class="pt-3">
              <template v-for="[attr, values] in Object.entries(editRow.style)">
                <v-text-field :label="attr" v-model="editRow.style[ attr ][ s_attr ]" />
              </template>
            </v-window-item>
          </v-window>
        </div>

        <pre>{{ { previewSize, editElement, editRow } }}</pre>
      </div>
      
    </div>
  </div>

  <pre>{{ { props, data } }}</pre>

  <!-- <v-navigation-drawer
    :model-value="true"
    :order="-1"
    location="end"
    permanent
    absolute
  >
    aa
  </v-navigation-drawer> -->
</template>

<script>
  import vuelementorElCard from './el/card.vue';

  export default {
    components: {
      vuelementorElCard,
    },
  };
</script>

<script setup>
  import { ref, computed, watch, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits([
    // 'update:modelValue',
  ]);

  const editElement = ref(false);
  const editRow = ref(false);

  const previewSize = ref('default');
  const sizes = ref({
    default: {
      width: 0,
      icon: 'mdi-monitor',
    },
    mobile: {
      width: 700,
      icon: 'mdi-cellphone',
    },
  });

  const data = ref({
    modelValue: {
      name: '',
      rows: [],
      ...props.modelValue
    },
  });

  data.value.modelValue = {
    id: 'a12345',
    name: 'Test',
    style: {
      gap: {
        default: '10px',
      },
    },
    rows: [
      {
        style: {
          width: {
            default: '50%',
            mobile: '100%',
          },
        },
        elements: [
          {
            is: 'vuelementorElCard',
            model: { body: 'A dsjgdhsa gf dj d' },
          },
        ],
      },
      {
        style: {
          width: {
            default: '50%',
            mobile: '100%',
          },
        },
        elements: [
          {
            is: 'vuelementorElCard',
            model: { title: 'Card B' },
          },
        ],
      },
    ],
  };

  watch([ data.value ], (datas) => {
    datas.forEach(dataNew => {
      Object.entries(dataNew).forEach(([ name, value ]) => {
        emit(`update:${name}`, value);
      });
    });
  });

  const getStyle = (styleObj) => {
    styleObj = JSON.parse(JSON.stringify(styleObj));
    for(let i in styleObj) {
      if (i=='width') {
        styleObj['minWidth'] = styleObj[i]['default'];
        styleObj['maxWidth'] = styleObj[i]['default'];
      }
      styleObj[i] = styleObj[i]['default'] || null;
    }

    // console.log(JSON.stringify(styleObj, ' ', 2));
    return styleObj;
  };

  const log = console.log;
</script>