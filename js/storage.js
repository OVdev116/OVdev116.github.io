function setItemStorage(name, value) {
    return localStorage.setItem(name, value);
}
function getItemStorage(name) {
    return localStorage.getItem(name)
}
export {
    setItemStorage, getItemStorage
}