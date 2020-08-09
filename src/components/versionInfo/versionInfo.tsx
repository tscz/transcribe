import React from "react";

class VersionInfo extends React.Component<{
  version: string;
  hash: string;
  description: string;
}> {
  render(): JSX.Element {
    return (
      <>
        {this.props.version} (
        <a
          href={"https://github.com/tscz/transcribe/commit/" + this.props.hash}
        >
          {this.props.hash} - {this.props.description}
        </a>
        )
      </>
    );
  }
}

export default VersionInfo;
