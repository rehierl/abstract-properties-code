
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
  let r = root.testEqual(result);
  return (r == 0) ? "ok" : "ERROR (!!!)";
}

//########//########//########//########//########
//========//========//========//========//========

function testEncPar(root) {
  root = root.clone();
  let r = null;

  {//- level-order
    r = encPar.encodeLEVEL(root);
    console.log("encoding (par, LEVEL)");
    console.log("N", r.n);
    console.log("P", r.par);

    r = encPar.decodeLEVEL(r.n, r.par);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- pre-order
    r = encPar.encodePRE(root);
    console.log("encoding (par, PRE)");
    console.log("N", r.n);
    console.log("P", r.par);

    r = encPar.decodePRE(r.n, r.par);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- reversed pre-order
    r = encPar.encodePRER(root);
    console.log("encoding (par, PRER)");
    console.log("N", r.n);
    console.log("P", r.par);

    r = encPar.decodePRER(r.n, r.par);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- post-order
    r = encPar.encodePOST(root);
    console.log("encoding (par, POST)");
    console.log("N", r.n);
    console.log("P", r.par);

    r = encPar.decodePOST(r.n, r.par);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- reversed post-order
    r = encPar.encodePOSTR(root);
    console.log("encoding (par, POSTR)");
    console.log("N", r.n);
    console.log("P", r.par);

    r = encPar.decodePOSTR(r.n, r.par);
    console.log("decode", testEqual(root, r));
  }//*/
}

//========//========//========//========//========

function testEncLvl(root) {
  root = root.clone();
  let r = null;

  {//- level-order
    r = encLvl.encodeLEVEL(root);
    console.log("encoding (lvl, LEVEL)");
    console.log("N", r.n);
    console.log("LVL", r.lvl);

    //- no decoding
    //r = encPar.decodeLEVEL(r.n, r.par);
    //console.log("decode", testEqual(root, r));
    console.log("decode", "n.a.");
  }//*/

  {//- pre-order
    r = encLvl.encodePRE(root);
    console.log("encoding (lvl, PRE)");
    console.log("N", r.n);
    console.log("LVL", r.lvl);

    r = encLvl.decodePRE(r.n, r.lvl);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- post-order
    r = encLvl.encodePOST(root);
    console.log("encoding (lvl, POST)");
    console.log("N", r.n);
    console.log("LVL", r.lvl);

    r = encLvl.decodePOST(r.n, r.lvl);
    console.log("decode", testEqual(root, r));
  }//*/
}

//========//========//========//========//========

function testEncLen(root) {
  root = root.clone();
  let r = null;

  {//- level-order
    r = encLen.encodeLEVEL(root);
    console.log("encoding (len, LEVEL)");
    console.log("N", r.n);
    console.log("LEN", r.len);

    //- no decoding
    //r = encPar.decodeLEVEL(r.n, r.par);
    //console.log("decode", testEqual(root, r));
    console.log("decode", "n.a.");
  }//*/

  {//- pre-order
    r = encLen.encodePRE(root);
    console.log("encoding (len, PRE)");
    console.log("N", r.n);
    console.log("LEN", r.len);

    r = encLen.decodePRE(r.n, r.len);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- post-order
    r = encLen.encodePOST(root);
    console.log("encoding (len, POST)");
    console.log("N", r.n);
    console.log("LEN", r.len);

    r = encLen.decodePOST(r.n, r.len);
    console.log("decode", testEqual(root, r));
  }//*/
}

//========//========//========//========//========

function testEncEnd(root) {
  root = root.clone();
  let r = null;

  {//- pre-order
    r = encEnd.encodePRE(root);
    console.log("encoding (lst, PRE)");
    console.log("N", r.n);
    console.log("LST", r.lst);

    r = encEnd.decodePRE(r.n, r.lst);
    console.log("decode", testEqual(root, r));
  }//*/

  {//- post-order
    r = encEnd.encodePOST(root);
    console.log("encoding (fst, POST)");
    console.log("N", r.n);
    console.log("FST", r.fst);

    r = encEnd.decodePOST(r.n, r.fst);
    console.log("decode", testEqual(root, r));
  }//*/
}
