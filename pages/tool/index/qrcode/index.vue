<template>
  <app-layout title="QR Code">
    <v-card>
      <v-card-title>
        <v-icon>{{ type.icon }}</v-icon>
        <span class="ms-2">{{ type.name }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" md="7">
            <v-window
              :model-value="$route.query.type || 'text'"
              @update:modelValue="type.onChange(type)"
              class="pt-1"
            >
              <v-window-item value="text" @group:selected="type.onChange(type)">
                <v-text-field
                  v-model="type.text"
                  label="Texto"
                  @input="type.onChange(type)"
                ></v-text-field>
              </v-window-item>
              <v-window-item value="url">
                <v-text-field
                  v-model="type.url"
                  label="URL"
                  @input="type.onChange(type)"
                ></v-text-field>
              </v-window-item>
              <v-window-item value="wifi">
                <v-text-field
                  v-model="type.ssid"
                  label="SSID"
                  @input="type.onChange(type)"
                ></v-text-field>
                <v-text-field
                  v-model="type.type"
                  label="Type"
                  @input="type.onChange(type)"
                ></v-text-field>
                <v-text-field
                  v-model="type.pass"
                  label="Password"
                  type="password"
                  @input="type.onChange(type)"
                ></v-text-field>
              </v-window-item>
              <v-window-item value="vcard">
                <pre>vcard: {{ type }}</pre>
              </v-window-item>
              <v-window-item value="event">
                <pre>event: {{ type }}</pre>
              </v-window-item>
              <v-window-item value="sms">
                <pre>sms: {{ type }}</pre>
              </v-window-item>
              <v-window-item value="phone">
                <pre>phone: {{ type }}</pre>
              </v-window-item>
              <v-window-item value="geo">
                <pre>geo: {{ type }}</pre>
              </v-window-item>
              <v-window-item value="pix">
                <pre>pix: {{ type }}</pre>
              </v-window-item>
            </v-window>
          </v-col>
          <v-col cols="12" md="5">
            <app-qrcode v-model="qrtext" width="100%" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>


    <template #drawer>
      <v-list>
        <v-list-item
          v-for="_type in types"
          :key="_type.id"
          :to="{ ...$route, query:{type:_type.id}}"
          :prepend-icon="_type.icon"
          :active="_type.id == ($route.query.type || 'text')"
        >
          {{ _type.name }}
        </v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
  export default {
    computed: {
      type: {
        get() {
          let queryType = this.$route.query.type || 'text';
          let type = this.types.filter(item => item.id==queryType);
          return type[0] || false;
        },
        set() {},
      },
    },
    methods: {
      log: console.log,
    },
    data() {
      return {
        qrtext: '',
        types: [
          {
            id: 'text',
            name: 'Texto',
            icon: 'mdi-format-color-text',
            text: 'Hello World :)',
            onChange: (self) => {
              this.qrtext = self.text;
            },
          },
          {
            id: 'url',
            name: 'URL',
            icon: 'mdi-link',
            url: '',
            onChange: (self) => {
              this.qrtext = self.url;
            },
          },
          {
            id: 'wifi',
            name: 'WIFI',
            icon: 'mdi-wifi',
            ssid: '',
            type: 'WPA',
            pass: '',
            onChange: (self) => {
              this.qrtext = `WIFI:S:${self.ssid};T:${self.type};P:${self.pass};;`;
            },
          },
          {
            id: 'vcard',
            name: 'Cartão de contato',
            icon: 'mdi-card-account-details',
            firstName: '',
            lastName: '',
            companyName: '',
            jobTitle: '',
            address: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            phone: '',
            mobile: '',
            email: '',
            website: '',
            onChange: (self) => {
              this.qrtext = [
                `BEGIN:VCARD`,
                `VERSION:3.0`,
                `N:${self.lastName};${self.firstName}`,
                `FN:${self.firstName} ${self.lastName}`,
                `ORG:${self.companyName}`,
                `TITLE:${self.jobTitle}`,
                `ADR:;;${self.address};${self.city};${self.state};${self.zipcode};${self.country}`,
                `TEL;WORK;VOICE:${self.phone}`,
                `TEL;CELL:${self.mobile}`,
                `TEL;FAX:`,
                `EMAIL;WORK;INTERNET:${self.email}`,
                `URL:${self.website}`,
                `END:VCARD`,
              ].join("\n");
            },
          },
          {
            id: 'event',
            name: 'Evento',
            icon: 'mdi-calendar',
            summary: '',
            dateStart: '',
            dateFinal: '',
            onChange: (self) => {
              this.qrtext = [
                `BEGIN:VEVENT`,
                `SUMMARY:Independence Day Parades`,
                `DTSTART:20150323T090000`,
                `DTEND:20150323T110000`,
                `END:VEVENT`,
              ].join("\n");
            },
          },
          {
            id: 'sms',
            name: 'SMS',
            icon: 'mdi-check',
            mobile: '',
            message: '',
            onChange: (self) => {
              this.qrtext = `SMSTO:+${self.mobile.replace(/[^0-9]/g, '')}:${self.message}`;
            },
          },
          {
            id: 'phone',
            name: 'Ligação',
            icon: 'mdi-message-processing',
            phone: '',
            onChange: (self) => {
              this.qrtext = `tel:${self.phone.replace(/[^0-9]/g, '')}`;
            },
          },
          {
            id: 'geo',
            name: 'Geo posicionamento',
            icon: 'mdi-map-marker',
            lat: 0,
            lng: 0,
            onChange: (self) => {
              this.qrtext = `geo:${self.lat},${self.lng}`;
            },
            getGeolocation: async (self) => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  self.lat = pos.coords.latitude;
                  self.lng = pos.coords.longitude;
                  this.generate();
                },
                () => {},
                {
                  enableHighAccuracy: true,
                  timeout: 5000,
                  maximumAge: 0
                }
              );
            },
            onMapMove: (ev, self) => {
              self.lat = ev.latlng.lat;
              self.lng = ev.latlng.lng;
              this.generate();
            },
          },
          {
            id: 'pix',
            name: 'PIX',
            icon: 'mdi-currency-usd',
            key: 'john@doe.com',
            city: 'Brasília',
            fullName: 'John Doe',
            value: '100.00',
            message: 'Presentinho pra você :)',
            onChange: (self) => {
              this.qrtext = this.pixClass(self);
            },
          },
        ],
      };
    },
  };
</script>