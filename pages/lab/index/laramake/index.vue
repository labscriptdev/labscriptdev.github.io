<template>
  <app-layout>
    <v-row>
      <v-col cols="4">
        <div class="bg-grey-lighten-3 pa-4 mb-5 rounded-sm font-weight-bold">
          TABLES
        </div>

        <app-list v-model="laramake.model.list">
          <template #item="bind">
            <v-text-field
              v-model="bind.item.table_name"
              :hide-details="true"
              @update:modelValue="laramake.model.update()"
              @focus="edit.model=bind.item"
            />
          </template>
        </app-list>
      </v-col>
      <v-col cols="8">
        <div v-if="edit.model">
          <div class="bg-grey-lighten-3 pa-4 mb-5 rounded-sm font-weight-bold">
            FIELDS
          </div>
        </div>

        <app-list v-model="edit.model.fields">
          <template #item="bind">
            <div class="d-flex align-center" style="gap:10px;">
              <v-text-field label="Name" v-model="bind.item.name" :hide-details="true" />
              <v-menu offset="10" :close-on-content-click="false" location="bottom end" width="300">
                <template #activator="bind2">
                  <v-btn class="px-10" size="50" v-bind="bind2.props">Type</v-btn>
                </template>
                <v-card>
                  <v-card-title>Field details</v-card-title>
                  <v-card-text>
                    <v-select
                      label="Type" v-model="bind.item.type" :hide-details="true"
                      :items="[
                        { value: 'id', title: 'ID' },
                        { value: 'string', title: 'String' },
                        { value: 'text', title: 'Text' },
                        { value: 'date', title: 'Date' },
                        { value: 'time', title: 'Time' },
                        { value: 'datetime', title: 'Date time' },
                      ]"
                    />
                    <v-text-field
                      label="String size"
                      v-model="bind.item.size"
                      v-if="['string'].includes(bind.item.type)"
                    />
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </template>
        </app-list>
        <br>

        <v-expansion-panels>
          <template v-for="(f, i) in laramake.files">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ i+1 }} - {{ f.file }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="mx-n6 mt-n2 mb-n5">
                  <pre class="bg-blue-grey-darken-4 pa-2" v-if="f.command">{{ f.command }}</pre>
                  <app-monaco :model-value="f.content" language="php" style="height:300px;" />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </template>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </app-layout>
</template>

<script setup>
  import dayjs from 'dayjs';
  import { reactive, computed, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [ String ],
      default: '',
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const useLaramake = () => {
    const r = reactive({
      model: {
        list: [],
        add(merge={}) {
          merge = {
            uuid: r.uuid(),
            table_name: '',
            fields: [
              { name: 'id' },
              { name: 'name' },
              { name: 'created_at' },
              { name: 'updated_at' },
            ],
            migration: { file: '', content: '' },
            model: { file: '', content: '' },
            controller: { file: '', content: '' },
            request: { file: '', content: '' },
            repository: { file: '', content: '' },
            ...merge,
          };

          merge.fields = merge.fields.map((field) => {
            return {
              uuid: r.uuid(),
              name: '',
              type: {
                name: '',
                params: [],
              },
              ...field,
            };
          });
          
          r.model.list.push(merge);
          r.model.update();
        },
        remove(model) {
          const index = r.model.list.indexOf(model);
          r.model.list.splice(index, 1);
          r.model.update();
        },
        update() {
          r.model.list.map((model) => {
            model.migration = r.getMigration(model);
            model.model = r.getModel(model);
            model.controller = r.getController(model);
            model.request = r.getRequest(model);
            model.repository = r.getRepository(model);
          });
        },
      },
      files: computed(() => {
        let files = [];

        r.model.list.map((model) => {
          if (!model.table_name) return;
          ['migration', 'model', 'controller', 'request', 'repository'].map((attr) => {
            files.push(model[ attr ]);
          });
        });

        return files.sort((a,b) => (a.file > b.file) ? 1 : ((b.file > a.file) ? -1 : 0));
      }),

      uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
          .replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) )
          .toString(16) );
      },

      toPascalCase(str) {
        return (str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [])
          .map(x => (x || '').charAt(0).toUpperCase() + x.slice(1).toLowerCase())
          .join('');
      },

      getMigration(model) {
        return {
          file: `/database/migrations/`+ dayjs().format('YYYY_MM_DD_HHmmss_') +`create_${model.table_name}_table.php`,
          command: `php artisan make:migration create_${model.table_name}_table`,
          content: (() => {
            let content = ['<?php', ''];
            content.push(`use Illuminate\\Database\\Migrations\\Migration;`);
            content.push(`use Illuminate\\Database\\Schema\\Blueprint;`);
            content.push(`use Illuminate\\Support\\Facades\\Schema;`);
            content.push('', `return new class extends Migration`, '{');
            content.push(`\tpublic function up(): void`);
            content.push(`\t{`);
            content.push(`\t\tSchema::create('${model.table_name}', function (Blueprint $table) {`);
            content.push(`\t\t\t$table->id();`);
            content.push(`\t\t\t$table->timestamps();`);
            content.push(`\t\t});`);
            content.push(`\t}`);
            content.push(``);
            content.push(`\tpublic function down(): void`);
            content.push(`\t{`);
            content.push(`\t\tSchema::drop('${model.table_name}');`);
            content.push(`\t}`);
            content.push('}', '');
            return content.join("\n");
          })(),
        };
      },

      getModel(model) {
        const modelNamePascal = r.toPascalCase(model.table_name);
        return {
          file: `/app/Models/${modelNamePascal}.php`,
          command: `php artisan make:controller ${modelNamePascal}Controller`,
          content: (() => {
            let content = ['<?php', '', `namespace \\App\\Models;`, ''];
            content.push(`use Illuminate\\Database\\Eloquent\\Model;`, '');
            content.push(`class ${modelNamePascal} extends Model {`);
            content.push(`  protected $fillable = ['name'];`);
            content.push(`}`, '');
            return content.join("\n");
          })(),
        };
      },

      getController(model) {
        const modelNamePascal = r.toPascalCase(model.table_name);
        return {
          file: `/app/Http/Controllers/${modelNamePascal}Controller.php`,
          content: (() => {
            let content = ['<?php', '', `namespace \\App\\Http\\Controllers;`, ''];
            content.push(`class ${modelNamePascal}Controller extends Controller`, '{');
            content.push('}', '');
            return content.join("\n");
          })(),
        };
      },

      getRequest(model) {
        const modelNamePascal = r.toPascalCase(model.table_name);
        return {
          file: `/app/Http/Requests/${modelNamePascal}Request.php`,
          command: `php artisan make:request ${modelNamePascal}Request`,
          content: (() => {
            let content = ['<?php', '', `namespace \\App\\Http\\Requests;`, ''];
            content.push(`class ${modelNamePascal}Request extends Request`, '{');
            content.push('}', '');
            return content.join("\n");
          })(),
        };
      },

      getRepository(model) {
        const modelNamePascal = r.toPascalCase(model.table_name);
        return {
          file: `/app/Repositories/${modelNamePascal}Repository.php`,
          content: (() => {
            let content = ['<?php', '', `namespace \\App\\Http\\Repositories;`, ''];
            content.push(`class ${modelNamePascal}Repository extends Repository`, '{');
            content.push('}', '');
            return content.join("\n");
          })(),
        };
      },
    });
    
    return r;
  };

  const laramake = useLaramake();

  const edit = reactive({
    model: false,
  });

  // laramake.model.add({ table_name: 'user' });
  // laramake.model.add({ table_name: 'shop_store' });
  // laramake.model.add({ table_name: 'shop_product' });
  // laramake.model.add({ table_name: 'shop_product_category' });
  // laramake.model.add({ table_name: 'shop_cart' });
  // laramake.model.add({ table_name: 'shop_order' });
  // laramake.model.add({ table_name: 'shop_order_product' });
  // laramake.model.add({ table_name: 'shop_order_tax' });
  // laramake.model.update();
  // edit.model = laramake.model.list[0];
</script>