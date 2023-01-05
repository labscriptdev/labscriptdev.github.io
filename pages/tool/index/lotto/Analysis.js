class Base {
  name = 'No name';

  constructor(lotto, rattles) {
    this.tests = [];
    this.goods = [];
    this.bads = [];
    if (Array.isArray(rattles) && typeof lotto=='object') {
      this.onInit(lotto, rattles);
      this.goods = this.getGoods(lotto, rattles);
      this.bads = this.getBads(lotto, rattles);
      this.tests = this.getTests(lotto, rattles);
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

  getTests(lotto, rattles) {
    rattles = rattles.reverse();

    let test = {
      goods: {
        tests: 0,
        success: 0,
        percent: 0,
      },
      bads: {
        tests: 0,
        success: 0,
        percent: 0,
      },
    };

    for(let i=0; i<=rattles.length; i++) {
      let rattlesOld = rattles.filter((rattle, index) => {
        return index <= i;
      });
      if (rattlesOld.length==0) continue;

      let rattleNext = rattles[ i+1 ] || false;
      if (!rattleNext) continue;

      const intersection = (a, b) => {
        const s = new Set(b);
        return [...new Set(a)].filter(x => s.has(x));
      };

      let goods = this.getGoods(lotto, rattlesOld);
      let goodsIntersecs = intersection(goods, rattleNext.numbers);
      test.goods.tests++;
      if (goodsIntersecs.length>0) test.goods.success++;

      let bads = this.getBads(lotto, rattlesOld);
      let badsIntersecs = intersection(bads, rattleNext.numbers);
      test.bads.tests++;
      if (badsIntersecs.length>0) test.bads.success++;
    }

    test.goods.percent = (100 * test.goods.success) / test.goods.tests;
    test.bads.percent = (100 * test.bads.success) / test.bads.tests;

    return [
      { name: 'Previsão de "Numeros bons" contendo acertos', percent: test.goods.percent },
      { name: 'Previsão de "Numeros ruins" contendo acertos', percent: test.bads.percent },
    ];
  }
}

class AnalysisProbability extends Base {
  name = 'Mais provaveis dos últimos 3 sorteios, menos provaveis dos últimos 10 sorteios';
  rangeSizeGoods = 3;
  rangeSizeBads = 10;

  getGoods(lotto, rattles) {
    let count = {};
    for(let i=lotto.rangeStart; i<=lotto.rangeFinal; i++) {
      count[i] = 0;
    }
    
    this.getRawNumbers(rattles, 0, this.rangeSizeGoods).forEach(n => {
      count[n]++;
    });

    let numbers = [];
    for(let i in count) {
      if (count[i] > 0) continue;
      numbers.push(parseInt(i));
    }

    return numbers;
  }

  getBads(lotto, rattles) {
    const getDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index);
    let numbers = this.getRawNumbers(rattles, 0, this.rangeSizeBads);
    return getDuplicates(numbers);
  }
}

export default class Analysis {
  constructor(lotto, rattles) {
    // this.average = {
    //   goods: [],
    //   bads: [],
    // };
    this.types = [
      new AnalysisProbability(lotto, rattles),
    ];
  }
};