class Base {
  name = 'No name';

  constructor(lotto, rattles) {
    this.rangeStart = lotto.rangeStart;
    this.rangeFinal = lotto.rangeFinal;
    this.rangePerRow = lotto.rangePerRow;
    this.goods = [];
    this.bads = [];
    if (Array.isArray(rattles) && typeof lotto=='object') {
      this.onInit(lotto, rattles);
    }
  }

  onInit(lotto, rattles) {}

  getRawNumbers(rattles, start=0, final=5) {
    let numbers = [];

    for(let i=start; i<final; i++) {
      if (typeof rattles[i] == 'undefined') continue;
      rattles[i].numbers.forEach(n => numbers.push(n));
    }

    return numbers;
  }
}

class AnalysisProbability extends Base {
  name = 'Mais e menos prováveis';

  onInit(lotto, rattles) {
    const rangeSize = 5;
    this.getGoods(rangeSize, rattles, lotto);
    this.getBads(rangeSize, rattles);
  }

  getGoods(rangeSize, rattles, lotto) {
    let range = {};
    for(let i=lotto.rangeStart; i<=lotto.rangeFinal; i++) {
      range[i] = 0;
    }

    this.getRawNumbers(lotto, 0, rangeSize).forEach(n => {
      range[n]++;
    });

    let numbers = [];
    for(let i in range) {
      if (range[i] > 0) continue;
      numbers.push(parseInt(i));
    }

    this.goods = numbers;
  }

  getBads(rangeSize, rattles) {
    const getDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index);
    let numbers = this.getRawNumbers(rattles, 0, rangeSize);
    this.bads = getDuplicates(numbers);
  }
}

export default class Analysis {
  constructor(lotto, rattles) {
    this.average = {
      goods: [],
      bads: [],
    };
    this.types = [
      new AnalysisProbability(lotto, rattles),
    ];
  }
};