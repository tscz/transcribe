class ArrayUtil {
  static range: (start: number, end: number) => string[] = (start, end) => {
    if (start > end) start = end;

    return Array(end - start + 1)
      .fill(start)
      .map((_, idx) => (start + idx).toString());
  };
}

export default ArrayUtil;
