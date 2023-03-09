<template>
  <v-app>

    <!-- Main Drawer -->
    <v-navigation-drawer
      :width="$slots.drawer ? drawerWidth : 60"
      v-model="drawer"
    >
      <div class="d-flex">
        <div
          class="bg-grey-darken-4"
          style="height:100vh; max-width:60px; overflow:auto;"
          >
          <v-list density="compact">
            <v-list-item
              v-for="p in pages"
              :key="p.name"
              :to="`/lab/${p.slug}`"
            >
              <template #prepend>
                <v-icon>{{ p.icon }}</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </div>
        <div
          class="flex-grow-1"
          style="max-height:100vh; overflow:auto;"
          v-if="$slots.drawer"
        >
          <slot name="drawer"></slot>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Main bar -->
    <v-app-bar elevation="1" v-if="$slots.appbar || $slots.drawer || title">
      <v-container class="d-flex align-center" :style="{maxWidth: containerWidth}">
        <v-app-bar-nav-icon
          class="d-lg-none me-3"
          @click="drawer=true"
        />
        <v-toolbar-title v-if="title">{{ title }}</v-toolbar-title>
        <slot name="appbar"></slot>
      </v-container>
    </v-app-bar>

    <!-- Content -->
    <v-main class="bg-grey-lighten-2" style="height:100vh; position:relative; overflow:auto!important;">
      <v-container
        class="pa-0 pa-lg-5 mx-auto"
        :style="{maxWidth: containerWidth}"
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
        default: '350',
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
        pages: (() => {
          let files = Object.entries(import.meta.glob('@/pages/lab/index/*/*.vue', {
            import: 'default',
            eager: true,
            // as: 'raw',
          }));

          return files
            .filter(([path, file]) => !!file.meta)
            .map(([path, file]) => {
              return {
                slug: path.split('/').at(-2).replace(/^index$/g, ''),
                icon: 'mdi-circle',
                name: 'Default',
                active: false,
                order: 0,
                ...(file.meta || {})
              };
            })
            .sort((a, b) => {
              if (a.order < b.order) return -1;
              if (a.order > b.order) return 1;
              return 0;
            });
        })(),
      };
    },
  };
</script>
