<template>
  <v-app>
    <div class="d-flex flex-column" style="height:100vh; overflow:auto;">
      <v-app-bar flat>
        <v-container class="d-flex align-center">
          <v-avatar
            class="mr-10"
            color="grey-lighten-3"
            size="40"
          >
            <v-img src="/assets/labscript.dev.png" />
          </v-avatar>
  
          <v-btn
            v-for="(_link, i) in headerLinks"
            :key="i"
            variant="text"
            :to="_link.to"
          >
            {{ _link.name }}
          </v-btn>
        </v-container>
      </v-app-bar>

      <div class="flex-grow-1">
        <v-container>
          Aaa
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      headerLinks: [
        {
          name: 'Tools',
          to: '/tool',
        },
      ],
    }),
  }
</script>