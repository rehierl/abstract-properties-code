
import * as util from "../util.js"
import * as encLvl from "../encodings/enc2-Lvl.js"
import * as encLen from "../encodings/enc3-Len.js"

import * as isoTreeHrp from "./iso-1-0-Tree-Hrp.js"
import * as isoTreeHrs from "./iso-1-1-Tree-Hrs.js"
import * as isoTreeHlvl from "./iso-1-2-Tree-Hlvl.js"
import * as isoHrpHlvl from "./iso-1-3-Hrp-Hlvl.js"

import * as isoTreeHpre from "./iso-2-0-Tree-Hpre.js"
import * as isoTreeHs from "./iso-2-1-Tree-Hs.js"
import * as isoTreeHlen from "./iso-2-2-Tree-Hlen.js"
import * as isoHpreHlen from "./iso-2-3-Hpre-Hlen.js"

import * as isoHlenHlvl from "./iso-3-0-Hlen-Hlvl.js"

//########//########//########//########//########
//========//========//========//========//========

// default pre-order (PRE)                              a
// -------------------------------------------   ---------------
// a  b  c  d  e  f  g  h  i - n, trace           b    c      h
// 1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
// 0  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
// 1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
// 9  1  5  1  3  1  1  2  1 - len, node.len           f   g
// 9  2  7  4  7  6  7  9  9 - lst, node.lst
// ------------------------------------------
// 0  1  2  3  4  5  6  7  8 - index
//                6  7       - lv-4
//          4  5  5  5     9 - lv-3
//    2  3  3  3  3  3  8  8 - lv-2
// 1  1  1  1  1  1  1  1  1 - lv-1

export function run(root) {
  try {
    //- Hrp, Hrs, Hlvl
    //testTreeHrp(root);
    //testTreeHrs(root);
    //testTreeHlvl(root);
    //testHrpToHlvl(root);
    //testHlvlToHrp(root);

    //- Hpre, Hs, Hlen
    //testTreeHpre(root);
    //testTreeHs(root);
    //testTreeHlen(root);
    //testHpreToHlen(root);
    //testHlenToHpre(root);

    //- Hlvl, Hlen
    //testHlenToHlvl(root);
    testHlvlToHlen(root);
    debugger;
  } catch(error) {
    console.log(error);
    console.log(error.stack);
    debugger;
  }
}

//========//========//========//========//========

function testEqual(root, result) {
  let r = root.testEqual(result);
  return (r == 0) ? "ok" : "ERROR (!!!)";
}

//########//########//########//########//########
//========//========//========//========//========

//- (Tree <-> Hrp)
function testTreeHrp(root) {
  root = root.clone();
  let r = null;

  r = isoTreeHrp.encodeHrp(root);
  console.log("encoding (hrp, PRE)");
  console.log("N", r.n);
  console.log("Hrp", r.hrp);

  r = isoTreeHrp.decodeHrp(r.n, r.hrp);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Tree <-> Hrs)
function testTreeHrs(root) {
  root = root.clone();
  let r = null;

  r = isoTreeHrs.encodeHrs(root);
  console.log("encoding (hrs, PRE)");
  console.log("N", r.n);
  console.log("Hrs", r.hrs);

  r = isoTreeHrs.decodeHrs(r.n, r.hrs);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Tree <-> Hlvl)
function testTreeHlvl(root) {
  root = root.clone();
  let r = null;

  //- lvl: 1  2  2  3  3  4  4  2  3
  r = isoTreeHlvl.encodeHlvl(root);
  console.log("encoding (lvl, PRE)");
  console.log("N", r.n);
  console.log("Hlvl", r.lvl);

  r = isoTreeHlvl.decodeHlvl(r.n, r.lvl);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Hrp -> Hlvl)
function testHrpToHlvl(root) {
  root = root.clone();
  let r = null;

  r = isoTreeHrp.encodeHrp(root);
  console.log("encoding (hrp, PRE)");
  console.log("N", r.n);
  console.log("Hrp", r.hrp);

  //- lvl: 1  2  2  3  3  4  4  2  3
  r = isoHrpHlvl.convHrpToHlvl(r.n, r.hrp);
  console.log("convert (hrp -> hlvl)");
  console.log("Hlvl", r.lvl);

  r = isoTreeHlvl.decodeHlvl(r.n, r.lvl);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Hlvl -> Hrp)
