<template>
  <app-layout title="Clockify" container-width="100%">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center bg-primary pa-2 mb-3 rounded">
          <v-btn @click="clockify.monthAdd(-1)">Mês anterior</v-btn>
          <div class="flex-grow-1 text-center text-h4">
            {{ $dayjs.utc(clockify.params.dateStart).format('MMMM') }}
            {{ $dayjs.utc(clockify.params.dateStart).format('YYYY') }}
          </div>
          <v-btn @click="clockify.monthAdd(1)">Próximo mês</v-btn>
        </div>
        <v-slide-group
          :model-value="$dayjs(clockify.params.dateToday).format('YYYY-MM-DD')"
          show-arrows
          center-active
          class="elevation-2 py-3"
        >
          <v-slide-group-item
            v-for="d in clockify.dates"
            :key="d.id"
            :value="d.dayjs.format('YYYY-MM-DD')"
          >
            <div
              class="d-flex flex-column border rounded mx-1"
              :class="{
                'bg-green-lighten-4': d.is.today,
                'bg-grey-lighten-4': !d.is.today,
              }"
              style="gap:2px; padding:2px; min-width:70px; max-width:70px; height:300px;"
            >
              <div
                class="text-center py-2 fw-bold rounded"
                :class="{
                  'bg-green-lighten-2': d.is.today,
                  'bg-grey-lighten-2': !d.is.today,
                }"
                style="font-size:12px;"
              >
                <div>{{ d.dayjs.format('ddd') }}</div>
                <div>{{ d.dayjs.format('DD') }}</div>
                <div style="white-space:nowrap; font-size:10px;">&nbsp; {{ clockify.timeHumanize(d.entries.reduce((a, b) => a + b.workedMinutes, 0)) }}</div>
              </div>
              <div class="flex-grow-1 d-flex flex-column justify-end" style="gap:3px;">
                <div
                  v-for="e in d.entries"
                  :title="`${e.description} - ${e.workedMinutes} minutes worked`"
                  class="text-center overflow-hidden d-flex align-center justify-center rounded"
                  :class="{
                    'bg-green-lighten-2': (clockify.timeEntry.working && clockify.timeEntry.working.id==e.id),
                    'bg-grey-lighten-2': !(clockify.timeEntry.working && clockify.timeEntry.working.id==e.id),
                  }"
                  :style="{ height: `${e.workedMinutesPercent}%` }"
                  style="font-size:10px; white-space:nowrap;"
                >
                  <div>
                    {{ clockify.timeHumanize(e.workedMinutes) }}
                  </div>
                </div>
              </div>
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <br>

    <v-row>
      <template v-for="c in clockify.charts">
        <v-col v-bind="c.colBind">
          <app-chartjs
            style="height:300px;"
            class="elevation-2 pa-3"
            v-bind="c.chartBind"
            @chart="c.chartLoad"
          />
        </v-col>
      </template>
    </v-row>

    <br>

    <v-table class="elevation-2">
      <tbody>
        <tr v-for="[attr, item] in Object.entries(clockify.result)">
          <template v-if="attr!='ready'">
            <td>{{ item.description }}</td>
            <td>{{ item.formatted }}</td>
          </template>
        </tr>
      </tbody>
    </v-table>

    <template #drawer>
      
      <!-- Logged user -->
      <v-card-text>
        <div class="d-flex align-center">
          <template v-if="clockify.user.data">
            <v-avatar>
              <v-img :src="clockify.user.data.profilePicture"></v-img>
            </v-avatar>
            <div class="fw-bold ms-3">{{ clockify.user.data.name }}</div>
          </template>
          
          <template v-if="!clockify.user.data">
            <div class="fw-bold ms-3">Hello Anonimous!</div>
          </template>

          <v-dialog>
            <template #activator="{ props }">
              <v-btn
                icon="mdi-cog"
                class="ms-auto"
                flat
                size="20"
                v-bind="props"
                ref="settingsBtn"
              />
            </template>
  
            <div style="width:90vw; max-width:600px!important; margin:0 auto;">
              <v-card>
                <v-card-text>
                  <a href="https://app.clockify.me/user/settings" target="_blank">
                    Acesse sua tela de configurações Clockify para gerar o token.
                  </a><br><br>
                  <v-text-field
                    label="Token"
                    v-model="clockify.storage.token"
                    :class="{ 'security-mode': clockify.storage.securityMode }"
                  />
  
                  <div class="d-flex align-center mb-6" style="gap:15px;">
                    <v-text-field
                      label="Converter de"
                      v-model.number="clockify.storage.amountPerHour"
                      type="number"
                      :hide-details="true"
                    />
  
                    <v-autocomplete
                      v-model="clockify.storage.currencyFrom"
                      :items="Object.keys(clockify.currency.data)"
                      :hide-details="true"
                      style="width:150px;"
                    ></v-autocomplete>
  
                    <v-autocomplete
                      label="Para"
                      v-model="clockify.storage.currencyTo"
                      :items="Object.keys(clockify.currency.data)"
                      :hide-details="true"
                      style="width:150px;"
                    ></v-autocomplete>
                  </div>
  
                  <v-text-field
                    :label="`Meta (${clockify.storage.currencyFrom})`"
                    v-model.number="clockify.storage.amountGoal"
                    type="number"
                    :suffix="`${clockify.currencyConvert(clockify.storage.amountGoal)} ${clockify.storage.currencyTo}`"
                    :class="{ 'security-mode': clockify.storage.securityMode }"
                  />

                  <v-switch
                    v-model="clockify.storage.securityMode"
                    hide-details
                    :label="clockify.storage.securityMode? 'Protegendo valores sensíveis': 'Exibindo valores sensíveis'"
                  ></v-switch>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="$refs.settingsBtn.$el.click(); clockify.init();">Ok</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-dialog>
        </div>
      </v-card-text>

      <v-divider />

      <v-list>
        <v-list-subheader>Workspaces</v-list-subheader>
        <v-list-item
          v-for="w in clockify.workspace.data"
          :key="w.id"
          :active="w.id==clockify.params.workspaceId"
        >
          {{ w.name }}
          <template #append>
            <v-btn
              icon="mdi-open-in-new"
              variant="text"
              @click="clockify.params.workspaceId = w.id"
            />
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-card-text>
        <!-- <v-text-field
          :class="{ 'security-mode': clockify.storage.securityMode }"
          :label="`À receber (${clockify.storage.currencyFrom})`"
          :model-value="clockify.currencyFormat(clockify.result.amountTotal.value)"
          :suffix="`${clockify.currencyConvert(clockify.result.amountTotal.value)} ${clockify.storage.currencyTo}`"
          :hide-details="true"
          readonly
        /> -->
      </v-card-text>

      <v-divider />

      <v-card-text>
        <v-dialog>
          <template #activator="{ props }">
            <v-btn block v-bind="props" ref="downloadPdfBtn">
              <span class="me-2">Print</span> <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>

          <div class="mx-auto" style="width:800px; max-width:90vw;">
            <v-card>
              <v-card-text style="max-height:90vh; overflow:auto;">
                <app-iframe style="height:750px;" ref="iframe">
                  <table>
                    <colgroup>
                      <col width="70%">
                      <col width="30%">
                    </colgroup>
                    <thead>
                      <tr class="high">
                        <th><v-content v-model="clockify.storage.invoiceProviderName" /></th>
                        <th><v-content v-model="clockify.storage.invoiceNumber" prepend="Invoice #" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-content v-model="clockify.storage.invoiceProviderName" />
                          <v-content v-model="clockify.storage.invoiceProviderInfo" />
                          <br>
                          <v-content v-model="clockify.storage.invoiceContractorInfo" />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <br>
                  <table>
                    <colgroup>
                      <col width="40%">
                      <col width="20%">
                      <col width="20%">
                      <col width="20%">
                    </colgroup>
                    <tbody>
                      <tr class="high">
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit. price</th>
                        <th>Amount (AUD)</th>
                      </tr>
                      <tr>
                        <td>
                          <v-content v-model="clockify.storage.invoiceProviderServiceDescription" />
                          {{ $dayjs.utc(clockify.params.dateStart).format('DD') }} ~
                          {{ $dayjs.utc(clockify.params.dateFinal).format('DD') }}
                          {{ $dayjs.utc(clockify.params.dateStart).format('MMMM') }}
                        </td>
                        <td>1</td>
                        <td>{{ clockify.currencyFormat(clockify.result.amountTotal.value) }}</td>
                        <th>{{ clockify.currencyFormat(clockify.result.amountTotal.value) }}</th>
                      </tr>
                      <tr>
                        <td><v-content v-model="clockify.storage.invoiceProviderFeeDescription" /></td>
                        <td>
                          <v-content v-model="clockify.storage.invoiceFeeHusky" />
                        </td>
                        <td>1</td>
                        <th>{{ clockify.currencyFormat(clockify.result.amountFee.value) }}</th>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <th class="high">Total:</th>
                        <th class="high">{{ clockify.currencyFormat(clockify.result.amountTotal.value + clockify.result.amountFee.value) }}</th>
                      </tr>
                    </tbody>
                  </table>
                  <br>
                  <table>
                    <colgroup>
                      <col width="40%">
                      <col width="60%">
                    </colgroup>
                    <tbody>
                      <tr class="high">
                        <th>Accont info</th>
                        <th>&nbsp;</th>
                      </tr>
                      <tr>
                        <td>Beneficiary</td>
                        <td><v-content v-model="clockify.storage.invoiceProviderName" /></td>
                      </tr>
                      <tr>
                        <td>Beneficiary account (IBAN)</td>
                        <td><v-content v-model="clockify.storage.invoiceProviderAccountIban" /></td>
                      </tr>
                      <tr>
                        <td>Swift code</td>
                        <td><v-content v-model="clockify.storage.invoiceProviderAccountSwiftCode" /></td>
                      </tr>
                      <tr>
                        <td>Bank</td>
                        <td><v-content v-model="clockify.storage.invoiceProviderAccountBankName" /></td>
                      </tr>
                      <tr>
                        <td>Bank Address</td>
                        <td><v-content v-model="clockify.storage.invoiceProviderAccountBankAddress" /></td>
                      </tr>
                    </tbody>
                  </table>
                  <br>
                  <table>
                    <tbody>
                      <tr>
                        <th class="high">
                          <v-content v-model="clockify.storage.invoiceThanks" placeholder="Thanks" />
                        </th>
                      </tr>
                    </tbody>
                  </table>

                  <template #style>
                    * {box-sizing:border-box;}
                    html, body, .v-content-text * {font-family:monospace!important; padding:0!important; margin:0!important; print-color-adjust:exact !important;}
                    table {width:100%; border-collapse:separate; border-spacing:0; border:solid 1px #ffc762;}
                    th, td {padding:10px; text-align:left;}
                    tr.high th, tr.high td, th.high, td.high {background-color:#ffc762;}
                    hr {margin:15px 0!important; border:none; border-top:solid 1px #ffc76266;}
                  </template>
                </app-iframe>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn @click="contentPrint()" color="primary">Print</v-btn>
                <v-btn @click="$refs.downloadPdfBtn.$el.click();">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
      </v-card-text>

      <v-divider />

      <v-card-text>
        <div class="text-disabled text-caption text-right mt-1">Atualizando em {{ clockify.refreshCounter }}</div>
      </v-card-text>
    </template>
  </app-layout>
</template>

<style>
  .security-mode {
    filter: blur(4px);
  }
</style>

<script>
  import useClockify from '@/composables/useClockify';
  import useCalendar from '@/composables/useCalendar';
  import useCurrency from '@/composables/useCurrency';

  export default {
    meta: {
      active: true,
      icon: 'mdi-alarm-check',
      name: 'Clockify',
      description: 'Gerenciamento e cálculo de horas trabalhadas utilizando o app Clockify',
    },

    methods: {
      contentPrint() {
        const w = window.open('', '', 'height=500, width=500');
        w.document.write(this.$refs.iframe.getIframe().value.contentWindow.document.body.innerHTML);
        w.document.close();
        w.print();
        w.close();

        // const documentPrint = Object.assign(document.createElement('div'), {
        //   innerHTML: this.$refs.iframe.getIframe().value.contentWindow.document.body.innerHTML,
        // });

        // console.log(documentPrint);

        // const downloadPDFHandle = () => {
        //   const pdf = new jsPDF();
        //   pdf.fromHTML(documentPrint, 5, 0, {
        //     width: 170,
        //     // elementHandlers: {
        //     //   '#editor': function (element, renderer) {
        //     //       return true;
        //     //   }
        //     // },
        //   });
        //   // pdf.save(this.$dayjs(this.clockify.params.dateToday).format('YYYY-MM') +'.pdf');
        //   pdf.output('dataurlnewwindow');
        // };

        // if (typeof pdf=='undefined') {
        //   document.body.appendChild(Object.assign(document.createElement('script'), {
        //     src: 'https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js',
        //     onload: downloadPDFHandle,
        //   }));
        // }
        // else {
        //   downloadPDFHandle();
        // }
      },
    },

    mounted() {
      definePageMeta({
        title: 'Aaa'
      });
    },

    data() {
      return {
        clockify: useClockify({
          timeEntryParse(entry) {
            entry.workedMinutesPercent = Math.min(100, entry.workedMinutes / (60 * 14) * 100);
            return entry;
          },
        }),
        calendarDisplay: 'range',
        dateStart: false,
        dateFinal: false,
      };
    },
  };
</script>