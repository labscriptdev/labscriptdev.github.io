<!--
  yarn add vuedraggable@next -D
-->
<template>
  <draggable
    :model-value="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    class="app-draggable"
    handle=".app-draggable__handle"
    item-key="uuid"
  >
    <template #item="bind">
      <div class="d-flex align-center my-2">
        <div class="app-draggable__handle py-4 pe-3">
          <v-icon icon="mdi-dots-grid" />
        </div>
        <div class="flex-grow-1">
          <slot name="item" v-bind="slotBind({ item: bind.element, index: bind.index })"></slot>
        </div>
        <v-btn
          icon="mdi-close" stacked rounded="0" size="55" variant="text"
          @click="act.remove(bind)"
        />
      </div>
    </template>
    
    <template #footer>
      <v-btn
        block class="w-100 bg-grey-lighten-4"
        rounded="0" size="60"
        variant="text"
        @click="act.add()"
      >
        Add
      </v-btn>
    </template>
  </draggable>
</template>

<script setup>
  import draggable from 'vuedraggable';
  import { reactive, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [ Array ],
      default: () => ([]),
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const act = reactive({
    add() {
      const items = props.modelValue;
      const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) ).toString(16) );
      items.push({ uuid });
      emit('update:modelValue', items);
    },
    remove(bind) {
      const items = props.modelValue;
      const index = items.indexOf(bind.element);
      items.splice(index, 1);
      emit('update:modelValue', items);
    },
  });

  const slotBind = (merge={}) => {
    return { ...merge };
  };
</script>

<style>
  .app-draggable__handle {
    cursor: grab;
  }
</style>