function testHlvlToHrp(root) {
  root = root.clone();
  let r = null;

  //- lvl: 1  2  2  3  3  4  4  2  3
  r = isoTreeHlvl.encodeHlvl(root);
  console.log("encoding (lvl, PRE)");
  console.log("N", r.n);
  console.log("Hlvl", r.lvl);

  r = isoHrpHlvl.convHlvlToHrp(r.n, r.lvl);
  console.log("convert (hlvl -> hrp)");
  console.log("Hrp", r.hrp);

  r = isoTreeHrp.decodeHrp(r.n, r.hrp);
  console.log("decode", testEqual(root, r));
  debugger;
}

//########//########//########//########//########
//========//========//========//========//========

//- (Tree <-> Hpre)
function testTreeHpre(root) {
  root = root.clone();
  let r = null;

  r = isoTreeHpre.encodeHpre(root);
  console.log("encoding (hpre, PRE)");
  console.log("N", r.n);
  console.log("Hpre", r.hpre);

  r = isoTreeHpre.decodeHpre(r.n, r.hpre);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Tree <-> Hs)
function testTreeHs(root) {
  root = root.clone();
  let r = null;

  r = isoTreeHs.encodeHs(root);
  console.log("encoding (hs, PRE)");
  console.log("N", r.n);
  console.log("Hs", r.hs);

  r = isoTreeHs.decodeHs(r.n, r.hs);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Tree <-> Hlen)
function testTreeHlen(root) {
  root = root.clone();
  let r = null;

  //- len: 9  1  5  1  3  1  1  2  1
  r = isoTreeHlen.encodeHlen(root);
  console.log("encoding (len, PRE)");
  console.log("N", r.n);
  console.log("Hlen", r.len);

  r = isoTreeHlen.decodeHlen(r.n, r.len);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Hpre -> Hlen)
function testHpreToHlen(root) {
  root = root.clone();
  let r = null;

  r = isoTreeHpre.encodeHpre(root);
  console.log("encoding (hpre, PRE)");
  console.log("N", r.n);
  console.log("Hpre", r.hpre);

  //- len: 9  1  5  1  3  1  1  2  1
  r = isoHpreHlen.convHpreToHlen(r.n, r.hpre);
  console.log("convert (hpre -> hlen)");
  console.log("Hlen", r.len);

  r = isoTreeHlen.decodeHlen(r.n, r.len);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Hlen -> Hpre)
function testHlenToHpre(root) {
  root = root.clone();
  let r = null;

  //- len: 9  1  5  1  3  1  1  2  1
  r = isoTreeHlen.encodeHlen(root);
  console.log("encoding (len, PRE)");
  console.log("N", r.n);
  console.log("Hlen", r.len);

  r = isoHpreHlen.convHlenToHpre(r.n, r.len);
  console.log("convert (hlen -> hpre)");
  console.log("Hpre", r.hpre);

  r = isoTreeHpre.decodeHpre(r.n, r.hpre);
  console.log("decode", testEqual(root, r));
  debugger;
}

//########//########//########//########//########
//========//========//========//========//========

//- (Hlen -> Hlvl)
function testHlenToHlvl(root) {
  root = root.clone();
  let r = null;

  //- len: 9  1  5  1  3  1  1  2  1
  r = isoTreeHlen.encodeHlen(root);
  console.log("encode (len, PRE)");
  console.log("N", r.n);
  console.log("Hlen", r.len);

  //- lvl: 1  2  2  3  3  4  4  2  3
  r = isoHlenHlvl.convLenToLvl(r.n, r.len);
  console.log("convert (hlen -> hlvl)");
  console.log("Hlvl", r.lvl);

  r = isoTreeHlvl.decodeHlvl(r.n, r.lvl);
  console.log("decode", testEqual(root, r));
  debugger;
}

//========//========//========//========//========

//- (Hlvl -> Hlen)
function testHlvlToHlen(root) {
  root = root.clone();
  let r = null;

  //- lvl: 1  2  2  3  3  4  4  2  3
  r = isoTreeHlvl.encodeHlvl(root);
  console.log("encode (lvl, PRE)");
  console.log("N", r.n);
  console.log("Hlvl", r.lvl);

  //- len: 9  1  5  1  3  1  1  2  1
  r = isoHlenHlvl.convLvlToLen(r.n, r.lvl);
  console.log("convert (hlvl -> hlen)");
  console.log("Hlen", r.len);

  r = isoTreeHlen.decodeHlen(r.n, r.len);
  console.log("decode", testEqual(root, r));
  debugger;
}
