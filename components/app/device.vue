<template>
  <div>

    <!-- browser -->
    <div v-if="props.type=='browser'" style="zoom:.8; border-radius:5px; overflow:hidden;">
      <v-system-bar
        color="grey"
        style="position:static!important; width:100%!important; gap:10px;"
        class="pa-4"
      >
        <v-icon icon="ic:baseline-circle" />
        <v-spacer />
        <v-icon icon="codicon:chrome-minimize" />
        <v-icon icon="codicon:chrome-maximize" />
        <v-icon icon="codicon:chrome-close" />
      </v-system-bar>

      <div style="height:100vh;">
        <slot></slot>
      </div>
    </div>

    <!-- mobile -->
    <div v-if="props.type=='mobile'" style="zoom:.8; width:450px; border-radius:5px; overflow:hidden;">
      <v-system-bar
        color="black"
        style="position:static!important; width:100%!important;"
        class="pa-4"
      >
        <span class="ms-2">{{ $dayjs().format('HH:mm') }}</span>
        <v-spacer />
        <v-icon icon="mdi-wifi-strength-4" />
        <v-icon icon="mdi-signal" class="ms-2" />
        <v-icon icon="mdi-battery" class="ms-2" />
      </v-system-bar>
      
      <div style="height:100vh;">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    type: { type: String, default: 'browser' },
  });
</script>