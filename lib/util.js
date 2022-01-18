
//- helper functions used throughout the code
//########//########//########//########//########
//========//========//========//========//========

export function assert(test) {
  if(test === true) {
    return;
  }
  if(test === false) {
    throw new Error("ASSERT FAILED");
  }
  throw new Error("ASSERT INVALID");
}

//========//========//========//========//========

export function cmpArrays(a1, a2) {
  let l1 = a1.length;
  let l2 = a2.length;
  let len = Math.min(l1, l2);

  for(let i=0; i<len; i++) {
    let e1 = a1[i];
    let e2 = a2[i];
    if(e1 < e2) return -1;
    if(e1 > e2) return +1;
  }

  if(l1 < l2) return -1;
  if(l1 > l2) return +1;
  return 0;
}
