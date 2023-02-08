import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@vueuse/core';

export default function(params = {}) {
  const { $dayjs, $axios } = useNuxtApp();

  params = {
    storageKey: 'clockify',
    dateStart: $dayjs().startOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
    dateFinal: $dayjs().endOf('month').format('YYYY-MM-DDTHH:mm:ss.000z'),
    timeEntryParse: entry => entry,
    ...params
  };

  const dateStart = ref(params.dateStart || null);
  // const _dateStart = () => $dayjs(dateStart.value);

  const dateFinal = ref(params.dateFinal || null);
  // const _dateFinal = () => $dayjs(dateFinal.value);

  const storage = ref(useStorage(params.storageKey, {
    token: '',
    amountPerHour: 13,
    amountCurrency: "BRL",
    amountGoal: 1000,
    currencyFrom: "AUD",
    currencyTo: "BRL",
  }));

  const request = async (params) => {
    return $axios.request({
      ...params,
      url: [ 'https://api.clockify.me/api/v1', params.url.replace(/^\/|\/$/g, '') ].join('/'),
      headers: { 'X-Api-Key': storage.value.token },
    });
  };

  const user = ref({
    loading: false,
    data: false,
  });

  const userLoad = async () => {
    if (!storage.value.token) return;
    user.value.loading = true;
    const { data } = await request({ url: '/user' });
    user.value.data = data;
    user.value.loading = false;
  };
  
  const workspace = ref({
    loading: false,
    selected: false,
    data: [],
  });

  const workspaceLoad = async () => {
    if (!storage.value.token) return;
    workspace.value.loading = true;
    const { data } = await request({ url: '/workspaces' });
    workspace.value.data = data;
    if (data.length==1) {
      workspace.value.selected = data[0];
    }
    workspace.value.loading = false;
  };

  const timeEntry = ref({
    loading: false,
    workedMinutes: 0,
    working: false,
    data: [],
  });

  const timeEntryLoad = async () => {
    if (timeEntry.value.loading) {
      clearTimeout(timeEntry.value.loading);
    }

    timeEntry.value.loading = setTimeout(async () => {
      if (!user.value) return;
      if (!workspace.value.selected) return;
      
      timeEntry.value.loading = true;

      const { data } = await request({
        url: `/workspaces/${workspace.value.selected.id}/user/${user.value.data.id}/time-entries`,
        params: { start: dateStart.value, end: dateFinal.value },
      });

      timeEntry.value.data = data.map(timeEntryParse);
      timeEntry.value.loading = false;
    }, 1000);
  };

  const timeEntryParse = (entry) => {
    entry.workedMinutes = (() => {
      if (!entry.timeInterval.end) {
        return Math.abs($dayjs(entry.timeInterval.start).diff($dayjs(), 'minute'));
      }

      return Math.abs($dayjs(entry.timeInterval.start).diff(entry.timeInterval.end, 'minute'));
    })();

    entry = params.timeEntryParse(entry);
    return entry;
  };

  let _timeEntryInterval;
  const timeEntryInterval = async () => {
    if (_timeEntryInterval) {
      clearTimeout(_timeEntryInterval);
    }

    _timeEntryInterval = setInterval(() => {
      timeEntry.value.data = timeEntry.value.data.map(timeEntryParse);
      let working = timeEntry.value.data.filter(entry => !entry.timeInterval.end);
      timeEntry.value.working = working[0] || false;
      timeEntry.value.workedMinutes = timeEntry.value.data.reduce((total, entry) => {
        return total + entry.workedMinutes;
      }, 0);
    }, 1000);
  };

  const rangeDays = () => {
    let diff = Math.abs($dayjs(dateStart.value).diff(dateFinal.value, 'days'));
    return Array.from(Array(diff+1).keys()).map(days => {
      return $dayjs(dateStart.value).add(days, 'days');
    });
  };

  const ready = computed(() => {
    return user.value.data
      && workspace.value.data.length>=1
      && timeEntry.value.data.length>=1;
  });

  const dates = computed(() => {
    return rangeDays().map((dd) => {

      const entries = timeEntry.value.data.filter((entry) => {
        return $dayjs(entry.timeInterval.start).format('YYYY-MM-DD') == dd.format('YYYY-MM-DD');
      });

      let is = {};
      is.today = $dayjs().format('YYYY-MM-DD') == dd.format('YYYY-MM-DD');
      is.workingDay = ![0, 6].includes(dd.day());

      return {
        date: dd,
        year: dd.format('YYYY'),
        month: dd.format('MM'),
        day: dd.format('DD'),
        is,
        entries,
      };
    });
  });

  const result = computed(() => {
    const workingDays = rangeDays().filter(date => {
      return ![0, 6].includes(date.day());
    });

    let workMinutes = { expected: (60 * 8 * workingDays.length) };
    workMinutes.worked = timeEntry.value.workedMinutes;
    workMinutes.percent = workMinutes.worked / workMinutes.expected * 100;

    return { workMinutes };
  });

  watch([ dateStart, dateFinal ], async ([ dateStartNew, dateFinalNew ]) => {
    await timeEntryLoad();
  });

  onMounted(async () => {
    await userLoad();
    await workspaceLoad();
    await timeEntryLoad();
    await timeEntryInterval();
  });

  onUnmounted(() => {
    if (_timeEntryInterval) {
      clearInterval(_timeEntryInterval);
    }
  });

  return {
    ready,
    dateStart,
    dateFinal,
    storage,
    user,
    userLoad,
    workspace,
    workspaceLoad,
    timeEntry,
    timeEntryLoad,
    dates,
    result,
  };
};