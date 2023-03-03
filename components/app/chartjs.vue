<template>
  <div style="position:relative;">
    <canvas ref="canvas" style="width:100%; height:100%;"></canvas>
  </div>
</template>

<script setup>
  import { ref, defineProps, watch, onMounted, defineEmits } from 'vue';
  import Chart from 'chart.js/auto';

  const canvas = ref(null);
  const emit = defineEmits(['load']);

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
    emit('chart', chart);
  });

  watch([ props ], ([ propsNew ]) => {
    if (!canvas.value || !chart) return;
    chart.options = { ...propsNew.options };
    chart.data = { ...propsNew.data };
    chart.options.animation = false;
    chart.options.transitions.active.animation.duration = 0;
    chart.update();
    emit('chart', chart);
  });
</script>