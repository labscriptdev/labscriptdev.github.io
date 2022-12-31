import { defineNuxtPlugin } from '#app';

import * as providers from '@/helpers/providers';

import axios from 'axios';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as vuetifyComponents from 'vuetify/components';
import * as vuetifyDirectives from 'vuetify/directives';

import { useStorage } from '@vueuse/core';

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
	axios.interceptors.request.use(config => {
		// const runtimeConfig = useRuntimeConfig();

		if (config.url.startsWith('clockify://')) {
			const clockifyStorage = useStorage('clockify', {});
			config.url = config.url.replace('clockify:/', 'https://api.clockify.me/api/v1');
			config.headers['X-Api-Key'] = clockifyStorage.value.token || '';
		}

		return config;
	});

	// Providers
	for(let attr in providers) {
		nuxtApp.provide(attr, providers[ attr ]);
	}
});