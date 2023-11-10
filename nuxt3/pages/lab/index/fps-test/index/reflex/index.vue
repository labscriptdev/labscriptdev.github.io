<template>
  <div>

    <div v-if="!reflexTest.started">
      <v-btn @click="reflexTest.start()">Clique para começar</v-btn>
    </div>

    <div v-if="reflexTest.started">
      <div>Clique no botão quando ficar verde o mais rápido o possível</div>
      <v-btn v-if="!reflexTest.canClick">Atenção</v-btn>
      <v-btn v-if="reflexTest.canClick" @click="reflexTest.stop()">Vai!</v-btn>
    </div>
    
    <div v-if="reflexTest.clickTime && !reflexTest.canClick">
      <pre>reflexTest: {{ reflexTest }}</pre>
    </div>

    
    <!-- <pre>reflexTest: {{ reflexTest }}</pre> -->
  </div>
</template>

<script setup>
  import { reactive } from 'vue';

  const useReflexTest = () => {
    const r = reactive({
      started: false,
      canClick: false,
      clickTime: 0,
      clickInterval: false,
      start() {
        r.started = true;
        r.canClick = false;
        r.clickTime = 0;
        setTimeout(() => {
          r.canClick = true;
          r.clickInterval = setInterval(() => {
            r.clickTime++;
          }, 0);
        }, Math.round(Math.random()*5000));
      },
      stop() {
        if (r.clickInterval) {
          clearInterval(r.clickInterval);
          r.clickInterval = false;
          
        }
        r.started = false;
        r.canClick = false;
      },
    });

    return r;
  };

  const reflexTest = useReflexTest();
</script>

<script>
  export default {
    meta: {
      icon: false,
      name: 'Reflexo',
    },
  };
</script>