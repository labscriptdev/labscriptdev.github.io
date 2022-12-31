import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import axios from 'axios';

import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

const log = console.log;

// this.$request({ ...data })
const request = (params = {}) => {
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

export {
  log,
  axios,
  dayjs,
  request,
};