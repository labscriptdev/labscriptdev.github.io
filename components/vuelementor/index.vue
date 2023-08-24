<template>
  <Teleport to="body">
    <v-navigation-drawer :model-value="true" v-if="edit.show" width="400" location="end">
      <div class="d-flex flex-column" style="height:100vh;">
        <div>
          <v-tabs v-model="edit.tab">
            <v-tab value="elements">Elements</v-tab>
            <v-tab value="element" v-if="edit.element">Element</v-tab>
          </v-tabs>
        </div>

        <div class="flex-grow-1 pa-3" style="overflow:auto;">
          <v-window v-model="edit.tab">
            <v-window-item value="elements">
              <v-list>
                <v-list-subheader>
                  Add item
                </v-list-subheader>
                <template v-for="e in elements">
                  <v-list-item @click="edit.addElement(e)">
                    {{ e }}
                  </v-list-item>
                </template>
              </v-list>
            </v-window-item>

            <v-window-item value="element" v-if="edit.element">
              <v-list-subheader>Element</v-list-subheader>
              <component v-if="edit.element" :is="edit.element.component" v-model="edit.element.model" :editor="true" />

              <v-tabs v-model="edit.device">
                <template v-for="d in edit.devices">
                  <v-tab :value="d.id">
                    <v-icon :icon="d.icon" />
                  </v-tab>
                </template>
              </v-tabs>

              <v-window v-model="edit.device">
                <template v-for="d in edit.devices">
                  <v-window-item :value="d.id">
                    <v-list-subheader>Column</v-list-subheader>
                    <v-text-field label="Width" v-model="edit.column.props[ d.id ]['width']" />
                    <!-- <pre>{{ edit.column.props[ d.id ] }}</pre> -->
      
                    <v-list-subheader>Section</v-list-subheader>
                    <v-checkbox label="Full width" v-model="edit.section.props[ d.id ]['full']" />
                    <!-- <pre>{{ edit.section.props[ d.id ] }}</pre> -->
                  </v-window-item>
                </template>
              </v-window>
            </v-window-item>
          </v-window>
        </div>

        <div class="d-flex">
          <div class="flex-grow-1" v-if="edit.element">
            <v-btn block @click="edit.clear()">Clear</v-btn>
          </div>
          <div class="flex-grow-1">
            <v-btn block @click="edit.close()">Close</v-btn>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </Teleport>

  <div>
    <template v-for="d in edit.devices">
      <template v-if="d.active">
        <template v-for="s in modelValue.sections">
          <v-container :class="[ s.id, 'border' ]" :fluid="s.props[ d.id ]['full']">
            <template v-for="c in s.columns">
              <template v-for="e in c.elements">
                <div @click="edit.set(e, c, s); edit.setTab('element');">
                  <component :is="e.component" v-model="e.model" :editor="false" />
                </div>
              </template>
            </template>
          </v-container>
        </template>
      </template>
    </template>
  </div>

  <v-row no-gutters>
    <v-col cols="6"><pre class="overflow-auto">elements: {{ elements }}</pre></v-col>
    <v-col cols="6"><pre class="overflow-auto">modelValue: {{ modelValue }}</pre></v-col>
    <!-- <v-col cols="6"><pre class="overflow-auto">modelValue.sections[0].columns[0].elements: {{ modelValue.sections[0].columns[0].elements }}</pre></v-col> -->
  </v-row>
</template>

<script setup>
  import { reactive, defineProps, defineEmits, computed, onMounted } from 'vue';
  
  import { useDisplay } from 'vuetify';
  const display = useDisplay();

  const props = defineProps({
    modelValue: {
      type: [ Object ],
      default: () => ({}),
    },
    editable: {
      type: [ Boolean ],
      default: true,
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const edit = reactive({
    show: false,
    tab: 'elements',
    element: false,
    column: false,
    section: false,
    setTab(tab) {
      edit.tab = tab;
    },
    addElement(element) {
      const element2 = { ...element };
      element2.model = JSON.parse(JSON.stringify(element2.model));
      edit.column.elements.push(element2);
    },
    set(element, column=null, section=null) {
      edit.show = true;
      edit.element = element;
      edit.column = column;
      edit.section = section;
    },
    clear() {
      edit.element = false;
      edit.column = false;
      edit.section = false;
      edit.setTab('elements');
    },
    close() {
      edit.show = false;
      edit.setTab('elements');
    },
    device: 'desktop',
    devices: computed(() => {
      return [
        {
          id: 'mobile',
          name: 'Mobile',
          icon: 'carbon:mobile',
          active: display.mobile.value,
        },
        {
          id: 'desktop',
          name: 'Desktop',
          icon: 'ph:desktop',
          active: !display.mobile.value,
        },
      ];
    }),
  });

  // console.clear(); console.log(import.meta);

  const elements = Object.values(import.meta.glob('./elements/**/*.vue', { eager: true, import: 'default' })).map((component) => {
    const file = component.__file.replace(/.+vuelementor\/elements\//g, '');

    let model = {};
    if (typeof component.props.modelValue.default=='function') {
      model = component.props.modelValue.default();
    }

    return { file, model, component };
  });

  const randomId = (prefix='') => {
    return prefix +'-'+ (new Date().getTime());
  };

  const modelValueValidate = (modelValue) => {
    const responsiveProps = (propsValue, mobile=null, desktop=null) => {
      if ((mobile!==null && typeof mobile=='object') && desktop===null) {
        desktop = mobile;
      }

      mobile = mobile===null ? {} : mobile;
      desktop = desktop===null ? {} : desktop;
      desktop = { ...mobile, ...desktop };
      return { mobile, desktop };
    };

    modelValue = {
      title: '',
      sections: [],
      ...props.modelValue
    };

    modelValue.sections = modelValue.sections.map((section) => {
      section = {
        id: randomId('section'),
        props: responsiveProps(null),
        columns: [],
        ...section
      };

      section.props = responsiveProps(section.props, { full: true });

      section.columns = section.columns.map((column) => {
        column = {
          id: randomId('column'),
          props: responsiveProps(null),
          elements: [],
          ...column
        };

        column.props = responsiveProps(column.props, { width: '100%' });

        column.elements = column.elements.map((element) => {
          if (element.file) {
            const component = elements.filter(elem => elem.file==element.file);
            if (component[0]) {
              element = component[0];
            }
          }
          return element;
        });

        return column;
      });

      return section;
    });

    return reactive(modelValue);
  };

  const modelValue = modelValueValidate(props.modelValue);

  onMounted(() => {
    emit('update:modelValue', modelValue);
  });
  
  // console.log(elements);
  // console.log(JSON.stringify(elements, null, 2));
</script>

<script>
  export default {
    meta: { name: 'Aaa' },
  };
</script>