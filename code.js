const busy = [
  { start: "9:30", stop: "10:50" },
  { start: "18:40", stop: "18:50" },
  { start: "14:40", stop: "15:50" },
  { start: "16:40", stop: "17:20" },
  { start: "20:05", stop: "20:20" },
];
console.log("busy ", busy);

const allTime = { start: "9:00", stop: "21:00" };

function getMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const startTime = getMinutes(allTime.start);
const endTime = getMinutes(allTime.stop);

const sortedBusy = [...busy].sort((a, b) => {
  const timeA = new Date(`2000-01-01T${a.start}`);
  const timeB = new Date(`2000-01-01T${b.start}`);

  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
});

//  console.log("sortedBusy ", sortedBusy);

function getFreeWindows(startPosition, endPosition, busyIntervals) {
  let freeWindows = [];
  if (getMinutes(busyIntervals[0].start) > startPosition) {
    freeWindows.push({
      start: startPosition,
      stop: getMinutes(busyIntervals[0].start),
    });
  }

  for (let i = 0; i < busyIntervals.length - 1; i++) {
    const currentEnd = getMinutes(busyIntervals[i].stop);
    const nextStart = getMinutes(busyIntervals[i + 1].start);
    freeWindows.push({ start: currentEnd, stop: nextStart });
  }

  if (getMinutes(busyIntervals[busyIntervals.length - 1].stop) < endPosition) {
    freeWindows.push({
      start: getMinutes(busyIntervals[busyIntervals.length - 1].stop),
      stop: endPosition,
    });
  }

  return freeWindows;
}

const freeWindows = getFreeWindows(startTime, endTime, sortedBusy);
//  console.log("freeWindows ", freeWindows);

function splitIntervals(start, end, period) {
  let windows = [];
  let current = start;
  while (current + period <= end) {
    windows.push({ start: current, stop: current + period });
    current += period;
  }
  return windows;
}

function getAllintervals(windows, intervalTime) {
  let intervals = [];
  for (let i = 0; i < windows.length; i++) {
    intervals.push(
      ...splitIntervals(windows[i].start, windows[i].stop, intervalTime)
    );
  }
  return intervals;
}

const freeWindowsIntervals = getAllintervals(freeWindows, 30);
//  console.log("freeWindowsIntervals ", freeWindowsIntervals);

function getTimeFromMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? "0" + mins : mins}`;
}

function getAllFormatIntervals(windows) {
  let intervals = [];
  for (let i = 0; i < windows.length; i++) {
    intervals.push({
      start: getTimeFromMinutes(windows[i].start),
      end: getTimeFromMinutes(windows[i].stop),
    });
  }
  return intervals;
}

const allFormatIntervals = getAllFormatIntervals(freeWindowsIntervals);
console.log("allFormatIntervals ", allFormatIntervals);
