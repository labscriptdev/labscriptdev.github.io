import { ref, watch, onMounted } from 'vue';

export default function(params = {}) {
  const { $dayjs, $axios } = useNuxtApp();

  params = {
    from: 'USD',
    to: 'BRL',
    ...params
  };

  const loading = ref(false);
  const from = ref(params.from);
  const to = ref(params.to);
  const rates = ref([]);

  const converted = (value, code=null) => {
    code = code || to.value;
    return value * rates.value[ code ] || 1;
  };

  const refresh = async () => {
    loading.value = true;
    const { data } = await $axios.get(`https://api.exchangerate.host/latest?base=${from.value}`);
    rates.value = data.rates;
    loading.value = false;
  };

  onMounted(async () => {
    await refresh();
  });

  watch([ from ], async ([ fromNew ]) => {
    await refresh();
  });

  return {
    loading,
    from,
    to,
    converted,
    rates,
  };
};