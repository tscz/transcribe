class ArrayUtil {
  static range: (start: number, end: number) => string[] = (start, end) => {
    if (start > end) start = end;

    return Array(end - start + 1)
      .fill(start)
      .map((_, idx) => (start + idx).toString());
  };

  static bordersOf: (
    array: Array<any>
  ) => { start: number; end: number } = array => {
    return {
      start: parseInt(array[0]),
      end: parseInt(ArrayUtil.last(array))
    };
  };

  static last: <T>(array: Array<T>) => T = array => {
    return array[array.length - 1];
  };
}

export default ArrayUtil;
