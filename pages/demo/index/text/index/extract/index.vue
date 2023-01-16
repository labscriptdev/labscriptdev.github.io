<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <template v-for="_type in extractorTypes">
          <v-checkbox
            :label="_type.title"
            v-model="params.extractors"
            :value="_type.value"
            :hide-details="true"
          />
        </template>
      </v-col>
      <v-col cols="12" md="8">
        <v-alert type="warning" v-if="params.extractors.length==0">Selecione opções</v-alert>
        <template v-for="_res in compResults">
          <v-card :title="_res.title" class="mb-2">
            <v-card-text>
              <pre
                v-if="_res.results.length>0"
                class="pa-3 rounded bg-blue-grey-lighten-5"
              >{{ _res.results.join("\n") }}</pre>
              <div v-if="_res.results.length==0">Nenhum encontrado</div>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
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
      compResults() {
        let results = [];

        for(let type of this.extractorTypes) {
          if (this.params.extractors.includes(type.value)) {
            results.push({
              title: type.title,
              results: type.call(this.text),
            });
          }
        }

        return results;
      },
    },

    data() {
      return {
        useClipboard: useClipboard(),
        params: {
          extractors: [],
        },
        extractorTypes: [
          {
            value: 'link',
            title: 'Links',
            call: (text) => {
              const r = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
              return [ ...new Set( text.match(r) || [] ) ];
            },
          },
          {
            value: 'email',
            title: 'E-mails',
            call: (text) => {
              const r = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
              return [ ...new Set( text.match(r) || [] ) ];
            },
          },
        ],
      };
    },
  };
</script>