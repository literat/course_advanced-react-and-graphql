function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function () {
  return new Promise((resolve) => {
    // Simulate an API
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe('mocking learing', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('snickers');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('snickers');
    fetchDogs('hugo');
    expect(fetchDogs).toHaveBeenCalledTimes(2);
    console.log(fetchDogs);
  });

  it('can create a person', () => {
    const me = new Person('Wes', ['pizza', 'bugs']);
    expect(me.name).toBe('Wes');
  });

  it('can fetch food', async () => {
    const me = new Person('Wes', ['pizza', 'bugs']);
    // mock the favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen']);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain('sushi');
  });
});
