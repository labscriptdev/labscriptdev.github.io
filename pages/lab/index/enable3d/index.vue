<template>
  <app-layout :container-card="false" container-width="100%">
    <threejs-scene v-model="test" #default="{ game }">
      <!-- <pre style="position:absolute; bottom:0; right:0;">{{ game.car.getSpeed() }}</pre> -->
    </threejs-scene>
    <a href="">Refresh</a>
    <!-- <app-dd v-model="test"></app-dd> -->
    
    <v-text-field v-model="test.name" />
    <template v-if="test.track">
      <!-- <div class="d-flex">
        <v-text-field label="x" type="number" v-model.number="test.track.position.x" />
        <v-text-field label="y" type="number" v-model.number="test.track.position.y" />
        <v-text-field label="z" type="number" v-model.number="test.track.position.z" />
      </div> -->
      <!-- <pre>test.input: {{ test.input }}</pre> -->
    </template>

    <!-- <div ref="game" id="game" style="width:100%; height:600px;"></div> -->
    <!-- <pre>{{ game }}</pre> -->
  </app-layout>
</template>

<script>
  import Test from './Test';

  export default {
    data: () => ({
      test: Test,
    }),
  };
</script>