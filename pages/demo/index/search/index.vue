<template>
  <app-layout title="Buscas">
    <v-row>
      <v-col cols="12" lg="6">
        <v-text-field
          label="Termo"
          v-model="params.search"
          append-inner-icon="mdi-magnify"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <v-text-field
          label="Local"
          v-model="params.place"
          append-inner-icon="mdi-map-marker"
        />
      </v-col>
    </v-row>

    <v-row>
      <template v-for="_search in result.searchs">
        <v-col cols="12" lg="2">
          <v-btn
            class="d-flex align-center justify-center"
            style="display:block; width:100%; height:100px;"
            :href="_search.url"
            target="_blank"
          >
            <div class="text-center">
              <v-icon class="text-h4">{{ _search.icon }}</v-icon>
              <div class="mt-3">{{ _search.name }}</div>
            </div>
          </v-btn>
        </v-col>
      </template>
    </v-row>
  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        params: {
          search: '',
          place: '',
        },
      };
    },

    computed: {
      result() {
        const search = encodeURIComponent(this.params.search);
        const place = encodeURIComponent(this.params.place);
        const query = encodeURIComponent([this.params.search, this.params.place].filter(item => !!item).join(' '));

        const categories = [
          {id:'general', name:'Geral'},
          {id:'people', name:'Pessoas'},
          {id:'shop', name:'Compras'},
          {id:'dev', name:'Desenvolvimento'},
          {id:'social', name:'Redes sociais'},
        ];

        const searchs = [
          {
            icon: 'mdi-google',
            name: 'Google',
            url: `https://www.google.com/search?q=${query}`,
            categories: ['general'],
          },
          {
            icon: 'mdi-twitter',
            name: 'Twitter',
            url: `https://twitter.com/search?q=${query}&src=typed_query`,
            categories: ['social'],
          },
          {
            icon: 'mdi-facebook',
            name: 'Facebook',
            url: `https://www.facebook.com/search/people/?q=${query}`,
            categories: ['social'],
          },
          {
            icon: 'mdi-linkedin',
            name: 'Linkedin',
            url: `https://www.linkedin.com/search/results/all/?keywords=${query}&origin=GLOBAL_SEARCH_HEADER&sid=9Do`,
            categories: ['social'],
          },
          {
            icon: 'mdi-cart',
            name: 'OLX',
            url: `https://www.olx.com.br/brasil?q=${query}`,
            categories: ['shop'],
          },
          {
            icon: 'mdi-xml',
            name: 'Can I Use?',
            url: `http://caniuse.com/#search=${search}`,
            categories: ['dev'],
          },
          {
            icon: 'mdi-codepen',
            name: 'Codepen',
            url: `https://codepen.io/search/pens?q=${search}`,
            categories: ['dev'],
          },
        ];

        return {
          categories,
          searchs,
        };
      },
    },
  };
</script>