<template>
  <app-layout>
    <v-row>
      <v-col cols="12" lg="4">
        <v-autocomplete
          v-model="lines.value"
          label="Linha"
          :loading="lines.busy"
          :items="lines.response.linhas.map((o) => ({ ...o, nom: `${o.sgl} - ${o.nom}`}))"
          item-title="nom"
          return-object
          hide-details
          @update:model-value="() => {
            linePoints.submit();
            linePoints.response.sentidos = [];
            linePoints.response.paradas = [];
            previsoes.response.previsoes = [];
          }"
        />
      </v-col>
      
      <v-col cols="12" lg="4">
        <v-autocomplete
          v-model="linePoints.sentido"
          label="Sentido"
          :loading="linePoints.busy"
          :items="linePoints.response.sentidos"
          item-title="end"
          return-object
          hide-details
        />
      </v-col>

      <v-col cols="12" lg="4">
        <v-autocomplete
          v-model="linePoints.ponto"
          label="Ponto"
          :loading="linePoints.busy"
          :items="linePoints.paradas"
          item-title="end"
          return-object
          hide-details
          @update:model-value="previsoes.submit()"
        />
        <v-list>
          <template v-for="o in previsoes.response.previsoes">
            <v-list-item>
              <div class="d-flex align-center">
                <v-icon icon="svg-spinners:wifi-fade" class="text-success" />
                <div class="ms-2">{{ o.prev }}</div>
              </div>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>

    <!-- 
    
    <v-autocomplete
      v-if="bus.line"
      label="Sentido"
      :items="bus.line.ways"
      item-title="name"
      return-object
      hide-details
    /> -->

    <!-- <v-btn @click="lines.submit()">lines load</v-btn> -->
    <!-- <pre>lines: {{ lines }}</pre> -->
  </app-layout>
</template>

<script setup>
import axios from 'axios';

const useBusRequest = (options = {}) => {
  options = {
    url: '',
    ...options
  };

  const r = reactive({
    response: false,
    onResponseData(data) {
      return data;
    },

    ...options,

    busy: false,
    async submit() {
      r.busy = true;
      try {
        const url = ('https://api.allorigins.win/get?url=http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws'+ r.url.replace(/\/$/, '') +'/retornoJSON');
        let resp = await axios({ ...options, url });
        resp.data = JSON.parse(resp.data.contents.replace(/retornoJSON\((.+?)\)/, '$1'));
        r.response = r.onResponseData(resp.data);
      } catch(err) {}
      r.busy = false;
    },
  });

  return r;
};

// const bus = useBhbus();
// bus.linesLoad();

const lines = useBusRequest({
  value: null,
  url: '/buscarLinhas',
  response: {
    linhas: [],
    subLinhas: [],
  },
  onResponseData: (data) => {
    let lines = [];
    data.linhas.map((linhaStr) => {
        ((new Function(`return [${linhaStr}];`))()).map((line) => {
            lines.push(line);
        });
    });

    data.linhas = lines;
    return data;
  },
});

const linePoints = useBusRequest({
  sentido: null,
  ponto: null,
  url: computed(() => {
    return lines.value ? `/buscarParadasPorLinha/${lines.value.cod}/0/` : null;
  }),
  response: {
    sentidos: [],
    paradas: [],
  },
  onResponseData(data) {
    let sentidos = {};
    data.paradas.map((parada) => {
      sentidos[parada.sent] = parada;
    });

    data.sentidos = Object.values(sentidos);
    return data;
  },
  paradas: computed(() => {
    if (!linePoints.sentido) return [];
    return linePoints.response.paradas.filter((o) => o.sent == linePoints.sentido.sent);
  }),
});

const previsoes = useBusRequest({
  url: computed(() => {
    if (!linePoints.ponto) return '';
    return `/buscarPrevisoes/${linePoints.ponto.cod}/0/`;
  }),
  response: {
    previsoes: [],
  },
  onResponseData(data) {
    data.previsoes = data.previsoes.filter((o) => o.sgLin == lines.value.sgl);
    return data;
  },
});

lines.submit();
</script>

<script>
export default {
  meta: {
    active: true,
    icon: "mdi-bus-marker",
    name: "Bus",
    baseUrl: "/lab/bus",
    description: "Bus",
    source:
      "https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/base",
  },

  data() {
    return {
      pages: (() => {
        let files = Object.entries(
          import.meta.glob("./index/**/*.vue", {
            import: "default",
            eager: true,
            // as: 'raw',
          })
        );

        return files
          .filter(([path, file]) => !!file.meta)
          .map(([path, file]) => {
            const url =
              this.$options.meta.baseUrl +
              path.replace("/index.vue", "").replace("./index", "");
            return {
              url,
              icon: "mdi-circle",
              name: "Default",
              active: false,
              order: 0,
              ...(file.meta || {}),
            };
          })
          .sort((a, b) => {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
          });
      })(),
    };
  },
};
</script>
