let upperBound, lowerBound;

exports.set = (lo, hi) => {
  lowerBound = lo;
  upperBound = hi;
};

exports.get = () => [lowerBound, upperBound];

exports.in = key => {
  // I'm responsible for everything in (predId, myId]
  if (upperBound === lowerBound) {
    return true;
  } else if (upperBound > lowerBound) {
    return key > lowerBound && key <= upperBound;
  } else {
    return key >= lowerBound || key < upperBound;
  }
};

exports.below = key => key <= lowerBound;

exports.above = key => key > upperBound;
