class Base {
  constructor(rattles) {
    this.name = '';
    this.goods = [];
    this.bads = [];
    this.onInit(rattles);
  }

  onInit(rattles = []) {}
}

class Test1 extends Base {
  onInit(rattles) {
    this.name = 'Test 1';
  }
}

class Test2 extends Base {
  onInit(rattles) {
    this.name = 'Test 2';
  }
}

export default class Algorithms {
  constructor(rattles) {
    this.analysis = [
      new Test1(rattles),
      new Test2(rattles),
    ];
    this.rattles = rattles;
  }
};