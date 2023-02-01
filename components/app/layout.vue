<template>
  <v-app>
    <!-- Main Drawer -->
    <v-navigation-drawer
      :width="drawerWidth"
      v-if="$slots.drawer"
      v-model="drawer"
    >
      <div style="height:100vh; overflow:auto;">
        <slot name="drawer"></slot>
      </div>
    </v-navigation-drawer>

    <!-- Main bar -->
    <v-app-bar elevation="1" v-if="$slots.appbar || $slots.drawer || title">
      <v-container class="d-flex align-center" :style="{maxWidth: containerWidth}">
        <v-app-bar-nav-icon
          class="d-lg-none me-3"
          @click="drawer=true"
          v-if="$slots.drawer"
        />
        <v-toolbar-title v-if="title">{{ title }}</v-toolbar-title>
        <slot name="appbar"></slot>
      </v-container>
    </v-app-bar>

    <!-- Content -->
    <v-main class="bg-grey-lighten-2" style="height:100vh; overflow:auto!important;">
      <v-container
        class="pa-0 pa-lg-5 mx-auto"
        :style="{maxWidth: containerWidth}"
        style="height:100%; overflow:auto; overflow:auto!important;"
      >
        <v-card
          :style="{height: (useDisplay.lgAndUp? 'auto': '100%')}"
          v-if="containerCard"
        >
          <v-card-text>
            <slot></slot>
          </v-card-text>
        </v-card>

        <div
          v-if="!containerCard"
          :style="{height: (useDisplay.lgAndUp? 'auto': '100%')}"
        >
          <slot></slot>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
  import { useDisplay } from 'vuetify';

  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      drawerWidth: {
        type: String,
        default: '300',
      },
      containerWidth: {
        type: String,
        default: '1280px',
      },
      containerCard: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        drawer: true,
        useDisplay: useDisplay(),
      };
    },
  };
</script>

<style>
/* width */
::-webkit-scrollbar {width: 5px;}
::-webkit-scrollbar-track {background: transparent;}
::-webkit-scrollbar-thumb {background-color: #ffffff77;}
/* ::-webkit-scrollbar-thumb:hover {background: #70707088;} */
</style>