<template>
  <v-layout v-resize="onResize">
    <v-navigation-drawer
        v-model="showDrawer"
        :width="drawerWidth"
        elevation="1"
        v-if="drawerShow"
      >
      <slot name="drawer" v-bind="slotBind()"></slot>
    </v-navigation-drawer>
    <v-app-bar elevation="1" ref="header">
      <v-container :fluid="fluid" class="pa-0">
        <div class="d-flex align-center flex-grow-1 px-2" style="gap:10px;">
          <v-btn
            icon="mdi-menu"
            @click="showDrawer=true"
            v-if="!useDisplay.lgAndUp && drawerShow"
          ></v-btn>
          <!-- <v-app-bar-title v-if="title">{{ title }}</v-app-bar-title> -->
          <slot name="header" v-bind="slotBind()"></slot>
        </div>
      </v-container>
    </v-app-bar>
    <v-main>
      <div class="pa-3" :style="`height:calc(100vh - ${headerHeight}px); overflow:auto;`">
        <v-container :fluid="fluid" class="pa-0" :style="containerStyle">
          <v-card class="mt-1" v-if="containerCard">
            <template v-if="title">
              <v-card-title>
                {{ title }}
              </v-card-title>
              <v-divider />
            </template>
            <v-card-text>
              <slot v-bind="slotBind()"></slot>
            </v-card-text>
          </v-card>

          <template v-if="!containerCard">
            <slot v-bind="slotBind()"></slot>
          </template>
        </v-container>
      </div>
    </v-main>
  </v-layout>
</template>


<script>
  import { useDisplay } from 'vuetify';

  export default {
    props: {
      title: {
        type: [ Boolean, String ],
        default: false,
      },
      drawerShow: {
        type: Boolean,
        default: true,
      },
      drawerWidth: {
        type: [Number],
        default: 300,
      },
      fluid: {
        type: Boolean,
        default: true,
      },
      containerCard: {
        type: Boolean,
        default: true,
      },
      containerStyle: {
        type: Object,
        default: () => ({}),
      },
    },

    methods: {
      slotBind() {
        return {};
      },
      onResize() {
        this.headerHeight = this.$refs.header.$el.offsetHeight;
      },
    },

    data: () => ({
      useDisplay: useDisplay(),
      showDrawer: true,
      headerHeight: 50,
    }),
  };
</script>