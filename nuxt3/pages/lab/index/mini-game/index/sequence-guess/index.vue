<template>
  <div>
    <h1>Adivinhe a sequência de cores</h1>
    <br />

    Regras: <br />
    <ol class="px-5">
      <li>Arraste as cores para adivinhar a sequência.</li>
      <li>
        Quando você achar que tem um palpite, clique em <strong>TESTE</strong>.
      </li>
      <li>O jogo termina quando você acertar toda a sequência.</li>
      <li>
        Você só perde se desistir. O desafio é adivinhar a sequência com o
        mínimo de movimentos.
      </li>
    </ol>
    <br />

    <div v-if="game.statusIs(['iddle'])">
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            label="Quantidade de cores"
            v-model="game.options.totalColors"
            type="number"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn block height="55" color="success" @click="game.init()">
            Começar
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-if="game.statusIs(['playing', 'win'])">
      <div class="d-flex">
        <v-alert rounded="0" type="success">
          {{ game.result.success }}
          {{ game.result.success <= 1 ? "Acerto" : "Acertos" }}
        </v-alert>
        <v-alert rounded="0" type="error">
          {{ game.result.error }}
          {{ game.result.error <= 1 ? "Erro" : "Erros" }}
        </v-alert>
        <v-alert rounded="0" type="warning">
          {{ game.result.tests }}
          {{ game.result.tests <= 1 ? "Tentativa" : "Tentativas" }}
        </v-alert>
      </div>
      <br />

      <draggable
        v-model="game.guess"
        item-key="id"
        class="d-flex justify-center py-2"
        style="gap: 15px; overflow: auto"
        :animation="150"
      >
        <template #item="item">
          <div
            class="elevation-2 rounded"
            :style="`background: ${item.element}; cursor: grab;`"
          >
            <v-tooltip :text="item.element" location="top">
              <template #activator="bind">
                <div v-bind="bind.props" style="width: 50px; height: 100px">
                  &nbsp;
                </div>
              </template>
            </v-tooltip>
          </div>
        </template>
      </draggable>
      <br />

      <div class="text-center" v-if="game.statusIs(['playing'])">
        <v-btn color="success" @click="game.test()">Test</v-btn>
      </div>

      <v-alert type="success" v-if="game.statusIs(['win'])">
        Você encontrou a sequência correta em
        <strong>{{ game.result.tests }} tentativas</strong>!
        <template #append>
          <v-btn variant="text" @click="game.stop()">Jogar novamente</v-btn>
        </template>
      </v-alert>

      <div
        style="
          display: flex;
          flex-direction: column-reverse;
          max-height: 400px;
          overflow: auto;
        "
      >
        <template v-for="o in game.log">
          <div
            class="py-1"
            style="display: flex; align-items: center; gap: 10px"
          >
            <div class="flex-grow-1">
              {{ o.result.success }} acertos, {{ o.result.error }} erros,
            </div>
            <template v-for="oo in o.guess">
              <div
                class="elevation-2"
                :style="`width: 50px; height: 50px; background:${oo};`"
              >
                &nbsp;
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import draggable from "vuedraggable";
import _ from "lodash";

