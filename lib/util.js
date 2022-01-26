
//- helper functions used throughout the code
//########//########//########//########//########
//========//========//========//========//========

//- verify that the given condition is true
export function assert(condition) {
  if(condition === true) {
    return;
  }

  if(condition === false) {
    debugger;//- for testing purposes
    throw new Error("ASSERT FAILED");
  }

  debugger;//- for testing purposes
  throw new Error("ASSERT INVALID CALL");
}

//========//========//========//========//========

//- return a shallow copy of the input array
//- e.g. clone rooted paths of node references
export function clone(a1) {
  let len = a1.length;
  let a2 = new Array();

  for(let i=0; i<len; i++) {
    let e = a1[i];
    assert(e !== undefined);
    a2.push(e);
  }

  return a2;
}

//========//========//========//========//========

//- a string-based comparison of two arrays
//- both arrays are expected to be sequences
//  of numeric node references - index values
//- used to verify that two arrays are equal
//- returns (-1) if (a1 < a2)
//- returns (+1) if (a1 > a2)
//- returns 0/zero otherwise
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
