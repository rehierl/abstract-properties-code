
import * as util from "../util.js"

//- transform Hrp into Hlvl, and vice versa
//- i.e. re-encodie a level-based encoding as
//  a hierarchy of rooted paths, and vice versa
//########//########//########//########//########
//========//========//========//========//========

//- (Hrp -> Hlvl)
export function convHrpToHlvl(n, hrp) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == hrp.length);
  util.assert(hrp[0].length == 1);//- root
  let i=0, lvl=[];

  for(i=0; i<num; i++) {
    let rp = hrp[i];
    util.assert(rp.length > 0);
    lvl.push(rp.length);
  }

  return { n, lvl };
}

//########//########//########//########//########
//========//========//========//========//========

//- (Hlvl -> Hrp)
export function convHlvlToHrp(n, lvl) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == lvl.length);
  util.assert(lvl[0] == 1);//- root
  let hrp=[], rp=[], path;

  for(let i=0; i<num; i++) {
    let level = lvl[i];
    util.assert(level >= 1);

    if(level == 1) {//- a root
      util.assert(rp.length == 0);
    }

    //- verify that level is in [1,#rp+1]
    util.assert(level <= rp.length+1);

    //- reduce the rooted path
    while(level <= rp.length) {
      rp.pop();
    }

    rp.push(i+1);
    path = util.clone(rp);
    hrp.push(path);
    continue;
  }

  return { n, hrp };
}
