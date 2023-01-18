<template>
  <v-layout class="bg-grey-lighten-3">
    <nuxt-page />

    <div style="position:fixed; bottom:30px; right:30px; z-index:999!important;">
      <v-menu :close-on-content-click="false">
        <div class="mb-4" style="width:350px; max-width:90vh;">
          <v-card>
            <v-text-field
              v-model="filter"
              label="Filtro"
              :hide-details="true"
              class="ma-2"
            />
            <v-divider />
            <div class="pa-2" style="max-height:calc(70vh - 70px); overflow:auto;">
              <v-row no-gutters>
                <v-col
                  v-for="_item in itemsFilter()"
                  cols="6"
                  md="4"
                  class="pa-1"
                >
                  <v-btn block style="height:100px;" :to="_item.to">
                    <div class="text-center">
                      <v-icon>{{ _item.icon }}</v-icon>
                      <div class="my-1"></div>
                      <small style="font-size:8px; white-space:normal;">{{ _item.name }}</small>
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <v-btn
              block
              :href="`https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/demo/index/${$route.path.replace('/demo/', '')}`"
              target="_blank"
              color="primary"
              rounded="0"
            >
              <v-icon>mdi-xml</v-icon>
              <span class="ms-3">Current page source</span>
            </v-btn>
            <v-btn
              block
              to="/"
              rounded="0"
            >
              <v-icon>mdi-home</v-icon>
              <span class="ms-3">Home</span>
            </v-btn>
          </v-card>
        </div>

        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="55"
            flat
          >
            <v-avatar size="50">
              <v-img src="/assets/labscript.dev.png" />
            </v-avatar>
          </v-btn>
        </template>
      </v-menu>
    </div>
  </v-layout>
</template>

<script>
  export default {
    methods: {
      itemsFilter() {
        let filter = this.filter.toLowerCase();
        return this.items.filter(item => {
          return JSON.stringify(item).toLowerCase().includes(filter);
        });
      },
    },
    data() {
      return {
        filter: '',
        items: (() => {
          const showInactive = this.$dev;

          let files = Object.entries(import.meta.glob('./*/*/info.js', {
            import: 'default',
            eager: true,
          }));

          files = files.map(([path, json]) => {
            return {
              active: false,
              icon: false,
              name: '',
              description: '',
              to: '/demo/'+ path.replace(/.+index\/(.+?)\/info.js/g, '$1'),
              ...json
            };
          });

          return files.filter(file => showInactive? true: file.active);
        })(),
      };
    },
  };
</script>