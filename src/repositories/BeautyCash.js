const userRep = require("./User");

/**
 * BeautyCash Repository
 */
var rep = {};

/**
 * get the beauty cash (puntos)
 * @param {string} email
 */
rep.getCash = async (email) => {
  // console.log(uid);
  const user = await userRep.getByEmail(email);
  return user ? (user.puntos ? user.puntos : 0) : null;
};

/**
 * get the level user
 * @param {string} email
 */
rep.getLevel = async (email) => {
  const user = await userRep.getByEmail(email);
  // console.log(user);
  return user ? user.nivel : null;
};

rep.getPercent = (level) => {
  if (level === 4) return 0.2;
  if (level === 3) return 0.1;
  if (level === 2) return 0.07;
  if (level === 1) {
    return 0.05;
  }
  return 0.03;
};

rep.calculateCash = (puntos, nivel, toSpend, subtotal) => {
  // console.log(user);
  const nowCash = isNaN(puntos) ? 0 : Number(puntos);
  const percent = rep.getPercent(nivel);
  const toSpend1 = isNaN(toSpend) ? 0 : Number(toSpend);
  const total = isNaN(subtotal) ? 0 : Number(subtotal);
  const cashToAdd = percent * total;
  const cashSpend = nowCash - toSpend1;
  // console.log({total, cashToAdd, cashSpend, nowCash, toSpend1});
  const finalCash = Number((cashToAdd + cashSpend).toFixed(2));

  // console.log({total, cashToAdd, cashSpend, nowCash,toSpend, toSpend1, finalCash});
  return finalCash;
};

rep.calculateLevel = (totalSpend) => {
  const spend = Number(totalSpend) + 0.0;
  if (spend > 4000) {
    return 3;
  } else if (spend > 2000) {
    return 2;
  } else if (spend > 750) {
    return 1;
  }
  return 0;
};

/**
 * get the total spend
 * @param {int} uid
 */
rep.getTotalSpend = async (uid) => {
  const user = await userRep.getById(uid);
  // console.log(user);
  return user ? user.total_spend : null;
};

/**
 * add spend billing to total spend
 * @param {int} uid
 * @param {number} spend
 */
rep.addTotalSpend = async (uid, spend) => {
  if (spend == null || spend == "") return false;
  const user = await userRep.getById(uid);
  const total = (Number(user.total_spend) + Number(spend) + 0.0).toFixed(2);
  if (user) {
    if (await userRep.updateByUID(uid, { total_spend: total })) {
      return total;
    }
  }
  return -1;
};

/**
 *
 * @param {string} email
 * @param {number} toSpend
 */
rep.validSpendCashByEmail = async (email, toSpend) => {
  const cash = await rep.getCash(email);
  // console.log('cash', cash);
  return rep.validSpendCash(cash, toSpend);
};

rep.validSpendCash = (cash, toSpend) => {
  // console.log('init ',cash, toSpend);
  const funds = isNaN(cash) ? 0 : Number(cash);
  const beautyCash = isNaN(toSpend) ? 0 : Number(toSpend);
  if (toSpend == null) return false;
  // console.log("valid");
  // console.log(funds, beautyCash, beautyCash <= funds);
  return beautyCash <= funds;
};

/**
 * json response if is valid spend the beuty cash
 * @param {string} email
 * @param {number} toSpendCash
 */
rep.validate = async (email, toSpendCash) => {
  console.log(toSpend);
  var valid = await rep.validSpendCashByEmail(email, toSpendCash);
  if (valid) {
    return {
      valid,
      data: {
        to_spend: toSpend,
      },
      error: false,
    };
  }
  return {
    valid: false,
    data: {
      to_spend: toSpend,
    },
    error: false,
  };
};

rep.findByEmail = async (email) => {
  return (user = await userRep.getByEmail(email));
};

rep.burnCash = async (email, spendTo, total, testing) => {
  var first = {};
  var id = null;
  var jsonUpdate = {};
  var valid = false;
  var update = false;
  const toSpendCash = isNaN(spendTo) ? 0 : Number(spendTo);
  const snapshot = await userRep.getQueryRefEmail(email);
  if (snapshot.empty) {
    throw Error(404);
  }

  snapshot.forEach(async (doc) => {
    id = doc.id;
    first = doc.data();
    // console.log(first);
    const { puntos, nivel, total_spend } = doc.data();
    valid = rep.validSpendCash(puntos, toSpendCash);
    if (valid) {
      // console.log('valid');
      jsonUpdate = rep.addCashById(
        id, puntos, nivel, toSpendCash, total_spend, total
      );
      if (!testing) {
        update = await userRep.update(id, {
          puntos: jsonUpdate.cash,
          total_spend: jsonUpdate.total_spend,
          nivel: jsonUpdate.level,
        });
      }
    }
    return;
  });
  return { valid, update, data: jsonUpdate };
};

rep.addCashById = (id, puntos, nivel, toSpend, total_spend, total) => {
  var jsonUpdate = {};
  jsonUpdate.cash = rep.calculateCash(puntos, nivel,toSpend, total);
  // jsonUpdate.cash = 160.00;
  jsonUpdate.total_spend = Number(
    (Number(total) + Number(total_spend) + 0.0).toFixed(2)
  );
  // jsonUpdate.total_spend = 2000;
  jsonUpdate.level = rep.calculateLevel(jsonUpdate.total_spend);
  console.log("update", id, {
    puntos: jsonUpdate.cash,
    total_spend: jsonUpdate.total_spend,
    nivel: jsonUpdate.level,
  });
  return jsonUpdate;
};

module.exports = rep;
