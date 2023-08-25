<template>
  <canvas ref="fabricRef" width="800" height="600" style="width:100%; border:solid 1px red;"></canvas>
  <v-btn
    @click="fabricApp.clipboard.copy()"
    :color="fabricApp.clipboard.copied ? 'success' : null"
  >
    <span class="me-2">Copy</span>
    <v-icon :icon="fabricApp.clipboard.copied ? 'tdesign:check-double' : 'iconamoon:copy-bold'" />
  </v-btn>
  <v-text-field v-if="fabricApp.objects[2]" v-model="fabricApp.objects[2].text" @update:modelValue="fabricApp.getCanvas().renderAll()" />
  <br>
  <img src="https://img.freepik.com/premium-vector/letter-cc-logo-design-abstract-letter-cc-logo-design_219523-125.jpg" alt="" />
  <pre>fabricApp: {{ fabricApp }}</pre>
</template>

<script setup>
  import { fabric } from 'fabric';
  import { useEventListener } from '@vueuse/core';

  import { reactive, ref, onMounted } from 'vue';
  const fabricRef = ref(null);

  const useFabric = (options={}) => {
    let canvas = null;

    options = {
      width: 800,
      height: 600,
      onInit: () => {},
      onPaste: () => {},
      ...options
    };

    const r = reactive({
      ...options,
      objects: [],
      init() {
        canvas = new fabric.Canvas(fabricRef.value);
        fabricApp.initClipboardListener();
        options.onInit({ canvas });
        r.objects = canvas.getObjects();
      },
      initClipboardListener() {
        useEventListener(window, 'paste', (ev) => {
          const file = ev.clipboardData.files[0] || false;
          if (!file) return;

          options.onPaste({ canvas, clipboardData: ev.clipboardData });

          // If is URL
          // fabric.Image.fromURL('https://site.com/image.jpg', (img) => canvas.add(img));

          const reader = new FileReader();
          reader.onload = (ev) => {
            const image = new Image();
            image.src = ev.target.result;
            image.onload = () => {
              const img = new fabric.Image(image);
              img.scaleToWidth(400);
              canvas.add(img);
            };
          };
          reader.readAsDataURL(file);
        });
      },
      getCanvas() {
        return canvas;
      },
      clipboard: {
        copied: false,
        async copy() {
          canvas.getObjects().forEach((obj) => {
            obj.selectable = false;
          });
          fabricRef.value.toBlob((blob) => {
            navigator.clipboard.write([ new ClipboardItem({ "image/png": blob }) ]);
            fabricApp.clipboard.copied = true;
            setTimeout(() => {
              fabricApp.clipboard.copied = false;
            }, 5000);
          });
        },
      },
    });

    return r;
  };

  const fabricApp = useFabric({
    onInit({ canvas }) {
      const centerHeight = 450;
      canvas.add(new fabric.Rect({
        left: 0,
        top: 0,
        width: fabricApp.width,
        height: fabricApp.height,
        fill: '#000',
        selectable: false,
      }));
      canvas.add(new fabric.Rect({
        left: 20,
        top: 20,
        width: fabricApp.width-40,
        height: centerHeight,
        fill: 'transparent',
        stroke: '#fff',
        selectable: false,
      }));
      canvas.add(new fabric.Textbox(`What?!`, {
        fill: '#fff',
        stroke: '#fff',
        left: 0,
        width: fabricApp.width,
        height: 500,
        top: fabricApp.height,
        fontSize: 50,
        textAlign: 'center',
        originY: 'bottom',
        hasControls: false,
        lockMovementX: false,
        lockMovementY: false,
      }));

      setTimeout(() => {
        fabric.Image.fromURL('https://img.freepik.com/premium-vector/letter-cc-logo-design-abstract-letter-cc-logo-design_219523-125.jpg', (img) => {
          const mascara = new fabric.Rect({
            left: 0,
            top: 0,
            width: fabricApp.width-40,
            height: centerHeight,
            fill: 'transparent',
          });
          canvas.add(mascara);

          img.set({
            top: (fabricApp.height/2)-54,
            left: fabricApp.width/2,
            originX: 'center',
            originY: 'center',
          });
          img.clipPath = mascara;
          img.scaleToWidth(centerHeight);
          canvas.add(img);
        });
      }, 500);
    },
  });

  onMounted(() => {
    fabricApp.init();
  });
</script>

<script>
  export default {
    meta: {
      icon: 'mdi-numeric-1',
      name: 'Earthbound',
    },
  };
</script>