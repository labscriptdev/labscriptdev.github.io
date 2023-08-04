<template>
  <div
    ref="editorRef"
  ></div>
</template>

<script setup>
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
  import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
  import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
  import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution';
  import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
  import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
  import 'monaco-editor/esm/vs/basic-languages/scss/scss.contribution';
  import 'monaco-editor/esm/vs/basic-languages/php/php.contribution';
  
  import { emmetHTML, emmetCSS, emmetJSX, expandAbbreviation } from 'emmet-monaco-es';
  emmetHTML(monaco, ['html', 'php']);

  import { ref, reactive, watch, defineProps, defineEmits, onMounted, nextTick } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [ String ],
      default: '',
    },
    theme: {
      type: [ String ],
      default: 'vs-dark',
    },
    theme: {
      type: [ String ],
      default: 'vs-dark',
    },
    language: {
      type: [ String ],
      default: 'html',
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  let editor;
  const editorRef = ref(null);

  const meta = reactive({
    height: 100,
  });

  watch([ props ], ([ propsNew ]) => {
    if (editor) {
      editor.setValue(propsNew.modelValue);
      setTimeout(monacoResize, 1);
    }
  });

  const monacoResize = () => {
    const width = editorRef.value.offsetWidth;
    const height = editor.getContentHeight();
    editor.layout({ width, height });
    editorRef.value.style.height = `${height}px`;
  };

  onMounted(() => {
    editor = monaco.editor.create(editorRef.value, {
      value: props.modelValue,
      automaticLayout: true,
      scrollBeyondLastLine: false,

      // wordWrap: 'on',
      // wrappingStrategy: 'advanced',
      // minimap: { enabled: false },
      // overviewRulerLanes: 0,

      ...props
    });

    editor.onDidChangeModelContent(() => {
      emit('update:modelVallue', editor.getValue());
      monacoResize();
    });
    
    nextTick(async () => {
      setTimeout(monacoResize, 1);
    });
  });
</script>