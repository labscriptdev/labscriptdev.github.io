<template>
  <div>
    <v-select v-model="case" label="Case" :items="cases"></v-select>
    <v-textarea label="Resultado" :model-value="compText" readOnly></v-textarea>
    <div class="d-flex">
      <v-spacer />
      <v-btn color="primary" @click="useClipboard.copy(compText)">Copiar</v-btn>
    </div>

    <app-alert type="snackbar" :model-value="useClipboard.copied">
      Texto copiado
    </app-alert>
  </div>
</template>

<script>
  import { useClipboard } from '@vueuse/core';

  export default {
    props: {
      text: {
        type: String,
        default: '',
      },
    },

    computed: {
      compText() {
        for(let c of this.cases) {
          if (c.value==this.case) {
            return c.call(this.text);
          }
        }
        return this.text;
      },
    },

    data() {
      return {
        useClipboard: useClipboard(),
        case: 'uppercase',
        cases: [
          {
            value: 'uppercase',
            title: 'Maiúsculo',
            call: (value) => {
              return (value || '').toUpperCase();
            },
          },
          {
            value: 'lowercase',
            title: 'Minúsculo',
            call: (value) => {
              return (value || '').toLowerCase();
            },
          },
          {
            value: 'capitalize',
            title: 'Capitalizado',
            call: (value) => {
              return (value || '').replace(/\b[a-z]/g, char => char.toUpperCase());
            },
          },
        ],
      };
    },
  };
</script>