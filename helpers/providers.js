import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';


// this.$axios
import axiosRequest from 'axios';
export const axios = axiosRequest;


// this.$dayjs
import dayjsImport from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjsImport.extend(localeData);
import dayjsUTC from 'dayjs/plugin/utc';
dayjsImport.extend(dayjsUTC);
export const dayjs = dayjsImport;


// this.$dev
export const dev = process.env.NODE_ENV !== 'production';


// this.$log
export const log = console.log;


// this.$request({ ...data })
export const request = (params = {}) => {
  const loading = ref(false);
  const response = ref((() => {
    if (Array.isArray(params.response)) {
      return [ ...params.response ];
    }
    
    if (typeof params.response=='object') {
      return { ...params.response };
    }

    if (typeof params.response=='function') {
      return params.response();
    }

    return false;
  })());

  ['params', 'data'].forEach(attr => {
    if (typeof params[ attr ] == 'function') {
      params[ attr ] = params[ attr ]();
    }
  });

  const submit = useDebounceFn(async () => {
    if (typeof params.onBeforeRequest == 'function') {
      const test = params.onBeforeRequest();
      if (!test) return;
    }

    ['params', 'data', 'url'].forEach(attr => {
      if (typeof params[ attr ] == 'function') {
        params[ attr ] = params[ attr ]();
      }
    });

    loading.value = true;
    let { data } = await axios.request(params);
    if (typeof params.onResponse=='function') {
      data = params.onResponse(data);
    }
    response.value = data;
    loading.value = false;
  }, params.debounce || 1000);
  
  if (params.autoSubmit) {
    submit();
  }

  return { ...params, loading, submit, response };
};


// this.$debounce(() => {}, 1000)
export const debounce = (callback, time=1000) => {
  const debid = 'debounce_'+ btoa(callback.toString());
  if (window[debid]) clearTimeout(window[debid]);
  window[debid] = setTimeout(callback, time);
};