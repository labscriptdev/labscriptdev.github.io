<template>
  <v-card>
    <div v-if="dataTypeIs(modelValue, 'object')">
      <v-row>
        <v-col cols="3">
        <v-list>
          <v-list-subheader>KEYS</v-list-subheader>
            <v-list-item
              v-for="o in dataObjectKeys(modelValue)"
              :key="o.key"
              @click="modelValueKey = o.key"
              :active="o.key == modelValueKey"
              active-color="success"
            >
              ({{ o.type }}) {{ o.key }}
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="9">
          <pre class="pa-2" style="height:100%; background:#222; color:lime; overflow:auto;">{{ modelValueKey }}: {{ modelValue[ modelValueKey ] }}</pre>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <pre class="pa-2" style="height:100%; background:#222; color:lime; overflow:auto;">{{ dataType(modelValue) }}: {{ modelValue }}</pre>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      modelValue: {
        type: [ Boolean, Number, String, Array, Object, Function ],
        default: false,
      },
      activeKey: {
        type: [ Boolean, String ],
        default: false,
      },
    },
    methods: {
      dataType(data) {
        return Array.isArray(data) ? 'array' : typeof data;
      },
      dataTypeIs(data, type) {
        return type == this.dataType(data);
      },
      dataObjectKeys(data) {
        if (!this.dataTypeIs(data, 'object')) return [];
        let items = [];
        Object.keys(data).forEach((key, index) => {
          const type = this.dataType(data[ key ]);
          items.push({ key, type });
        });
        return items;
      },
    },
    data() {
      return {
        modelValueKey: this.activeKey || (this.dataTypeIs(this.modelValue, 'object') ? Object.keys(this.modelValue)[0] : false),
      };
    },
  };
</script>