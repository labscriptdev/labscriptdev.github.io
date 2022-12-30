import { defineNuxtPlugin } from '#app';
import axios from 'axios';

// import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as vuetifyComponents from 'vuetify/components';
import * as vuetifyDirectives from 'vuetify/directives';

export default defineNuxtPlugin(async (nuxtApp) => {

	// Vuetify
	nuxtApp.vueApp.use(createVuetify({
		components: vuetifyComponents,
		directives: vuetifyDirectives,
		icons: { defaultSet: 'mdi' },
		defaults: {
      global: {
        density: 'compact',
      },
      VBtn: { density: 'default' },
      VTextField: { density: 'default' },
      VTextarea: { density: 'default' },
      VSelect: { density: 'default' },
    },
		theme: {
			defaultTheme: 'light',
			themes: {
				light: {
					dark: false,
					colors: {},
				},
				dark: {
					dark: true,
					colors: {},
				},
			},
		},
	}));


	// Axios
	// axios.interceptors.request.use(config => {
	// 	const runtimeConfig = useRuntimeConfig();
	// 	return config;
	// });


	// Providers
	nuxtApp.provide('axios', axios);
	nuxtApp.provide('log', console.log);
});