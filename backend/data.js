//this file acts as a temp standin for actual database
//later, these function will be rewritten to talk to supabase
//but the routes calling them won't need to change

let backpack = [];


//getBackpack
function unpackBackpack() {
    return backpack;
}

//addTab
function addToBackpack(item) {
    backpack.push(item);
    return item;
}

//clearBackpack
function emptyBackpack() {
    backpack = [];
    return backpack;
}

module.exports = {
    unpackBackpack,
    addToBackpack,
    emptyBackpack
};