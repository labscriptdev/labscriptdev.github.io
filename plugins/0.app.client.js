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
		defaults: (() => {
			let inputs = {
				density: 'comfortable',
				variant: 'outlined',
			};

			return {
				global: {
					density: 'compact',
				},
				VBtn: { density: 'default' },
				VTextField: { ...inputs },
				VTextarea: { ...inputs },
				VSelect: { ...inputs },
				VCombobox: { ...inputs },
			};
		})(),
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