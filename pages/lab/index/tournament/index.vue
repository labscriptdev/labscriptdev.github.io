<template>
  <app-layout>
    <v-row>
      <v-col cols="3" class="border">
        <v-btn block @click="tour.team.add()">team add</v-btn>
        <br>
        <v-list>
          <v-list-subheader>Teams</v-list-subheader>
          <v-list-item
            v-for="t in tour.team.data"
            :key="t.id"
          >
            {{ t.name }}
    
            <template #append>
              <v-btn size="small" flat icon="mdi-close" @click="tour.team.remove(t)"></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="3" class="border">
        <pre>{{ tour }}</pre>
      </v-col>
      
      <v-col cols="6" class="border">
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
            <tr v-for="(m, i) in tour.matches">
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
        <br>
        <v-table class="border">
          <thead>
            <tr>
              <th></th>
              <th>Teams</th>
            </tr>
          </thead>
          <tbody style="font-family:monospace;">
            <tr v-for="(m, i) in tour.team.data">
              <td width="10px">{{ i+1 }}</td>
              <td>{{ m.name }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </app-layout>
</template>

<script setup>
  const useTournamentBracketsGenerator = () => {
    const r = ref({
      uuid() {
        return ('' + 1e4).replace(/[018]/g, c => ( c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) ).toString(16));
      },

      team: {
        data: [],
        add(data) {
          const uuid = r.value.uuid();
          data = data || { name: `Team ${uuid}` };
          this.data.push({ uuid, ...data });
        },
        remove(data) {
          const index = this.data.indexOf(data);
          this.data.splice(index, 1);
        },
      },

      match: {
        default(data={}) {
          return {
            uuid: r.value.uuid(),
            name: '',
            team1_id: false,
            team2_id: false,
            winner_id: false,
            parent1_id: false,
            parent2_id: false,
            bracket_step: false, // 0:final, 1:semifinal, 2:quarters, 3:octaves, etc
            group: false,
            ...data
          };
        },
        generate() {
          console.clear();
          const arrShuffle = ([...arr]) => { let m = arr.length; while (m) { const i = Math.floor(Math.random() * m--); [arr[m], arr[i]] = [arr[i], arr[m]]; } return arr; };

          let matches = [];

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

          return matches;
        },
        isBracketable() {
          return [ 2, 4, 8, 16 ].includes(r.value.team.data.length);
        },
      },

      matches: computed(() => {
        return r.value.match.generate();
      }),
    });

    return r;
  };

  const tour = useTournamentBracketsGenerator();
  for(let i=1; i<=8; i++) tour.value.team.add();
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