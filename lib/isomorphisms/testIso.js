
import * as util from "../util.js"
import cNode from "../cNode.js"

import * as isoTreeHrp from "./iso1-Tree-Hrp.js"
import * as isoTreeHrs from "./iso2-Tree-Hrs.js"
import * as isoTreeHlvl from "./iso3-Tree-Hlvl.js"
import * as isoTreeHpre from "./iso4-Tree-Hpre.js"
import * as isoTreeHs from "./iso5-Tree-Hs.js"
import * as isoTreeHlen from "./iso6-Tree-Hlen.js"
import * as isoHlenHlvl from "./iso7-Hlen-Hlvl.js"

import * as encLvl from "../encodings/enc2-Lvl.js"
import * as encLen from "../encodings/enc3-Len.js"

//########//########//########//########//########
//========//========//========//========//========

export function run(root) {
  try {
    //- Hrp, Hrs, Hlvl
    //testTreeHrp(root);
    //testTreeHrs(root);
    //testTreeHlvl(root);

    //- Hpre, Hs, Hlen
    //testTreeHpre(root);
    //testTreeHs(root);
    //testTreeHlen(root);

    //- Hlvl, Hlen
    testHlvlToHlen(root);
    testHlenToHlvl(root);
    debugger;
  } catch(error) {
    console.log(error);
    console.log(error.stack);
    debugger;
  }
}

//========//========//========//========//========

function testEqual(root, result) {
  let ret = root.testEqual(result);
  return (ret == 0) ? "ok" : "ERROR (!!!)";
}

//########//########//########//########//########
//========//========//========//========//========
//- (Tree <-> Hrp)

function testTreeHrp(root) {
  root = root.clone();
  let ret = null;

  ret = isoTreeHrp.encodeHrp(root);
  console.log("encoding (hrp, PRE)");
  console.log("N", ret.n);
  console.log("Hrp", ret.hrp);

  ret = isoTreeHrp.decodeHrp(ret.n, ret.hrp);
  console.log("decode", testEqual(root, ret));
}

//========//========//========//========//========
//- (Tree <-> Hrs)

function testTreeHrs(root) {
  root = root.clone();
  let ret = null;

  ret = isoTreeHrs.encodeHrs(root);
  console.log("encoding (hrs, PRE)");
  console.log("N", ret.n);
  console.log("Hrs", ret.hrs);

  ret = isoTreeHrs.decodeHrs(ret.n, ret.hrs);
  console.log("decode", testEqual(root, ret));
}

//========//========//========//========//========
//- (Tree <-> Hlvl)

function testTreeHlvl(root) {
  root = root.clone();
  let ret = null;

  ret = isoTreeHlvl.encodeHlvl(root);
  console.log("encoding (lvl, PRE)");
  console.log("N", ret.n);
  console.log("Hlvl", ret.lvl);

  ret = isoTreeHlvl.decodeHlvl(ret.n, ret.lvl);
  console.log("decode", testEqual(root, ret));
}

//########//########//########//########//########
//========//========//========//========//========
//- (Tree <-> Hpre)

function testTreeHpre(root) {
  root = root.clone();
  let ret = null;

  ret = isoTreeHpre.encodeHpre(root);
  console.log("encoding (hpre, PRE)");
  console.log("N", ret.n);
  console.log("Hpre", ret.hpre);

  ret = isoTreeHpre.decodeHpre(ret.n, ret.hpre);
  console.log("decode", testEqual(root, ret));
}

//========//========//========//========//========
//- (Tree <-> Hs)

function testTreeHs(root) {
  root = root.clone();
  let ret = null;

  ret = isoTreeHs.encodeHs(root);
  console.log("encoding (hs, PRE)");
  console.log("N", ret.n);
  console.log("Hs", ret.hs);

  ret = isoTreeHs.decodeHs(ret.n, ret.hs);
  console.log("decode", testEqual(root, ret));
}

//========//========//========//========//========
//- (Tree <-> Hlen)

function testTreeHlen(root) {
  root = root.clone();
  let ret = null;

  ret = isoTreeHlen.encodeHlen(root);
  console.log("encoding (len, PRE)");
  console.log("N", ret.n);
  console.log("Hs", ret.len);

  ret = isoTreeHlen.decodeHlen(ret.n, ret.len);
  console.log("decode", testEqual(root, ret));
}

//########//########//########//########//########
//========//========//========//========//========
//- (Hlvl -> Hlen)

function testHlvlToHlen(root) {
  console.log("convert (lvl -> len)");
  root = root.clone();
  let ret = null;

  //- create the level-based encoding
  //- 1  2  2  3  3  4  4  2  3 - lvl
  ret = encLvl.encodePRE(root);
  console.log("LVL", ret.lvl);

  //- convert to a length-based encoding
  //- 9  1  5  1  3  1  1  2  1 - len
  ret = isoHlenHlvl.convLvlToLen(ret.n, ret.lvl);
  console.log("LEN", ret.len);

  //- decode the length-based encoding
  ret = encLen.decodePRE(ret.n, ret.len);
  console.log("decode", testEqual(root, ret));
}

//========//========//========//========//========
//- (Hlen -> Hlvl)

function testHlenToHlvl(root) {
  console.log("convert (len -> lvl)");
  root = root.clone();
  let ret = null;

  //- create the length-based encoding
  //- 9  1  5  1  3  1  1  2  1 - len
  ret = encLen.encodePRE(root);
  console.log("LEN", ret.len);

  //- convert to a level-based encoding
  //- 1  2  2  3  3  4  4  2  3 - lvl
  ret = isoHlenHlvl.convLenToLvl(ret.n, ret.len);
  console.log("LVL", ret.lvl);

  //- decode the level-based encoding
  ret = encLvl.decodePRE(ret.n, ret.lvl);
  console.log("decode", testEqual(root, ret));
}
