<template>
  <app-layout>
    <v-tabs v-model="tab">
      <v-tab value="tables">Tabelas</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="tables">
        <v-row>
          <v-col cols="12" lg="3">
            <v-tabs v-model="tabDatabaseTable" direction="vertical">
              <template v-for="_table in laramake.table.list">
                <v-tab :value="_table.id">{{ _table.name || _table.id }}</v-tab>
              </template>
            </v-tabs>
            <v-btn block @click="tabDatabaseTable = laramake.table.add().id">Criar tabela</v-btn>
          </v-col>
          <v-col cols="12" lg="9">
            <v-window v-model="tabDatabaseTable">
              <template v-for="_table in laramake.table.list">
                <v-window-item :value="_table.id">
                  <v-text-field
                    v-model="_table.name"
                  >
                    <template #prepend-inner>Tabela:</template>
                  </v-text-field>

                  <v-table>
                    <colgroup>
                      <col width="*">
                      <col width="200px">
                      <col width="100px">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>FK</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="_field in _table.fields">
                        <td class="pa-0"><v-text-field v-model="_field.name" v-bind="{hideDetails:true}" /></td>
                        <td class="pa-0">
                          <div class="d-flex">
                            <v-select v-bind="{hideDetails:true}" v-model="_field.fk.table" :items="laramake.table.list.map(item => item.name)" />
                            <v-select v-bind="{hideDetails:true}" v-model="_field.fk.field" :items="laramake.table.fields(_field.fk.table)" />
                          </div>
                        </td>
                        <td>--</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
              </template>
            </v-window>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <v-divider class="my-5" />

    <v-row no-gutters>
      <template v-for="f in laramake.files">
        <v-col cols="4" class="pa-1">
          <pre class="bg-primary pa-2">{{ f.file }}</pre>
          <pre class="bg-grey-darken-4 text-lime pa-2 overflow-auto">{{ f.content }}</pre>
          <!-- <app-monaco :model-value="f.content" style="height:150px;" language="php" /> -->
        </v-col>
      </template>
    </v-row>

    <!-- <pre>{{ laramake }}</pre> -->
    <!-- <pre>{{ laramake }}</pre> -->
  </app-layout>
</template>

