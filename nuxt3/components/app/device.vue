<template>
  <div
    :style="{
      position: 'relative',
      width: props.type=='mobile' ? '400px' : '100%',
      borderRadius: '10px',
      overflow: 'hidden',
      border: 'solid 5px #000',
    }"
  >

    <template v-if="props.type=='browser'">
      <v-system-bar
        color="black"
        style="position:static!important; width:100%!important; gap:10px;"
        class="pa-4"
      >
        <v-icon icon="ic:baseline-circle" />
        <v-spacer />
        <v-icon icon="codicon:chrome-minimize" />
        <v-icon icon="codicon:chrome-maximize" />
        <v-icon icon="codicon:chrome-close" />
      </v-system-bar>
      <div class="d-flex align-center bg-white pa-1" style="gap:10px;" v-if="props.src">
        <v-icon icon="material-symbols:sync-rounded" />
        <div class="flex-grow-1 py-1 px-3" style="background:#eee; border-radius:30px;">{{ props.src }}</div>
        <v-icon icon="ic:round-star" />
      </div>
    </template>

    <v-system-bar
      v-if="props.type=='mobile'"
      color="#000"
      style="position:static!important; width:100%!important;"
      class="py-5"
    >
      <span class="ms-2">{{ $dayjs().format('HH:mm') }}</span>
      <v-spacer />
      <v-icon icon="mdi-wifi-strength-4" />
      <v-icon icon="mdi-signal" class="ms-2" />
      <v-icon icon="mdi-battery" class="ms-2" />
    </v-system-bar>

    <iframe v-if="props.src" :src="props.src" style="width:100%; height:100%; margin:0; padding:0; border:none;"></iframe>
    <div v-else style="height:100vh;"><slot></slot></div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    type: { type: String, default: 'browser' },
    src: { type: String, default: null },
  });
</script>