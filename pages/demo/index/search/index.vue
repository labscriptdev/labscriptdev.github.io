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

    <v-table>
      <colgroup>
        <col width="200px">
        <col width="*">
      </colgroup>
      <tbody>
        <tr v-for="_search in result.searchs">
          <td>{{ _search.name }}</td>
          <td><a :href="_search.url" target="_blank" style="color:#444!important;">{{ _search.url }}</a></td>
        </tr>
      </tbody>
    </v-table>
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
            name: 'Google',
            url: `https://www.google.com/search?q=${query}`,
            categories: ['general'],
          },
          {
            name: 'Twitter',
            url: `https://twitter.com/search?q=${query}&src=typed_query`,
            categories: ['social'],
          },
          {
            name: 'Facebook',
            url: `https://www.facebook.com/search/people/?q=${query}`,
            categories: ['social'],
          },
          {
            name: 'Linkedin',
            url: `https://www.linkedin.com/search/results/all/?keywords=${query}&origin=GLOBAL_SEARCH_HEADER&sid=9Do`,
            categories: ['social'],
          },
          {
            name: 'OLX',
            url: `https://www.olx.com.br/brasil?q=${query}`,
            categories: ['shop'],
          },
          {
            name: 'Can I Use?',
            url: `http://caniuse.com/#search=${search}`,
            categories: ['dev'],
          },
          {
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