
import * as util from "../util.js"

//- transform Hpre into Hlen, and vice versa
//- i.e. re-encode a length-based encoding as
//  a hierarchy of traces, and vice versa
//########//########//########//########//########
//========//========//========//========//========

//- (Hpre -> Hlen)
export function convHpreToHlen(n, hpre) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == hpre.length);
  util.assert(hpre[0].length == num);//- root
  util.assert(hpre[num-1].length == 1);//- leaf
  let i=0, len=[];

  for(i=0; i<num; i++) {
    let pre = hpre[i];
    util.assert(pre.length > 0);
    len.push(pre.length);
  }

  return { n, len };
}

//########//########//########//########//########
//========//========//========//========//========

//- (Hlen -> Hpre)
export function convHlenToHpre(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- root
  util.assert(len[num-1] == 1);//- leaf
  let hpre=[];

  for(let i=0; i<num; i++) {
    let count = len[i];
    let iLast = (i+count-1);
    util.assert(count > 0);
    util.assert(iLast < num);
    let trace = [];

    //- each trace is a substring
    for(let j=i; j<=iLast; j++) {
      //- push 1-based references
      trace.push(j+1);
    }

    hpre.push(trace);
  }

  return { n, hpre };
}
