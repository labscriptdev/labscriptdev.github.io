export default class {
  constructor(data = {}) {
    this.users = data.users || [];
    this.spends = data.spends || [];
  }

  uuid() {
    return ([1e8] + 0).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  userDefault(item = {}) {
    return {
      id: this.uuid(),
      name: '',
      ...item
    };
  }

  userAdd(user = {}) {
    this.users.push(this.userDefault(user));
  }
  
  spendDefault(item = {}) {
    return {
      id: this.uuid(),
      name: '',
      amount: 0,
      users: [],
      ...item
    };
  }

  spendAdd(spend = {}) {
    this.spends.push(this.spendDefault(spend));
  }

  result() {
    let users = JSON.parse(JSON.stringify(this.users)).map(user => {
      let amount = this.spends
        .filter(item => item.users.includes(user.id))
        .reduce((total, item) => {
          return total + (item.amount / item.users.length);
        }, 0);
      return {
        ...user,
        amount,
      };
    });

    return { users };
  }

  demo() {
    this.users = [
      this.userDefault({
        id: '2a8c0315dc',
        name: 'Fulano',
      }),
      this.userDefault({
        id: 'ede8a46c89',
        name: 'Sicrano (Não bebe)',
      }),
      this.userDefault({
        id: '620461e72f',
        name: 'Beltrano (Não come carne)',
      }),
    ];

    this.spends = [
      this.spendDefault({
        id: 'a1839aff98',
        users: ['2a8c0315dc', 'ede8a46c89'],
        name: 'Carnes churras',
        amount: 80,
      }),
      this.spendDefault({
        id: '47465abc9e',
        users: ['2a8c0315dc', '620461e72f'],
        name: 'Cervejas',
        amount: 100,
      }),
      this.spendDefault({
        id: '3493962f3b',
        users: ['2a8c0315dc', 'ede8a46c89', '620461e72f'],
        name: 'Aperitivos',
        amount: 30,
      }),
    ];
  }
};