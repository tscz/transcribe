class ArrayUtil {
  static range: (start: number, end: number) => string[] = (start, end) => {
    if (start > end) start = end;

    return Array(end - start + 1)
      .fill(start)
      .map((_, idx) => (start + idx).toString());
  };

  static rangeObject: (start: number, end: number) => any = (start, end) => {
    const array = ArrayUtil.range(start, end);

    const initialValue = {};

    return array.reduce((obj, item) => {
      return {
        ...obj,
        [parseInt(item)]: item
      };
    }, initialValue);
  };

  static bordersOf: (array: Array<string>) => { start: number; end: number } = (
    array
  ) => {
    return {
      start: parseInt(array[0]),
      end: parseInt(ArrayUtil.last(array))
    };
  };

  static last: <T>(array: Array<T>) => T = (array) => {
    return array[array.length - 1];
  };
}

export default ArrayUtil;
