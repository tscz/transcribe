import React from "react";

class VersionInfo extends React.Component<
  {},
  { appVersion: string; hash: string; description: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { appVersion: "", hash: "", description: "" };
  }

  componentDidMount() {
    this.setStateFromFile({
      file: "/gitInfo.txt",
      regex: /([0-9a-f]{7}) (.*)/,
      stateObject: regexResult => {
        return { hash: regexResult[1], description: regexResult[2] };
      }
    });

    this.setStateFromFile({
      file: "/npmInfo.txt",
      regex: /[0-9]+.[0-9]+.[0-9]+/,
      stateObject: regexResult => {
        return { appVersion: regexResult[0] };
      }
    });
  }

  setStateFromFile({
    file,
    regex,
    stateObject
  }: {
    file: string;
    regex: RegExp;
    stateObject: (regexResult: RegExpExecArray) => object;
  }) {
    fetch(process.env.PUBLIC_URL + file)
      .then(response => response.text())
      .then(text => {
        let extraction = regex.exec(text);

        if (extraction !== null && extraction[0] !== null) {
          this.setState(stateObject(extraction));
        }
      });
  }

  render() {
    return (
      <>
        {this.state.appVersion} (
        <a
          href={"https://github.com/tscz/transcribe/commit/" + this.state.hash}
        >
          {this.state.hash} - {this.state.description}
        </a>
        )
      </>
    );
  }
}

export default VersionInfo;
