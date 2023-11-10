<template>
  <div>
    <v-dialog
      v-if="['v-dialog', 'dialog', 'alert', 'modal'].includes(this.type)"
      :model-value="modelValue"
      :timeout="-1"
    >
      <div style="display:inline-block; margin:0 auto;">
        <v-card width="500" :color="dataType.color">
          <v-card-text>
            <div class="d-flex">
              <v-icon>{{ dataType.icon }}</v-icon>
              <div class="flex-grow-1 ms-3">
                <slot></slot>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="close()">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>

    <v-snackbar
      v-if="['v-snackbar', 'snackbar'].includes(this.type)"
      :model-value="modelValue"
      multi-line
      :color="dataType.color"
      :timeout="-1"
    >
      <div class="d-flex">
        <v-icon>{{ dataType.icon }}</v-icon>
        <div class="flex-grow-1 ms-3">
          <slot></slot>
        </div>
      </div>
      <template #actions>
        <v-btn @click="close()">Ok</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      modelValue: {
        type: [ Boolean, Number, String, Array, Object ],
        default: true,
      },

      type: {
        type: String,
        default: 'v-dialog', // v-dialog | v-snackbar
      },
      
      color: {
        type: String,
        default: 'default',
      },
    },

    methods: {
      close() {
        this.$emit('update:modelValue', false);
      },
    },

    computed: {
      dataType() {
        let color = this.color, icon = 'mdi-check';
        if (this.type=='error') {
          icon = 'mdi-alert-circle';
        }
        return { color, icon };
      },
    },
  };
</script>