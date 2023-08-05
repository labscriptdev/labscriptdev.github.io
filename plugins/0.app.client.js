import { defineNuxtPlugin } from '#app';

import * as providers from '@/helpers/providers';
import * as filters from '@/helpers/filters';

import axios from 'axios';

import { useStorage } from '@vueuse/core';

export default defineNuxtPlugin(async (nuxtApp) => {

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

	// Providers & filters
	for(let attr in providers) nuxtApp.provide(attr, providers[ attr ]);
	nuxtApp.vueApp.config.globalProperties.$filter = filters;
});