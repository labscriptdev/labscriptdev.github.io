<template>
  <v-app>
    <v-main>

      <div v-if="page">
        <v-img :src="page.thumb" cover height="300" />
        <v-container>
          <h1>{{ page.title }}</h1>
          <br>
          <content-renderer :value="page" class="page-content" />
        </v-container>
      </div>

      <v-container v-if="!page">
        <h1 class="mb-2">{{ error.message }}</h1>
        <v-btn to="/" variant="tonal">Ir para home</v-btn>
      </v-container>
      
      <v-container>
        <h2 class="mb-2">Blog Posts</h2>
        <div class="d-flex py-1 overflow-auto" style="gap: 25px;">
          <template v-for="_page in pages">
            <div style="width:400px;">
              <v-card width="400">
                <nuxt-link :to="_page._path">
                  <v-img :src="_page.thumb" cover height="250" />
                </nuxt-link>
                <v-card-title>{{ _page.title }}</v-card-title>
                <v-card-text>{{ _page.description }}</v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" :to="_page._path">Ler</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </template>
        </div>
      </v-container>

      <v-sheet theme="dark" class="mt-5">
        <v-container class="d-flex align-center">
          <v-btn to="/" variant="plain">Home</v-btn>
          <v-spacer></v-spacer>
          <div>&copy; 2023 labscript.dev</div>
        </v-container>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script setup>
  const error = useError();
  const route = useRoute();
  const { data: page } = await useAsyncData('hello', () => queryContent(route.path).findOne());
  const pages = (await queryContent('/blog/test').find()).reverse();
</script>

<style>
  .page-content p {
    margin: 10px 0;
  }
</style>