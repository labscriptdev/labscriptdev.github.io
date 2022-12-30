<template>
  <v-app id="inspire">
    <div style="position:sticky; top:0;">
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
    </div>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <div
          v-for="n in 200"
          :key="n"
        >
          Text {{ n }}
        </div>
      </v-container>
    </v-main>
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