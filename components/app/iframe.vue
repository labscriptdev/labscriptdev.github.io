<template>
  <div style="position:relative;">
    <div ref="content"><slot></slot></div>
    <div ref="style" style="height:1px; overflow:hidden;"><slot name="style"></slot></div>
    <iframe ref="iframe" src="" style="width:100%; height:100%; border:none;"></iframe>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';

  const content = ref(null);
  const style = ref(null);
  const iframe = ref(null);
  
  onMounted(() => {
    setTimeout(() => {
      const fragment = document.createDocumentFragment();
      fragment.appendChild(content.value);
      fragment.appendChild(Object.assign(document.createElement('style'), {
        innerHTML: style.value.innerText,
      }));
  
      iframe.value.contentWindow.document.body.appendChild(fragment);
    }, 100);
  });

  defineExpose({
    getContent() {
      return content;
    },
    getIframe() {
      return iframe;
    },
  });
</script>