import { ref } from 'vue';

export default function() {
  const data = ref({
    ready: false,
    date: false,
    storage: {},
    workingItem: false,
    user: false,
    workspace: false,
  });

  return data;
};