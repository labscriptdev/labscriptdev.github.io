<template>
  <app-layout title="Gerador de arquivos" v-bind="{ drawerShow: false, fluid: false, containerStyle: 'max-width:800px'}">
    <v-row>
      <v-col cols="12" md="4">
        <v-combobox label="Tipo de arquivo" :items="extensions" v-model="params.ext" :hide-details="true" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field type="number" label="Tamanho do arquivo" v-model="params.size" suffix="MB" :hide-details="true" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field label="Nome" suffix=".json" v-model="params.name" :hide-details="true" />
      </v-col>
    </v-row>
    <div class="d-flex mt-5">
      <v-spacer></v-spacer>
      <v-btn color="success" @click="download()">Download</v-btn>
    </div>
  </app-layout>
</template>

<script>
  export default {
    data: () => ({
      params: {
        size: 10,
        name: 'file',
        ext: {title:"TXT", value:"txt", mime:"text/plain"},
      },
      extensions: [
        {title:"AVI", value:"avi", mime:"video/x-msvideo"},
        {title:"BAT", value:"bat", mime:"text/plain"},
        {title:"BIN", value:"bin", mime:"application/octet-stream"},
        {title:"BMP", value:"bmp", mime:"image/x-ms-bmp"},
        {title:"DLL", value:"dll", mime:"application/octet-stream"},
        {title:"DOC", value:"doc", mime:"application/msword"},
        {title:"DVI", value:"dvi", mime:"application/x-dvi"},
        {title:"EML", value:"eml", mime:"message/rfc822"},
        {title:"EXE", value:"exe", mime:"application/octet-stream"},
        {title:"GIF", value:"gif", mime:"image/gif"},
        {title:"HTM", value:"htm", mime:"text/html"},
        {title:"HTML", value:"html", mime:"text/html"},
        {title:"JPEG", value:"jpeg", mime:"image/jpeg"},
        {title:"JPG", value:"jpg", mime:"image/jpeg"},
        {title:"JS", value:"js", mime:"application/x-javascript"},
        {title:"JSON", value:"json", mime:"application/json"},
        {title:"MOV", value:"mov", mime:"video/quicktime"},
        {title:"MOVIE", value:"movie", mime:"video/x-sgi-movie"},
        {title:"MP2", value:"mp2", mime:"audio/mpeg"},
        {title:"MP3", value:"mp3", mime:"audio/mpeg"},
        {title:"MP4", value:"mp4", mime:"video/mp4"},
        {title:"MPEG", value:"mpeg", mime:"video/mpeg"},
        {title:"MPG", value:"mpg", mime:"video/mpeg"},
        {title:"OBJ", value:"obj", mime:"application/octet-stream"},
        {title:"PDF", value:"pdf", mime:"application/pdf"},
        {title:"PNG", value:"png", mime:"image/png"},
        {title:"PPS", value:"pps", mime:"application/vnd.ms-powerpoint"},
        {title:"PPT", value:"ppt", mime:"application/vnd.ms-powerpoint"},
        {title:"PPTX", value:"pptx", mime:"application/vnd.ms-powerpoint"},
        {title:"PY", value:"py", mime:"text/x-python"},
        {title:"TAR", value:"tar", mime:"application/x-tar"},
        {title:"TIF", value:"tif", mime:"image/tiff"},
        {title:"TIFF", value:"tiff", mime:"image/tiff"},
        {title:"TXT", value:"txt", mime:"text/plain"},
        {title:"WAV", value:"wav", mime:"audio/x-wav"},
        {title:"WSDL", value:"wsdl", mime:"application/xml"},
        {title:"XLS", value:"xls", mime:"application/vnd.ms-excel"},
        {title:"XLSX", value:"xlsx", mime:"application/vnd.ms-excel"},
        {title:"XML", value:"xml", mime:"text/xml"},
        {title:"ZIP", value:"zip", mime:"application/zip"},
      ],
    }),

    methods: {
      download() {
        const content = 'x'.repeat(parseInt(this.params.size) * 1024 * 1024);
        const blob = new Blob([content], { type: this.params.ext.mime });

        const link = Object.assign(document.createElement('a'), {
          href: URL.createObjectURL(blob),
          download: `${this.params.name}.${this.params.ext.value}`,
        }).click();
      },
    },
  };
</script>