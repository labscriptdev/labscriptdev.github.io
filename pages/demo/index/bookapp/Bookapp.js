class BookappBase {
  uuid(prefix='') {
    return (prefix+ [1e8] + 0).replace(/[018]/g, c =>
      ( c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))) ).toString(16)
    );
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
}

class Bookapp extends BookappBase {
  constructor(params = {}) {
    super();
    this.name = params.name || 'Bookapp';
    this.dependencies = this.newInstances(BookappDependency, params.dependencies || []);
    this.source = params.source || '';
  }

  dependencyAdd(params = {}) {
    this.dependencies.push(this.newInstance(BookappDependency, params));
  }

  dependencyRemove(depend) {
    const index = this.dependencies.indexOf(depend);
    this.dependencies.splice(index, 1);
  }

  build() {
    let lines = [];

    // lines.push(`((run = false) => {`);
    // lines.push(`  const appData = ${JSON.stringify(this)};`);
    // lines.push(`  if (!run) return appData;`);
    // lines.push(``);
    // lines.push(`  const promises = appData.dependencies.map((asset, index) => {`);
    // lines.push(`    return new Promise((resolve, reject) => {`);
    // lines.push(`      document.body.appendChild(Object.assign(document.createElement(asset.tag), asset, {`);
    // lines.push(`        src: asset.url,`);
    // lines.push(`        href: asset.url,`);
    // lines.push(`        rel: 'stylesheet',`);
    // lines.push(`        onload: ev => { resolve(); },`);
    // lines.push(`      }));`);
    // lines.push(`    });`);
    // lines.push(`  });`);
    // lines.push(``);
    // lines.push(`  Promise.all(promises).then(resp => {`);
    // lines.push(decodeURI(this.source));
    // lines.push(`  });`);
    // lines.push(`  return appData;`);
    // lines.push(`})`);

    lines.push(`(() => {`);
    lines.push(`  return new class {`);
    lines.push(`    constructor() {`);
    lines.push(`      this.dependencies = ${JSON.stringify(this.dependencies)};`);
    lines.push(`      this.source = ${JSON.stringify(this.source)};`);
    lines.push(`      console.log(this);`);
    lines.push(`    }`);
    lines.push(`    run() {`);
    lines.push(`      document.body.innerHTML = 'Hello World'`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(`})()`);

    lines = lines.join("\n");
    lines = lines.replace(/\n|\t/gi, ' ').replace(/\s+/gi, ' ');

    // let assets = this.dependencies.map(item => {
    //   return new Promise((resolve, reject) => {
    //     console.log(item);
    //   });
    // });
    // console.log(assets);

    return lines;
  }
}


class BookappDependency extends BookappBase {
  constructor(params = {}) {
    super();
    this.id = this.uuid('asset-');
    this.url = params.url || 'https://cdn.com/package.js';
    this.tag = params.tag || 'link';
  }
}

export {
  Bookapp,
  BookappDependency,
};
