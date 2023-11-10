<template>
  <div class="v-content" @click="onClick()">
    <span class="v-content-prepend" v-html="prepend"></span>
    <span
      class="v-content-text"
      :class="{'v-content-text-empty': isEmpty}"
      ref="content"
      contenteditable="true"
      :data-placeholder="placeholder"
      @keyup="onChange($event)"
      @focus="setFocused($event)"
      @blur="setFocused($event)"
    >&nbsp;</span>
    <span class="v-content-append" v-html="append"></span>
  </div>
</template>

<script>
  export default {
    props: {
      modelValue: {
        type: [String],
        default: '',
      },
      placeholder: {
        type: [String],
        default: '',
      },
      prepend: {
        type: [String],
        default: '',
      },
      append: {
        type: [String],
        default: '',
      },
    },

    watch: {
      modelValue(value) {
        // if (this.$el.contains(document.activeElement)) return;
        if (this.focused) return;
        this.$refs.content.innerHTML = value;
        this.setIsEmpty();
      },
    },

    methods: {
      onChange(ev) {
        this.$emit('update:modelValue', ev.target.innerHTML);
        this.setIsEmpty();
      },
      onClick() {
        this.$refs.content.focus();
      },
      setFocused(ev) {
        this.focused = ev.type == 'focus';
      },
      setIsEmpty() {
        const text = (this.$refs.content ? this.$refs.content.innerHTML : '');
        if (text=='<br>') return false;
        this.isEmpty = !text;
      },
    },

    data() {
      return {
        isEmpty: false,
        focused: false,
      };
    },

    mounted() {
      this.$refs.content.innerHTML = this.modelValue;
      this.setIsEmpty();
    },
  };
</script>

<style>
  /* .v-content {}
  .v-content-prepend {}
  .v-content-append {} */

  .v-content-text {
    display: inline-block;
    outline: 0 !important;
    border: none !important;
    box-shadow: none !important;
    min-width: 20px;
    min-height: 20px;
  }

  .v-content-text-empty::after {
    content: attr(data-placeholder);
  }
</style>