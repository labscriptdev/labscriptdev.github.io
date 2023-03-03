<template>

  <div style="display:flex;">
    <div style="flex-grow:1;">

      <!-- render -->
      <div style="display:flex;" :style="getStyle(data.modelValue.style)">
        <div v-for="r in data.modelValue.rows" :style="getStyle(r.style)">
          <template v-for="e in r.elements">
            <div @click="edit=e">
              <component
                :is="e.is"
                v-bind="e.bind"
                v-model="e.bind"
                :editable="false"
                v-on="{ click: log }"
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

        <div v-if="edit">
          <component :is="edit.is" v-bind="getBind(edit.bind)" :editable="true" />
          <pre>{{ edit }}</pre>
        </div>
      </div>
      
    </div>
  </div>

  <pre>{{ { props, edit, data, elements } }}</pre>

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

<script setup>
  import { ref, computed, watch, defineProps, defineEmits } from 'vue';
  import vuelementorElCard from './el/card.vue';

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits([
    // 'update:modelValue',
  ]);

  const edit = ref(false);

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
            is: vuelementorElCard,
            bind: { body: 'A dsjgdhsa gf dj d' },
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
            is: vuelementorElCard,
            bind: { title: 'Card B' },
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

  const elements = [
    vuelementorElCard,
  ];

  const getStyle = (styleObj) => {
    styleObj = JSON.parse(JSON.stringify(styleObj));
    for(let i in styleObj) {
      if (i=='width') {
        styleObj['minWidth'] = styleObj[i]['default'];
        styleObj['maxWidth'] = styleObj[i]['default'];
      }
      styleObj[i] = styleObj[i]['default'] || null;
    }

    console.log(JSON.stringify(styleObj, ' ', 2));
    return styleObj;
  };

  const getBind = (bind) => {
    console.log(bind);
    return {
      ...bind,
      '@update:title': 'log($event)',
    };
  };

  const log = console.log;
</script>