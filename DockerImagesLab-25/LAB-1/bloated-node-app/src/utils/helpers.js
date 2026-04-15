const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

const generateRandomData = (count = 100) => {
  return _.range(count).map(() => ({
    id: uuidv4(),
    value: _.random(1, 10000),
    category: _.sample(["A", "B", "C", "D", "E"]),
    active: _.sample([true, false]),
  }));
};

module.exports = { generateRandomData };
