<template>
  <div>
    <v-row>
      <v-col cols="4">
        <template v-for="c in componentsRaw">
          <div @click="components.add(c)">
            <!-- <component :is="c.component" /> -->
            <v-btn block>{{ c.name }}</v-btn>
          </div>
        </template>
      </v-col>
      <v-col cols="8">
        <template v-for="c in components.items">
          <div>
            <component :is="c.component" />
          </div>
        </template>
        <pre>{{ components }}</pre>
        <pre>{{ componentsRaw }}</pre>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const components = reactive({
  items: [],
  add(component) {
    components.items.push({ ...component, bind: {} });
  },
});

const componentsRaw = Object.entries(
  import.meta.glob("./c/*.vue", { import: "default", eager: true })
).map(([file, component]) => {
  const name = component.__name;
  return { name, component };
});
</script>
