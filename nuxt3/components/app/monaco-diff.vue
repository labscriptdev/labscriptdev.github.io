<script>
  import appMonaco from '@/components/app/monaco';
  import { emmetHTML, emmetCSS, emmetJSX, expandAbbreviation } from 'emmet-monaco-es';

  export default {
    extends: appMonaco,

    props: {
      modified: {
        type: String,
        default: '',
      },
    },

    watch: {
      $props: {
        deep: true,
        handler(props) {
          this.setModel(props.modelValue, props.modified);
          this.editorResize();
        },
      },
    },

    methods: {
      async monacoInit() {
        const loader = await import('@monaco-editor/loader').then(m => m?.default);
        const monaco = await loader.init();
        emmetHTML(monaco, ['html', 'php']);

        let original = monaco.editor.createModel(this.modelValue, this.language);
        let modified = monaco.editor.createModel(this.modified, this.language);

        const editor = monaco.editor.createDiffEditor(this.$refs.monaco);
        editor.setModel({ original, modified });

        this.setModel = (original, modified) => {
          original = monaco.editor.createModel(original, this.language);
          modified = monaco.editor.createModel(modified, this.language);
          editor.setModel({ original, modified });
        };

        this.getEditor = () => editor;
      },
    },
  };
</script>