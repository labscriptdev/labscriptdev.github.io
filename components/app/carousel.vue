<template>
  <div
    :class="[
      'app-carousel',
      (props.actionsAbsolute ? 'app-carousel--actions-absolute' : null),
      `app-carousel--orientation-${props.orientation}`,
    ]"
  >
    <button
      v-if="props.actionsShow"
      class="app-carousel__prev"
      @click="scrollTo(-1)"
    >
      <slot name="prev">
        <div style="padding:0 15px;">Prev</div>
      </slot>
    </button>

    <div
      class="app-carousel__content"
      :style="`gap: ${props.gap};`"
      ref="contentRef"
      @wheel="wheelHandler($event)"
    >
      <slot name="default"></slot>
    </div>

    <button
      v-if="props.actionsShow"
      class="app-carousel__next"
      @click="scrollTo(1)"
    >
      <slot name="next">
        <div style="padding:0 15px;">Next</div>
      </slot>
    </button>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    gap: {
      type: [ String ],
      default: '25px',
    },
    orientation: {
      type: [ String ],
      default: 'horizontal',
    },
    actionsAbsolute: {
      type: [ Boolean ],
      default: false,
    },
    actionsShow: {
      type: [ Boolean ],
      default: true,
    },
    scrollSize: {
      type: [ Number ],
      default: null,
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const contentRef = ref(null);

  const scrollTo = (direction) => {
    if (props.orientation=='horizontal') {
      const itensWidthAvg = props.scrollSize || (() => {
        let itensWidthAvg = [];
        Array.from(contentRef.value.children).map((elem) => { itensWidthAvg.push(elem.offsetWidth); });
        return itensWidthAvg.reduce((valuePrev, value) => value+valuePrev, 0) / itensWidthAvg.length;
      })();
      
      const scrollAmount = contentRef.value.scrollLeft + (itensWidthAvg * direction);
      contentRef.value.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }

    else if (props.orientation=='vertical') {
      const itensWidthAvg = props.scrollSize || (() => {
        let itemsHeightAvg = [];
        Array.from(contentRef.value.children).map((elem) => { itemsHeightAvg.push(elem.offsetHeight); });
        return itemsHeightAvg.reduce((valuePrev, value) => value+valuePrev, 0) / itemsHeightAvg.length;
      })();

      const scrollAmount = contentRef.value.scrollTop + (itemsHeightAvg * direction);
      contentRef.value.scrollTo({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const wheelHandler = (ev) => {
    ev.preventDefault();
    scrollTo(ev.deltaY > 0 ? 1 : -1);
  };

  defineExpose({ scrollTo });
</script>

<style>
  /* Horizontal */
  .app-carousel--orientation-horizontal {
    position: relative;
    display: flex;
    width: 100%;
  }
  .app-carousel--orientation-horizontal .app-carousel--actions-absolute .app-carousel__prev {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
  .app-carousel--orientation-horizontal .app-carousel--actions-absolute .app-carousel__next {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
  }
  .app-carousel--orientation-horizontal .app-carousel__content {
    flex-grow: 1;
    max-width: 100%;
    display: flex;
    overflow: auto;
    scroll-snap-type: x mandatory;
  }
  .app-carousel--orientation-horizontal .app-carousel__content::-webkit-scrollbar {
    display: none;
  }
  .app-carousel--orientation-horizontal .app-carousel__content > * {
    text-align: center;
    scroll-snap-align: center;
    flex: none;
  }

  /* Vertical */
  .app-carousel--orientation-vertical .app-carousel__content {
    flex-grow: 1;
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    scroll-snap-type: y mandatory;
  }
  .app-carousel--orientation-vertical .app-carousel__content > * {
    scroll-snap-align: center;
    flex: none;
  }
  .app-carousel--orientation-vertical .app-carousel__prev {
    display: none !important;
  }
  .app-carousel--orientation-vertical .app-carousel__next {
    display: none !important;
  }
</style>