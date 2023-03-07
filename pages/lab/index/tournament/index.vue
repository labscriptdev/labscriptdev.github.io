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
            <tr v-for="(m, i) in tour.team.data">
              <td>{{ i+1 }}</td>
              <td>{{ m.name }}</td>
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
              <td>{{ g.teams.join(', ') }}</td>
              <td>{{ g.matches.length }}</td>
            </tr>
          </tbody>
        </v-table>
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
        matches: [],
        groups: [],
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
          number = number || r.value.team.data.length;
          return [ 2, 4, 8, 16 ].includes(number);
        },
        generate() {
          console.clear();
          let matches = [];
          const arrShuffle = ([...arr]) => { let m = arr.length; while (m) { const i = Math.floor(Math.random() * m--); [arr[m], arr[i]] = [arr[i], arr[m]]; } return arr; };

          // Commands:
          // Create groups if is teams number is not bracketable
          // Create brackets if is teams number bracketable


          // Create groups if is teams number is not bracketable
          (() => {
            if (this.isBracketable()) return;
            let groupTeams = arrShuffle(r.value.team.data).map(team => team.uuid);
  
            let groups = [ ...Array( Math.ceil(r.value.team.data.length / this.options.groupMaxTeams) ).keys() ];
            const teamsPerGroup = Math.ceil(r.value.team.data.length / groups.length);
  
            groups = groups.map((group, index) => {
              group = {
                id: index,
                name: `Group ${index+1}`,
                teams: [],
                matches: [],
              };

              for(let i=0; i<teamsPerGroup; i++) {
                if (!groupTeams.at(0)) continue;
                group.teams.push(groupTeams.shift());
              }

              for(let i=0; i<group.teams.length; i++) {
                for(let ii=i+1; ii<group.teams.length; ii++) {
                  // console.log(`${i}-${ii}`);
                  group.matches.push(this.default({
                    team1_id: group.teams[i],
                    team2_id: group.teams[ii],
                    group: group.id,
                  }));
                }
              }

              return group;
            });

            for(let group of groups) {
              for(let match of group.matches) {
                matches.push(match);
              }
            }

            this.groups = groups;
          })();



          // Create brackets if is teams number bracketable
          (() => {
            if (this.isBracketable()) {
              let match = this.default();
              arrShuffle(r.value.team.data).forEach(team => {
                // console.log(JSON.stringify({ team, match }, ' ', 2));
                if (!match.team1_id) {
                  match.team1_id = team.uuid;
                  return;
                }
  
                match.team2_id = team.uuid;
                match.bracket_step = r.value.team.data.length / 4;
                matches.push(match);
                match = this.default();
              });
            }
  
            let matchesSegmentParent = matches;
            let matchesSegmentData = [];
            let matchesSegmentTotal = matches.length;
            while(matchesSegmentTotal>1) {
              let newMatch = this.default();
              matchesSegmentParent.forEach(match => {
                if (!newMatch.parent1_id) {
                  newMatch.parent1_id = match.uuid;
                  return;
                }
  
                newMatch.bracket_step  = match.bracket_step? match.bracket_step-1: false;
                newMatch.parent2_id = match.uuid;
                matchesSegmentData.push(newMatch);
                newMatch = this.default();
              });
  
              matchesSegmentData.forEach(match => {
                matches.push(match);
              });
  
              matchesSegmentParent = matchesSegmentData;
              matchesSegmentData = [];
              matchesSegmentTotal = matchesSegmentTotal/2;
            }
  
            // for(let i=matches.length-1; i>=0; i--) {
            //   let match = matches[i];
            //   match.bracket_step = ((matches.length-1)-i)/2;
            //   console.log(match);
            // }
          })();

          this.matches = matches;
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