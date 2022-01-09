import ReactDOM from "react-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  div.id = "root";
  document.body.appendChild(div);

  import("./index");

  ReactDOM.unmountComponentAtNode(div);
});
