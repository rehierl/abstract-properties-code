
import * as util from "./lib/util.js"
import * as encPar from "./lib/encPar.js"
import cNode from "./lib/cNode.js"
import cQueue from "./lib/cQueue.js"

try {
  let n = "A,B,C,D,E,F,G,H,I".split(",");
  let par = [0,1,1,3,3,5,5,1,8];
  let root = encPar.decodePRE(n, par)[0];
  let res = null;

  //- now, a tree is available
  res = encPar.encodePOSTR(root);
  //root = encPar.decodePOSTR(res.n, res.par)[0];
  //res = encPar.encodePRE(root);
  console.log(res.par);
  debugger;
} catch(error) {
  console.log(error);
  console.log(error.stack);
  debugger;
}