<script>
  import { ref, computed } from 'vue';

  export default {
    meta: {
      active: false,
      icon: 'mdi-laravel',
      name: 'Gerador Laravel',
      description: 'Criar arquivos para o frameworl Laravel baseado em estrutura de banco de dados',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/laramake',
    },

    data() {
      return {
        tab: 'tables',
        tabDatabaseTable: false,
        laramake: useLaramake(),
      };
    },
  };

  const useLaramake = () => {
    const uuid = (prefix='') => {
      return (prefix+ [1e8] + 0).replace(/[018]/g, c =>
        ( c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) ).toString(16)
      );
    };

    const fieldDefault = (merge = {}) => {
      return {
        id: uuid('field-'),
        name: '',
        type: '',
        fk: { table: null, field: null },
        ...merge
      };
    };

    const tableFields = (table) => {
      return [];
    };

    const settings = ref({
      appName: '',
    });

    const table = ref({
      list: [],
      default(merge = {}) {
        merge.fields = (Array.isArray(merge.fields) ? merge.fields : [
          { name: 'id', type: '' },
          { name: 'name', type: 'varchar(255)' },
          { name: 'created_at', type: 'datetime' },
          { name: 'updated_at', type: 'datetime' },
          { name: 'deleted_at', type: 'datetime' },
        ]).map(fieldDefault);

        return {
          id: uuid('table-'),
          name: '',
          fields: [],
          ...merge
        };
      },
      add(item = {}) {
        item = this.default(item);
        this.list.push(item);
        return item;
      },
      remove(item) {
        console.log(item);
      },
      fields(tableName) {
        if (!tableName) return [];
        return this.list.filter(table => table.name==tableName)
          .at(0).fields.map(field => field.name);
      },
    });

    table.value.add({ name: 'app_user' });
    table.value.add({ name: 'app_group' });
    table.value.add({ name: 'app_user_group', fields: [
      { name: 'user_id', fk: { table: 'app_user', field: 'id' } },
      { name: 'group_id', fk: { table: 'app_group', field: 'id' } },
    ] });

    const toPascalCase = str => {
      return (str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [])
        .map(x => (x || '').charAt(0).toUpperCase() + x.slice(1).toLowerCase())
        .join('');
    }

    const files = computed(() => {
      let files = [];

      table.value.list.forEach(table => {
        const tableName = toPascalCase(table.name);
        files.push({
          file: `/app/Models/${tableName}.php`,
          content: (() => {
            const fillable = table.fields
              .filter(field => !['id', 'created_at', 'updated_at', 'deleted_at'].includes(field.name))
              .map(field => `'${field.name}'`)
              .join(', ');
            const lines = ['<?php', '', `namespace \\App\\Models;`, ''];
            lines.push('use Illuminate\\Database\\Eloquent\\Model;', '');
            lines.push(`class ${tableName} extends Model {`);
            lines.push(`  protected $table = '${table.name}';`);
            lines.push(`  protected $fillable = [${fillable}];`);
            lines.push(`}`, '');
            return lines;
          })(),
        });
      });
      
      table.value.list.forEach(table => {
        const tableName = toPascalCase(table.name);
        files.push({
          file: `/app/Repositories/${tableName}Repository.php`,
          content: (() => {
            const lines = ['<?php', '', `namespace \\App\\Repositories;`, ''];
            lines.push(`class ${tableName}Repository {`);
            lines.push(`}`, '');
            return lines;
          })(),
        });
      });

      table.value.list.forEach(table => {
        const tableName = toPascalCase(table.name);
        files.push({
          file: `/app/Http/Controllers/${tableName}Controller.php`,
          content: (() => {
            const lines = ['<?php', '', `namespace \\App\\Http\\Controllers;`, ''];
            lines.push(`use Illuminate\\Http\\Request;`);
            lines.push('');
            lines.push(`class ${tableName}Controller extends Controller {`, '');
            lines.push(`  public function __construct() {`);
            lines.push(`    $this->middleware('auth:api', [`);
            lines.push(`      'except' => [],`);
            lines.push(`    ]);`);
            lines.push(`  }`, '');
            lines.push(`  public function index() {`);
            lines.push(`  }`, '');
            lines.push(`  public function show() {`);
            lines.push(`  }`, '');
            lines.push(`  public function store() {`);
            lines.push(`  }`, '');
            lines.push(`  public function update() {`);
            lines.push(`  }`, '');
            lines.push(`  public function delete() {`);
            lines.push(`  }`, '');
            lines.push(`}`, '');
            return lines;
          })(),
        });
      });
      
      files.push({
        file: `/routes/api.php`,
        content: (() => {
          const lines = ['<?php', ''];
          table.value.list.forEach(table => {
            const tableName = toPascalCase(table.name);
            lines.push(`Route::apiResource('${table.name}', \\App\\Http\\Controllers\\${tableName}Controller::class);`);
          });
          lines.push('');
          return lines;
        })(),
      });

      return files.map(file => {
        if (Array.isArray(file.content)) {
          file.content = file.content.join("\n");
        }
        return file;
      });
    });

    return {
      settings,
      table,
      files,
    };
  };

  class LaramakeBase {
    constructor(params = {}) {
      this.uuid = params.uuid || this.uuid();
      this.onInit(params);
    }

    onInit(params = {}) {}

    uuid(prefix='') {
      return (prefix+ [1e8] + 0).replace(/[018]/g, c =>
        ( c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) ).toString(16)
      );
    }

    root() {
      // let currentThis = this;
      // while (currentThis) {
      //   if (currentThis instanceof LaramakeApp) {
      //     return currentThis;
      //   }
      //   currentThis = currentThis.parent();
      // }
    }

    newInstance(staticClass, params) {
      params = new staticClass(params);
      let me = this;
      params.parent = function() { return me; };
      return params;
    }

    newInstances(staticClass, arr) {
      return (arr || []).map(item => this.newInstance(staticClass, item));
    }

    remove(attr, uuid) {
      if (typeof uuid=='object') uuid = uuid.uuid;
      let items = this[attr] || [];
      items.forEach((item, index) => {
        if (item.uuid != uuid) return;
        items.splice(index, 1);
      });
    }
  }


  class LaramakeApp extends LaramakeBase {
    onInit(params = {}) {
      this.storeId = params.storeId || false;

      if (this.storageData()) {
        params = this.storageData();
      }

      this.name = params.name || '';
      this.database = this.newInstance(LaramakeDatabase, params.database || {});

      const objProxy = new Proxy(this, {
        set: function (target, key, value) {
          console.log(`${key} set from ${obj.foo} to ${value}`);
          // target[key] = value;
          return true;
        },
      });
    }

    storageData() {
      if (!this.storeId) return false;
      try {
        return JSON.parse(localStorage.getItem(this.storeId) || 'false') || false;
      } catch(err) {
        return false;
      }
    }

    storageSave() {
      localStorage.setItem(this.storeId, JSON.stringify(this));
    }

    databaseTableAdd(params = {}) {
      this.database.tables.push(this.newInstance(LaramakeDatabaseTable, params));
      this.storageSave();
    }

    databaseTableRemove(table) {
      const index = this.database.tables.indexOf(table);
      this.database.tables.splice(index, 1);
      this.storageSave();
    }

    databaseTablesList() {
      return this.database.tables.map(item => item.name);
    }

    databaseTableFieldsList(tableName) {
      if (!tableName) return [];
      for(let i in this.database.tables) {
        let table = this.database.tables[i];
        if (table.name==tableName) {
          return table.fields.map(item => item.name);
        }
      }
      return [];
    }

    projectDownload() {
      const content = JSON.stringify(this, ' ', 2);
      const blob = new Blob([content], { type: 'application/json' });

      const link = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: `${this.name}.json`,
      }).click();
    }

    files() {
      let files = [];

      this.database.tables.forEach(table => {
        try {
          let studlyName = laravelJsStr.studly(table.name);
          let file = `/app/Models/${studlyName}.php`;
          let fillable = JSON.stringify(table.fields
            .map(field => field.name)
            .filter(field => !['created_at', 'updated_at'].includes(field))
          ).replace(/"/g, "'");

          let content = ['<?php', ''];
          content.push(`namespace App\\Models;`, '');
          content.push(`use Illuminate\\Database\\Eloquent\\Model;`, '');
          content.push(`class ${studlyName} extends Model {`);
          content.push(`  use HasFactory;`, '');
          content.push(`  protected $table = '${table.name}';`);
          content.push(`  protected $fillable = ${fillable};`);
          content.push(`}`);

          files.push({ file, content: content.join("\n") });
        } catch(err) {}
      });

      this.database.tables.forEach(table => {
        try {
          let studlyName = laravelJsStr.studly(table.name) +'Controller';
          let file = `/app/Http/Controllers/${studlyName}.php`;

          let content = ['<?php', ''];
          content.push(`namespace App\\Http\\Controllers;`, '');
          content.push(`use Illuminate\\Http\\Request;`);
          content.push(`use Illuminate\\Support\\Facades\\Route;`, '');
          content.push(`class ${studlyName} extends Controller {`);
          content.push(`}`);

          files.push({ file, content: content.join("\n") });
        } catch(err) {}
      });

      let content = [
        `<?php`,
        '',
        'use Illuminate\\Http\\Request;',
        'use Illuminate\\Support\\Facades\\Route;',
        '',
      ];

      this.database.tables.forEach(table => {
        try {
          let studlyName = laravelJsStr.studly(table.name) +'Controller';
          content.push(`Route::apiResource('${table.name}', '\\App\\Http\\Controllers\\${studlyName}');`);
        } catch(err) {}
      });

      files.push({
        file: `/routes/api.php`,
        content: content.join("\n"),
      });

      return files;
    }
  }


  class LaramakeDatabase extends LaramakeBase {
    onInit(params = {}) {
      this.tables = this.newInstances(LaramakeDatabaseTable, params.tables || []);
    }

    diagramSource() {
      let source = [];

      this.tables.forEach(table => {
        source.push(`[${table.name}]`);
        table.fields.forEach(field => {
          let field_name = [];
          if (field.fk_table && field.fk_field) {
            field_name.push('+');
          }
          field_name.push(field.name);
          source.push(field_name.join(''));
        });
        source.push('');
      });

      this.tables.forEach(table => {
        table.fields.forEach(field => {
          if (!field.fk_table || !field.fk_field) return;
          source.push(`${table.name} *--* ${field.fk_table}`);
        });
      });

      return source.join("\n");
    }

    diagramUrl() {
      const source = this.diagramSource();
      // console.clear(); console.log(source);
      let data = new TextEncoder('utf-8').encode(source);
      data = pako.deflate(data, { level: 9, to: 'string' });
      data = btoa(data) .replace(/\+/g, '-').replace(/\//g, '_');
      return `https://kroki.io/erd/svg/${data}`;
    }
  }


  class LaramakeDatabaseTable extends LaramakeBase {
    onInit(params = {}) {
      this.name = params.name || '';
      this.fields = this.newInstances(LaramakeDatabaseTableField, params.fields || [
        { name: 'id', type: 'id' },
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'datetime' },
        { name: 'updated_at', type: 'datetime' },
      ]);
    }

    fieldAdd(param = {}) {
      this.fields.push(this.newInstance(LaramakeDatabaseTableField, param));
    }

    fieldRemove(field) {
      const index = this.fields.indexOf(field);
      this.fields.splice(index, 1);
    }
  }


  class LaramakeDatabaseTableField extends LaramakeBase {
    onInit(params = {}) {
      this.name = params.name || '';
      this.type = params.type || '';
      this.fk_table = params.fk_table || null;
      this.fk_field = params.fk_field || null;
    }

    typesList() {
      return [
        {
          id: 'id',
          name: 'ID',
          type: 'bigint',
        },
        {
          id: 'string',
          name: 'Simple text',
          type: 'varchar(255)',
        },
        {
          id: 'text',
          name: 'Big text',
          type: 'text',
        },
        {
          id: 'enum',
          name: 'Enum',
          type: 'enum()',
        },
        {
          id: 'datetime',
          name: 'Date time',
          type: 'datetime',
        },
        {
          id: 'decimal',
          name: 'Decimal',
          type: 'decimal(10, 2)',
        },
        {
          id: 'file',
          name: 'File',
          type: 'BLOB',
        },
        {
          id: 'relation',
          name: 'Relation',
          type: 'bigint',
        },
      ];
    }
  };
</script>