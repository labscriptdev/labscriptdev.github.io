<template>
  <div ref="content" contenteditable="true" @keyup="onChange($event)" style="outline:0!important; min-width:20px; min-height:20px;">
    &nbsp;
  </div>
</template>

<script>
  export default {
    props: {
      modelValue: {
        type: [String],
        default: '',
      },
    },

    watch: {
      modelValue(value) {
        if (document.activeElement == this.$el) return;
        this.$refs.content.innerHTML = value;
      },
    },

    methods: {
      onChange(ev) {
        this.$emit('update:modelValue', ev.target.innerHTML);
      },
    },

    mounted() {
      this.$refs.content.innerHTML = this.modelValue;
    },
  };
</script>