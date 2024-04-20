export const IsList = (list) => {
    if (list && list.constructor === Array && list.length > 0) {
        return true;
    }
}