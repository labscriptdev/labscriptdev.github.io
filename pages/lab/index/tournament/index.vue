<template>
  <app-layout>
    <v-row>
      <v-col cols="3" class="border">
        <v-btn block @click="tour.team.add()">team add</v-btn>
        <br>
        <v-table class="border rounded">
          <thead>
            <tr>
              <th width="10px"></th>
              <th>Team</th>
              <th width="10px"></th>
            </tr>
          </thead>
          <tbody style="font-family:monospace;">
            <tr v-for="(t, i) in tour.team.data">
              <td>{{ i+1 }}</td>
              <td>{{ t.name }}</td>
              <td>
                <v-btn flat size="x-small" icon="mdi-close" @click="tour.team.remove(t)" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="3" class="border">
        <pre>{{ tour }}</pre>
      </v-col>
      
      <v-col cols="6" class="border">
        <v-table class="border">
          <thead>
            <tr>
              <th></th>
              <th>Group</th>
              <th>Teams</th>
              <th>Matches</th>
            </tr>
          </thead>
          <tbody style="font-family:monospace;">
            <tr v-for="(g, i) in tour.match.groups">
              <td width="10px">{{ i+1 }}</td>
              <td>{{ g.name }}</td>
              <td>{{ g.teams.length }}</td>
              <td>{{ g.matches.length }}</td>
            </tr>
          </tbody>
        </v-table>

        <template v-if="tour.match.brackets.length">
          <br>
          <v-row no-gutters class="align-center">
            <v-col class="pa-2" v-for="step in [ ...Array(tour.match.brackets[0].bracket_step+1).keys() ].reverse()">
              <div class="pa-2 text-center font-weight-bold text-uppercase">{{ tour.match.bracketStepName(step) }}</div>
              <div class="pa-2 mt-2 border" v-for="m in tour.match.brackets.filter(b => b.bracket_step==step)">
                xxx vs xxx
              </div>
            </v-col>
          </v-row>
        </template>

        <br>

        <v-table class="border">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Parent</th>
              <th>Match</th>
              <th>Step</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody style="font-family:monospace;">
            <tr v-for="(m, i) in tour.match.matches">
              <td width="10px">{{ i+1 }}</td>
              <td width="50px">{{ m.uuid }}</td>
              <td class="py-1">
                <div>1: {{ m.parent1_id || '' }}</div>
                <div>2: {{ m.parent2_id || '' }}</div>
              </td>
              <td class="py-1">
                <div>t1: {{ m.team1_id || '' }}</div>
                <div>t2: {{ m.team2_id || '' }}</div>
              </td>
              <td>{{ m.bracket_step===false? '': m.bracket_step }}</td>
              <td>{{ m.group===false? '': m.group }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </app-layout>
</template>

<script setup>
  import { faker } from '@faker-js/faker';

  const useTournamentBracketsGenerator = () => {
    const r = ref({
      uuid() {
        return ('' + 1e4).replace(/[018]/g, c => ( c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) ).toString(16));
      },

      team: {
        data: [],
        add(data) {
          this.data.push({
            uuid: r.value.uuid(),
            name: [
              faker.word.conjunction(),
              faker.word.adjective(),
            ].join(' '),
            ...data
          });
        },
        remove(data) {
          const index = this.data.indexOf(data);
          this.data.splice(index, 1);
        },
      },

      match: {
        options: {
          groupMaxTeams: 4,
        },
        groups: [],
        brackets: [],
        matches: [],
        default(data={}) {
          return {
            uuid: r.value.uuid(),
            name: '',
            team1_id: false,
            team1_points: 0,
            team2_id: false,
            team2_points: 0,
            parent1_id: false,
            parent2_id: false,
            bracket_step: false, // 0:final, 1:semifinal, 2:quarters, 3:octaves, etc
            group: false,
            ...data
          };
        },
        isBracketable(number=null) {
          if (number===null) number = r.value.team.data.length;
          if (Array.isArray(number)) number = number.length;
          return [ 2, 4, 8, 16 ].includes(number);
        },
        bracketStepName(n) {
          let names = ['Final', 'Semifinal', 'Quartas de final', 'Oitavas de final'];
          return names[ n ] || false;
        },
        createGroups(teamsTotal) {
          if (Array.isArray(teamsTotal)) teamsTotal = teamsTotal.length;

          let groups = [ ...Array( Math.ceil(teamsTotal / this.options.groupMaxTeams) ).keys() ].map(index => {
            return {
              name: `Grupo ${index+1}`,
              teams: [],
              matches: [],
            };
          });

          for(let t=0; t<teamsTotal; t++) {
            const groupIndex = t % groups.length;
            groups[ groupIndex ].teams.push(null);
          }

          groups.forEach((group, groupIndex) => {
            for(let i=0; i<group.teams.length; i++) {
              for(let ii=i; ii<group.teams.length; ii++) {
                if (i==ii) continue;
                group.matches.push(this.default({
                  group: groupIndex,
                  _teams: [ i , ii ],
                }));
              }
            }
          });

          let matches = [];
          groups.forEach(group => {
            group.matches.forEach(match => {
              matches.push(match);
            });
          });

          return { groups, matches };
        },
        createBrackets(teamsTotal) {
          if (Array.isArray(teamsTotal)) teamsTotal = teamsTotal.length;
          if (!this.isBracketable(teamsTotal)) return [];
          let matches = [];

          // let submatches = [ ...Array( Math.ceil(teamsTotal / 2) ).keys() ].map(i => this.default());
          let matchesTotal = teamsTotal;
          while(matchesTotal/2 > 1) {
            matchesTotal = matchesTotal / 2;
            for(let m=0; m<matchesTotal; m++) {
              matches.push(this.default({
                bracket_step: matchesTotal/2,
              }));
            }
          }

          matches.push(this.default({ bracket_step: 0 }));

          return { matches };
        },
        generate() {
          const objClone = obj => { if (obj === null) return null; let clone = Object.assign({}, obj); Object.keys(clone).forEach(key => (clone[key] = typeof obj[key] === 'object' ? objClone(obj[key]) : obj[key]) ); if (Array.isArray(obj)) { clone.length = obj.length; return Array.from(clone); } return clone; };
          const arrShuffle = ([...arr]) => { let m = arr.length; while (m) { const i = Math.floor(Math.random() * m--); [arr[m], arr[i]] = [arr[i], arr[m]]; } return arr; };
          const arrChunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size) );
          
          let teams = arrShuffle(objClone(r.value.team.data));
          
          console.clear();
          let { matches, groups } = this.isBracketable() ? this.createBrackets(teams) : this.createGroups(teams);

          if (matches.length>1 && groups) {
            if (this.isBracketable(groups)) {
              matches = [ ...matches, ...this.createBrackets(groups).matches ];
            }
            else {
              matches = [ ...matches, ...this.createGroups(groups).matches ];
            }
          }

          /* à partir de 17 times, da merda, porque sobram 2 grupos (2 times vencedores) e deveria criar uma bracket
          portanto a logica acima não deveria ser if, mas um while verificando se a quantidade de partidas geradas
          é maior do que 1, enquanto for, vai gerando partidas.
          */

          this.groups = groups || [];
          this.brackets = matches.filter(m => m.bracket_step !== false);
          this.matches = matches || [];
        },
      },
    });

    watch([ r.value.team.data ], ([ newTeamData ]) => {
      r.value.match.generate();
    });

    return r;
  };

  const tour = useTournamentBracketsGenerator();
  // for(let i=1; i<=5; i++) tour.value.team.add();
</script>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-tournament',
      name: 'Tournament',
      description: 'Tournament bracket generator',
    },
  };
</script>