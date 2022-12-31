<template>
  <div ref="monaco" style="width:100%; height:300px;"></div>
</template>

<script>
  import { emmetHTML, emmetCSS, emmetJSX, expandAbbreviation } from 'emmet-monaco-es';

  export default {
    props: {
      modelValue: { default: '', type: String },
      language: { default: 'html', type: String },
      readOnly: { default: false, type: Boolean },
      wordWrap: { default: 'off', type: String },
    },

    watch: {
      modelValue(value) {
        if (this.$el.contains(document.activeElement)) return;
        this.setValue(value);
        this.editorResize();
      },
    },

    methods: {
      async monacoInit() {
        const loader = await import('@monaco-editor/loader').then(m => m?.default);
        const monaco = await loader.init();
        emmetHTML(monaco, ['html', 'php']);

        const editor = monaco.editor.create(this.$refs.monaco, {
          value: this.modelValue,
          language: this.language,
          theme: 'vs-dark',
          readOnly: this.readOnly,
          wordWrap: this.wordWrap,
        });

        editor.getModel().onDidChangeContent(evt => {
          this.$emit('update:modelValue', editor.getModel().getValue());
          this.editorResize();
        });

        this.getEditor = () => editor;
      },

      getEditor() { return false; },

      setValue(value) {
        let editor = this.getEditor();
        if (!editor) return;
        if (! editor.getModel().setValue) return;
        editor.getModel().setValue(value);
      },

      editorResize() {
        let editor = this.getEditor();
        if (! editor) return;
        editor.layout();
      },

      onWindowResize() {
        this.editorResize();
      },
    },

    mounted() {
      this.monacoInit();
      setTimeout(() => this.onWindowResize(), 200);
      window.addEventListener('resize', () => this.onWindowResize());
    },

    beforeUnmount() {
      window.addEventListener('resize', () => this.onWindowResize());
    },
  };
</script>