const game = reactive({
  status: "iddle",
  sequence: [],
  guess: [],
  options: {
    totalColors: 5,
  },
  log: [],
  result: {
    tests: 0,
    success: 0,
    error: 0,
  },
  t: false,
  seconds: 0,
  onInterval() {
    game.seconds++;
  },
  test() {
    game.log.push({
      guess: JSON.parse(JSON.stringify(game.guess)),
      result: JSON.parse(JSON.stringify(game.result)),
    });

    game.result.tests = game.log.length;
    game.result.success = 0;
    game.result.error = 0;

    game.guess.map((value, index) => {
      if (value == game.sequence[index]) {
        game.result.success++;
      }
    });

    game.result.error = game.guess.length - game.result.success;

    if (game.result.error == 0) {
      game.status = "win";
    }
  },
  statusIs(statuses) {
    return statuses.includes(this.status);
  },
  stop() {
    this.status = "iddle";
    this.result.tests = 0;
    this.result.success = 0;
    this.result.error = 0;
    this.seconds = 0;
    this.log = [];
    // if (this.t) clearInterval(this.t);
  },
  init() {
    this.status = "playing";

    const colors = [
      "AntiqueWhite",
      "Aqua",
      "Aquamarine",
      "Beige",
      "Bisque",
      "BlanchedAlmond",
      "Blue",
      "BlueViolet",
      "Brown",
      "BurlyWood",
      "CadetBlue",
      "Chartreuse",
      "Chocolate",
      "Coral",
      "CornflowerBlue",
      "Cornsilk",
      "Crimson",
      "Cyan",
      "DarkBlue",
      "DarkCyan",
      "DarkGoldenRod",
      "DarkGrey",
      "DarkGreen",
      "DarkKhaki",
      "DarkMagenta",
      "DarkOliveGreen",
      "Darkorange",
      "DarkOrchid",
      "DarkRed",
      "DarkSalmon",
      "DarkSeaGreen",
      "DarkSlateBlue",
      "DarkSlateGrey",
      "DarkTurquoise",
      "DarkViolet",
      "DeepPink",
      "DeepSkyBlue",
      "DimGray",
      "DodgerBlue",
      "FireBrick",
      "ForestGreen",
      "Fuchsia",
      "Gainsboro",
      "Gold",
      "GoldenRod",
      "Grey",
      "Green",
      "GreenYellow",
      "HotPink",
      "IndianRed",
      "Indigo",
      "Ivory",
      "Khaki",
      "Lavender",
      "LawnGreen",
      "LemonChiffon",
      "LightBlue",
      "LightCoral",
      "LightCyan",
      "LightGoldenRodYellow",
      "LightGrey",
      "LightGreen",
      "LightPink",
      "LightSalmon",
      "LightSeaGreen",
      "LightSkyBlue",
      "LightSlateGrey",
      "LightSteelBlue",
      "LightYellow",
      "Lime",
      "LimeGreen",
      "Linen",
      "Magenta",
      "Maroon",
      "MediumAquaMarine",
      "MediumBlue",
      "MediumOrchid",
      "MediumPurple",
      "MediumSeaGreen",
      "MediumSlateBlue",
      "MediumSpringGreen",
      "MediumTurquoise",
      "MediumVioletRed",
      "MidnightBlue",
      "MistyRose",
      "Moccasin",
      "NavajoWhite",
      "Navy",
      "OldLace",
      "Olive",
      "OliveDrab",
      "Orange",
      "OrangeRed",
      "Orchid",
      "PaleGoldenRod",
      "PaleGreen",
      "PaleTurquoise",
      "PaleVioletRed",
      "PapayaWhip",
      "PeachPuff",
      "Peru",
      "Pink",
      "Plum",
      "PowderBlue",
      "Purple",
      "Red",
      "RosyBrown",
      "RoyalBlue",
      "SaddleBrown",
      "Salmon",
      "SandyBrown",
      "SeaGreen",
      "Sienna",
      "Silver",
      "SkyBlue",
      "SlateBlue",
      "SlateGrey",
      "Snow",
      "SpringGreen",
      "SteelBlue",
      "Tan",
      "Teal",
      "Thistle",
      "Tomato",
      "Turquoise",
      "Violet",
      "Wheat",
      "WhiteSmoke",
      "Yellow",
      "YellowGreen",
    ].filter((o, i) => {
      return i < this.options.totalColors;
    });

    this.sequence = _.shuffle(colors);
    this.guess = _.shuffle(colors);

    // this.t = setInterval(this.onInterval, 1000);
  },
});
</script>

<script>
export default {
  meta: {
    icon: "mdi-numeric-1",
    name: "Adivinhe a Sequência",
  },
};
</script>
