<template>
  <app-layout>
    <div class="d-flex align-center" style="gap:20px;">
      <div>Arraste para sua área de bookmarks: </div>
      <v-btn :href="`javascript:${app.build()}(true)`">{{ app.name || 'Bookapp' }}</v-btn>
    </div>

    <br>
    
    <div class="d-flex align-center" style="gap:20px;">
      <div>Clique para testar em uma nova janela:</div>
      <v-btn @click="browserTest()">Test</v-btn>
    </div>

    <br>

    <div class="py-5 text-center border" @drop.prevent="onDrop($event)" @dragenter.prevent @dragover.prevent>
      Drop here
    </div>

    <br>

    <app-monaco
      v-model="app.source"
      language="javascript"
    ></app-monaco>

    <br>
    <!-- <vv-dd v-model="app"></vv-dd> -->
    <!-- <div style="background:#222; color:lime; font-family:monospace;">{{ app.build() }}</div> -->
    <!-- <vv-dd :model-value="app.build()"></vv-dd> -->
    <app-monaco
      :model-value="app.build()"
      language="javascript"
      style="height:400px;"
      word-wrap="on"
    ></app-monaco>

    <template #drawer>
      <v-card-text>
        <v-text-field
          v-model="app.name"
          label="Nome"
        ></v-text-field>

        <v-dialog>
          <template #activator="{ props }">
            <v-btn block v-bind="props" ref="dependsBtn">Dependencias</v-btn>
          </template>

          <div class="mx-auto" style="width:600px; max-width:95vw;">
            <v-card>
              <v-card-text style="max-height:80vh; overflow:auto;">
                <div class="text-center pa-3" v-if="app.dependencies.length==0">
                  Nenhuma dependência criada
                </div>
                <vv-draggable
                  v-model="app.dependencies"
                  handle=".handle"
                >
                  <template #item="{ element: _depend }">
                    <div class="d-flex align-center my-3">
                      <div class="handle pa-2">
                        <v-btn flat size="small" icon="mdi-dots-grid"></v-btn>
                      </div>
                      <div>
                        <v-combobox
                          v-model="_depend.tag"
                          label="Tipo"
                          :items="['script', 'link']"
                          :hide-details="true"
                        ></v-combobox>
                      </div>
                      <div class="flex-grow-1">
                        <v-text-field
                          v-model="_depend.url"
                          label="URL"
                          :hide-details="true"
                        ></v-text-field>
                      </div>
                      <div class="pa-2">
                        <v-btn
                          flat size="small" icon="mdi-close"
                          @click="app.dependencyRemove(_depend)"
                        ></v-btn>
                      </div>
                    </div>
                  </template>
                </vv-draggable>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="primary" @click="app.dependencyAdd()">Criar</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="$refs.dependsBtn.$el.click()">Fechar</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
      </v-card-text>
    </template>
  </app-layout>
</template>

<script>
  import { Bookapp } from './Bookapp';

  export default {
    methods: {
      log: console.log,
      browserTest() {
        const win = window.open("", "_blank", "width=600,height=600");
        win.document.write('<!DOCTYPE html><html lang="en"><head></head><body><script>'+this.app.build()+'(true);</'+'script></body></html>');
        win.focus();
      },
      onDrop(ev) {
        let source = ev.dataTransfer.getData('text/plain');
        source = source.replace('javascript:', '').replace('(true)', '');
        source = Function(`return ${source}`)()();
        this.app = new Bookapp(source);
      },
    },
    data() {
      return {
        app: new Bookapp({
          dependencies: [
            {tag:'script', url:'https://unpkg.com/axios@1.2.0/dist/axios.min.js'},
            {tag:'script', url:'https://unpkg.com/vue@3.2.45/dist/vue.global.prod.js'},
            {tag:'script', url:'https://cdn.jsdelivr.net/npm/vuetify@3.0.3/dist/vuetify.min.js'},
            {tag:'link', url:'https://cdn.jsdelivr.net/npm/vuetify@3.0.3/dist/vuetify.min.css'},
            {tag:'link', url:'https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css'},
          ],
          source: [
            `customElements.define('the-app', Vue.defineCustomElement({`,
            `   styles: [`,
            `     '@import url(https://cdn.jsdelivr.net/npm/vuetify@3.0.5/dist/vuetify.min.css);',`,
            `     '@import url(https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css);',`,
            `   ],`,
            `   setup() {`,
            `     const app = Vue.createApp();`,
            `     app.use(Vuetify.createVuetify());`,
            `     Object.assign(Vue.getCurrentInstance(), {`,
            `       appContext: app._context,`,
            `       provides: app._context.provides,`,
            `     });`,
            `   },`,
            ``,
            `   data: () => ({ test: "Hello World" }),`,
            `   template: \`<div>`,
            `     <v-text-field v-model="test" label="Hello"></v-text-field>`,
            `     <pre>{{ $data }}</pre>`,
            `   </div>\`,`,
            `}));`,
            ``,
            `document.body.appendChild(document.createElement('the-app'));`,
          ].join("\n"),
        }),
      };
    },
  };
</script>