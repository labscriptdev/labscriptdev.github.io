<template>
  <v-img :src="qrcodeUrl" alt=""></v-img>
</template>

<script>
  export default {
    props: {
        modelValue: {default:""},
        size: {default:"300x300"},
    },
    data() {
      return {
        qrcodeUrl: this.getQrcodeUrl(this.modelValue),
        timeout: false,
      };
    },
    watch: {
      modelValue(value) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.qrcodeUrl = this.getQrcodeUrl(value);
        }, 1000);
      },
    },
    methods: {
      getQrcodeUrl(text) {
        return `https://chart.googleapis.com/chart?cht=qr&chs=${this.size}&chl=${text}`;
      },
    },
  };
</script>