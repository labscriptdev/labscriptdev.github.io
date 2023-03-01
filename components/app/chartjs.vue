<template>
  <div style="position:relative;">
    <canvas ref="canvas" style="width:100%; height:100%;"></canvas>
  </div>
</template>

<script setup>
  import { ref, defineProps, watch, onMounted } from 'vue';
  import Chart from 'chart.js/auto';

  const canvas = ref(null);

  const props = defineProps({
    type: {
      type: [ String ],
      default: 'bar',
    },
    data: {
      type: [ Object ],
      default: () => ({}),
    },
    options: {
      type: [ Object ],
      default: () => ({}),
    },
  });

  let chart;

  onMounted(() => {
    chart = new Chart(canvas.value, {
      type: props.type,
      data: props.data,
      options: props.options,
    });
  });

  watch([ props ], ([ propsNew ]) => {
    if (!canvas.value || !chart) return;
    chart.options = { ...propsNew.options };
    chart.data = { ...propsNew.data };
    chart.update();
  });
</script>