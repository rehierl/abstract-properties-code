
import * as util from "../util.js"
import cNode from "../cNode.js"

import * as encPar from "./enc1-Par.js"
import * as encLvl from "./enc2-Lvl.js"
import * as encLen from "./enc3-Len.js"
import * as encEnd from "./enc4-End.js"

//########//########//########//########//########
//========//========//========//========//========

export function run(root) {
  try {
    testEncPar(root);
    testEncLvl(root);
    testEncLen(root);
    testEncEnd(root);
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
  return (ret == 0) ? "ok" : "-ERROR-";
}

//########//########//########//########//########
//========//========//========//========//========

function testEncPar(root) {
  root = root.clone();
  let ret = null;

  {//- level-order
    ret = encPar.encodeLEVEL(root);
    console.log("encoding (par, LEVEL)");
    console.log("N", ret.n);
    console.log("P", ret.par);

    ret = encPar.decodeLEVEL(ret.n, ret.par);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- pre-order
    ret = encPar.encodePRE(root);
    console.log("encoding (par, PRE)");
    console.log("N", ret.n);
    console.log("P", ret.par);

    ret = encPar.decodePRE(ret.n, ret.par);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- reversed pre-order
    ret = encPar.encodePRER(root);
    console.log("encoding (par, PRER)");
    console.log("N", ret.n);
    console.log("P", ret.par);

    ret = encPar.decodePRER(ret.n, ret.par);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- post-order
    ret = encPar.encodePOST(root);
    console.log("encoding (par, POST)");
    console.log("N", ret.n);
    console.log("P", ret.par);

    ret = encPar.decodePOST(ret.n, ret.par);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- reversed post-order
    ret = encPar.encodePOSTR(root);
    console.log("encoding (par, POSTR)");
    console.log("N", ret.n);
    console.log("P", ret.par);

    ret = encPar.decodePOSTR(ret.n, ret.par);
    console.log("decode", testEqual(root, ret));
  }//*/
}

//========//========//========//========//========

function testEncLvl(root) {
  root = root.clone();
  let ret = null;

  {//- level-order
    ret = encLvl.encodeLEVEL(root);
    console.log("encoding (lvl, LEVEL)");
    console.log("N", ret.n);
    console.log("LVL", ret.lvl);

    //- no decodiding
    //ret = encPar.decodeLEVEL(ret.n, ret.par);
    //console.log("decode", testEqual(root, ret));
    console.log("decode", "n.a.");
  }//*/

  {//- pre-order
    ret = encLvl.encodePRE(root);
    console.log("encoding (lvl, PRE)");
    console.log("N", ret.n);
    console.log("LVL", ret.lvl);

    ret = encLvl.decodePRE(ret.n, ret.lvl);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- post-order
    ret = encLvl.encodePOST(root);
    console.log("encoding (lvl, POST)");
    console.log("N", ret.n);
    console.log("LVL", ret.lvl);

    ret = encLvl.decodePOST(ret.n, ret.lvl);
    console.log("decode", testEqual(root, ret));
  }//*/
}

//========//========//========//========//========

function testEncLen(root) {
  root = root.clone();
  let ret = null;

  {//- level-order
    ret = encLen.encodeLEVEL(root);
    console.log("encoding (len, LEVEL)");
    console.log("N", ret.n);
    console.log("LEN", ret.len);

    //- no decodiding
    //ret = encPar.decodeLEVEL(ret.n, ret.par);
    //console.log("decode", testEqual(root, ret));
    console.log("decode", "n.a.");
  }//*/

  {//- pre-order
    ret = encLen.encodePRE(root);
    console.log("encoding (len, PRE)");
    console.log("N", ret.n);
    console.log("LEN", ret.len);

    ret = encLen.decodePRE(ret.n, ret.len);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- post-order
    ret = encLen.encodePOST(root);
    console.log("encoding (len, POST)");
    console.log("N", ret.n);
    console.log("LEN", ret.len);

    ret = encLen.decodePOST(ret.n, ret.len);
    console.log("decode", testEqual(root, ret));
  }//*/
}

//========//========//========//========//========

function testEncEnd(root) {
  root = root.clone();
  let ret = null;

  {//- pre-order
    ret = encEnd.encodePRE(root);
    console.log("encoding (lst, PRE)");
    console.log("N", ret.n);
    console.log("LST", ret.lst);

    ret = encEnd.decodePRE(ret.n, ret.lst);
    console.log("decode", testEqual(root, ret));
  }//*/

  {//- post-order
    ret = encEnd.encodePOST(root);
    console.log("encoding (fst, POST)");
    console.log("N", ret.n);
    console.log("FST", ret.fst);

    ret = encEnd.decodePOST(ret.n, ret.fst);
    console.log("decode", testEqual(root, ret));
  }//*/
}
