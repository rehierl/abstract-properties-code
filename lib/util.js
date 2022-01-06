
//- helper functions used throughout the code
//########//########//########//########//########
//========//========//========//========//========

export function assert(test) {
  if(test === true) {
    return;
  }
  if(test === false) {
    throw new Error("assertion failed");
  }
  throw new Error("assertion - invalid call");
}
