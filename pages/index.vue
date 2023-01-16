<template>
  <v-app class="bg-blue-grey-darken-4">
    <div class="d-flex align-center justify-center h-100">
      <div class="d-flex flex-column text-center" style="gap:15px;">
        <v-img src="/assets/labscript.dev.png" width="200px" class="mx-auto" />
        <div class="d-flex" style="gap:10px;">
          <v-btn icon="mdi-github" variant="plain" href="https://github.com/labscriptdev" target="_blank"></v-btn>
          <v-btn icon="mdi-twitter" variant="plain" href="https://twitter.com/labscriptdev" target="_blank"></v-btn>
          <v-btn icon="mdi-whatsapp" variant="plain" href="https://wa.me/message/NG7A2SW25XIEI1" target="_blank"></v-btn>
          <v-btn icon="mdi-email" variant="plain" href="mailto:labscript.dev@gmail.com"></v-btn>
        </div>
        <v-btn to="/demo" variant="plain">Demos</v-btn>
      </div>
    </div>
  </v-app>
</template>