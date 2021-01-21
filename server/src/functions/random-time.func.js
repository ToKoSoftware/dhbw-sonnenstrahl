/**
 * Get a random time between two dates
 * 
 * @param {Date} start 
 * @param {Date} end 
 */
function randomTime(start, end) {
    let diff = end.getTime() - start.getTime();
    let new_diff = diff * Math.random();
    return new Date(start.getTime() + new_diff);
}

let endTime = new Date();
let startTime = new Date();
startTime.setFullYear(endTime.getFullYear() - 1);

module.exports = {
    randomTime: randomTime,
    endTime: endTime,
    startTime: startTime
};


