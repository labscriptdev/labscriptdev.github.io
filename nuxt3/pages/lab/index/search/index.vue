<template>
  <app-layout title="Buscas">
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="search.params.category"
          label="Categoria"
          :items="search.categories"
          item-title="name"
          item-value="id"
          append-inner-icon="tabler:category-filled"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Busca"
          v-model="search.params.term"
          append-inner-icon="mdi-magnify"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Localização"
          v-model="search.params.place"
          append-inner-icon="mdi-map-marker"
        />
      </v-col>
    </v-row>

    <v-row>
      <template v-for="r in search.results">
        <v-col cols="3">
          <v-btn block :href="r.url" target="_blank" height="50">
            <v-icon :icon="r.icon" />
            <span class="ms-2">{{ r.name }}</span>
          </v-btn>
        </v-col>
      </template>
    </v-row>
  </app-layout>
</template>

<script setup>
import { reactive, computed } from "vue";

const search = reactive({
  params: {
    term: "",
    place: "",
    category: "all",
  },
  categories: [
    { id: "all", name: "Todos" },
    { id: "people", name: "Pessoas" },
    { id: "shop", name: "Compras" },
    { id: "dev", name: "Desenvolvimento" },
    { id: "social", name: "Redes sociais" },
    { id: "job", name: "Vagas de Emprego" },
  ],
  results: computed(() => {
    const slugify = (text) =>
      text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");

    const { term, place, category } = search.params;
    const termSlug = slugify(term);
    const placeSlug = slugify(place);

    // prettier-ignore
    const searchs = [
      {
        icon: "mdi-google",
        name: "Google",
        url: `https://www.google.com/search?q=${term}`,
        categories: ["general"],
      },
      {
        icon: "mdi-twitter",
        name: "Twitter",
        url: `https://twitter.com/search?q=${term}&src=typed_query`,
        categories: ["social"],
      },
      {
        icon: "mdi-facebook",
        name: "Facebook",
        url: `https://www.facebook.com/search/people/?q=${term}`,
        categories: ["social", "people"],
      },
      {
        icon: "mdi-linkedin",
        name: "Linkedin",
        url: `https://www.linkedin.com/search/results/all/?keywords=${term}&origin=GLOBAL_SEARCH_HEADER&sid=9Do`,
        categories: ["social", "people"],
      },
      {
        icon: "mdi-cart",
        name: "OLX",
        url: `https://www.olx.com.br/brasil?q=${term}`,
        categories: ["shop"],
      },
      {
        icon: "mdi-xml",
        name: "Can I Use?",
        url: `http://caniuse.com/#search=${term}`,
        categories: ["dev"],
      },
      {
        icon: "mdi-codepen",
        name: "Codepen",
        url: `https://codepen.io/search/pens?q=${term}`,
        categories: ["dev"],
      },
      {
        icon: "ic:round-work",
        name: "Vagas PJ",
        url: `https://vagaspj.com.br/?sfid=421&_sf_s=${term}&_sfm_cidade=${place}`,
        categories: ["job"],
      },
      {
        icon: "ic:round-work",
        name: "Trabalha Brasil",
        url: `https://www.trabalhabrasil.com.br/vagas-empregos-em-${placeSlug}/${termSlug}`,
        categories: ["job"],
      },
      {
        icon: "ic:round-work",
        name: "Catho",
        url: `https://www.catho.com.br/vagas/${termSlug}/${placeSlug}/`,
        categories: ["job"],
      },
      {
        icon: "ic:round-work",
        name: "Glassdor",
        url: `https://www.glassdoor.com.br/Vaga/${placeSlug}-${termSlug}-vagas-SRCH_IL.0,34_IC2514646_KO35,51.htm`,
        categories: ["job"],
      },
    ];

    return searchs.filter((s) => {
      if (category == "all") return true;
      return s.categories.includes(category);
    });
  }),
});
</script>

<script>
export default {
  meta: {
    active: true,
    icon: "mdi-magnify",
    name: "Busca global",
    description:
      "Ferramenta para auxiliar na busca de qualquer coisa: de pessoas à produtos",
    source:
      "https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/search",
  },
};
</script>
