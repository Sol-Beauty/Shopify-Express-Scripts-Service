const db = require("../helpers/firebaseDB.js");
const _ = require("lodash");
const { user } = require("firebase-functions/lib/providers/auth");
const { first } = require("lodash");
/**
 * User Repository
 */
var rep = {};
rep.getFirst = (snapshot) => {
  var first = {};
  if (snapshot.empty) {
    throw Error(404);
  }
  snapshot.forEach((doc) => {
    // console.log(doc.id);
    first = doc.data();
    // console.log(first);
    return;
  });
  return first;
};

rep.getQueryRefId = async (uid) => {
  const usersRef = db.collection("users");
  return await usersRef.where("uid", "==", uid).get();
};

rep.getQueryRefEmail = async (email) => {
  const usersRef = db.collection("users");
  return await usersRef.where("email", "==", email).get();
};

rep.getById = async (uid) => {
  try {
    console.log(uid);

    return rep.getFirst(await rep.getQueryRefId(uid));
  } catch (e) {
    if (e.message == 404) {
      console.log("el error es", uid, e.message);
      throw Error("user not found", 404);
    }
    throw e;
  }
};

rep.getByEmail = async (email) => {
  try {
    console.log(email);
    return rep.getFirst(await rep.getQueryRefEmail(email));
  } catch (e) {
    if (e.message == 404) {
      console.log("el error es", email, e.message);
      throw Error("user not found", 404);
    }
    throw e;
  }
};

rep.updateByUID = async (uid, json) => {
  try {
    console.log(uid);
    return rep.updateSnapshot(await rep.getQueryRefId(uid), json);
  } catch (e) {
    if (e.message == 404) {
      console.log("el error es", uid, e.message);
      throw Error("user not found", 404);
    }
    throw e;
  }
};

rep.updateSnapshot = async (snapshot, json) => {
  var update = false;
  if (snapshot.empty) {
    throw Error(404);
  }
  await snapshot.forEach(async (doc) => {
    update = await rep.update(doc.id, json);
    return;
  });
  return true;
};

rep.update = async (docId, json) => {
  await db.collection("users").doc(docId).update(json);
  return true;
};
module.exports = rep;
