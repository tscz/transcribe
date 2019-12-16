import React from "react";

class VersionInfo extends React.Component {
  render() {
    return (
      <>
        {process.env.REACT_APP_VERSION} (
        <a
          href={
            "https://github.com/tscz/transcribe/commit/" +
            process.env.REACT_APP_VERSION_HASH
          }
        >
          {process.env.REACT_APP_VERSION_HASH} -{" "}
          {process.env.REACT_APP_VERSION_DESCRIPTION}
        </a>
        )
      </>
    );
  }
}

export default VersionInfo;
