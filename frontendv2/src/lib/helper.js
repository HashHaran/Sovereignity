export const convertEpochTimeToDateTime = (epochTime) => {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epochTime);
    return d.toLocaleString();
}