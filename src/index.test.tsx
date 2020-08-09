// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
  // needed for compilation
};

it("renders without crashing", () => {
  import("./index");
});
