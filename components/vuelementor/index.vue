<template>
  <Teleport to="body">
    <v-navigation-drawer :model-value="true" v-if="edit.element" width="400" location="end">
      <div class="d-flex flex-column" style="height:100vh;">
        <div>
          <v-tabs v-model="edit.tab">
            <v-tab value="elements">Elements</v-tab>
            <v-tab value="element">Element</v-tab>
            <v-tab value="column">Column</v-tab>
            <v-tab value="section">Section</v-tab>
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

            <v-window-item value="element">
              <component v-if="edit.element" :is="edit.element.component" v-model="edit.element.model" :editor="true" />
            </v-window-item>

            <v-window-item value="column">
              <pre>{{ edit.column }}</pre>
            </v-window-item>

            <v-window-item value="section">
              <pre>{{ edit.section }}</pre>
            </v-window-item>
          </v-window>
        </div>

        <div>
          <v-btn block v-if="edit.element" @click="edit.clear()">Close</v-btn>
        </div>
      </div>
    </v-navigation-drawer>
  </Teleport>

  <div>
    <template v-for="s in modelValue.sections">
      <template v-for="c in s.columns">
        <template v-for="e in c.elements">
          <div @click="edit.set(e, c, s); edit.setTab('element');">
            <component :is="e.component" v-model="e.model" :editor="false" />
          </div>
        </template>
      </template>
    </template>
  </div>

  <v-row no-gutters>
    <v-col cols="6"><pre>elements: {{ elements }}</pre></v-col>
    <v-col cols="6"><pre>modelValue: {{ modelValue }}</pre></v-col>
  </v-row>
</template>

<script setup>
  import { reactive, defineProps, defineEmits, onMounted } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [ Object ],
      default: () => ({}),
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const edit = reactive({
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
      edit.element = element;
      edit.column = column;
      edit.section = section;
    },
    clear() {
      edit.element = false;
      edit.column = false;
      edit.section = false;
    },
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