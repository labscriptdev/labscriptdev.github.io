<template>
  <v-layout class="bg-grey-lighten-3">
    <nuxt-page />

    <div style="position:fixed; bottom:30px; right:30px; z-index:999!important;">
      <v-menu :close-on-content-click="false">
        <div class="mb-4" style="width:350px; max-width:90vh;">
          <v-card>
            <v-text-field
              v-model="filter"
              label="Filtro"
              :hide-details="true"
              class="ma-2"
            />
            <v-divider />
            <div style="max-height:calc(70vh - 70px); overflow:auto;">
              <v-list lines="two">
                <v-list-item
                  v-for="_item in itemsFilter()"
                  :key="_item.id"
                  :title="_item.name"
                  :subtitle="_item.description"
                  :prepend-icon="_item.icon"
                  :to="`/tool/${_item.id}`"
                />
              </v-list>
            </div>
            <v-btn
              block
              :href="`https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/tool/index/${$route.path.replace('/tool/', '')}`"
              target="_blank"
              color="primary"
              rounded="0"
            >
              <v-icon>mdi-xml</v-icon>
              <span class="ms-3">Current page source</span>
            </v-btn>
            <v-btn
              block
              to="/"
              rounded="0"
            >
              <v-icon>mdi-home</v-icon>
              <span class="ms-3">Home</span>
            </v-btn>
          </v-card>
        </div>

        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="55"
            flat
          >
            <v-avatar size="50">
              <v-img src="/assets/labscript.dev.png" />
            </v-avatar>
          </v-btn>
        </template>
      </v-menu>
    </div>
  </v-layout>
</template>

<script>
  export default {
    methods: {
      itemsFilter() {
        let filter = this.filter.toLowerCase();
        return this.items.filter(item => {
          return JSON.stringify(item).toLowerCase().includes(filter);
        });
      },
    },
    data: () => ({
      filter: '',
      items: [
        {
          id: 'bookapp',
          name: 'Gerador app bookmark',
          description: 'Gere aplicações que rodam diretamente da barra de favoritos',
          icon: 'mdi-bookmark-plus-outline',
        },
        {
          id: 'calcdiv',
          name: 'Calculadora de gastos',
          description: 'Calculadora de gastos com divisão por pessoas e tempo de uso',
          icon: 'mdi-calculator',
        },
        // {
        //   id: 'brainjs',
        //   name: 'BrainJS',
        //   description: 'Simulação de AI',
        //   icon: 'mdi-check',
        // },
        // {
        //   id: 'championship',
        //   name: 'Championship',
        //   description: 'Gerador de campeonato',
        //   icon: 'mdi-check',
        // },
        {
          id: 'clockify',
          name: 'Clockify',
          description: 'Gerenciamento e cálculo de horas trabalhadas utilizando o app Clockify',
          icon: 'mdi-alarm-check',
        },
        {
          id: 'diff',
          name: 'Ferramenta diff',
          description: 'Comparação de códigos, textos e afins',
          icon: 'mdi-set-left',
        },
        {
          id: 'filesize-generator',
          name: 'Gerador de arquivo',
          description: 'Aplicação para gerar arquivos com tamanhos exatos',
          icon: 'mdi-file-download-outline',
        },
        {
          id: 'laramake',
          name: 'Gerador Laravel',
          description: 'Criar arquivos para o frameworl Laravel baseado em estrutura de banco de dados',
          icon: 'mdi-laravel',
        },
        {
          id: 'map',
          name: 'Mapa',
          description: 'Visualizador de mapa',
          icon: 'mdi-map-search',
        },
        {
          id: 'lotto',
          name: 'Loteria',
          description: 'Aplicação de simulação lotérica',
          icon: 'mdi-slot-machine',
        },
        // {
        //   id: 'meme',
        //   name: 'Gerador de memes',
        //   description: 'Aplicação para gerar memes de maneira rápida',
        //   icon: 'mdi-emoticon-poop',
        // },
        // {
        //   id: 'openapi',
        //   name: 'OpenAPI',
        //   description: 'Alternativa para visualização e consumo de endpoints de API',
        //   icon: 'mdi-check',
        // },
        // {
        //   id: 'paste',
        //   name: 'Paste',
        //   description: 'Cole, edite e baixe arquivos de maneira rápida',
        //   icon: 'mdi-content-paste',
        // },
        // {
        //   id: 'print3d',
        //   name: 'Print 3D Simulator',
        //   description: 'Aplicação para simular artes em ambientes tridimensionais',
        //   icon: 'mdi-cube',
        // },
        {
          id: 'qrcode',
          name: 'QR Code',
          description: 'Gerador dos principais tipos de QRcode',
          icon: 'mdi-qrcode',
        },
        // {
        //   id: 'search',
        //   name: 'Busca global',
        //   description: 'Ferramenta para auxiliar na busca de qualquer coisa: de pessoas à produtos',
        //   icon: 'mdi-magnify',
        // },
        {
          id: 'text',
          name: 'Ferramentas de texto',
          description: 'Conversores, analisadores e ferramentas úteis para gerencimento de texto',
          icon: 'mdi-text-box-edit-outline',
        },
        {
          id: 'whatsapp',
          name: 'Gerador link whatsapp',
          description: 'Gerar link para whatsapp de maneira rápida e fácil',
          icon: 'mdi-whatsapp',
        },
      ],
    }),
  };
</script>