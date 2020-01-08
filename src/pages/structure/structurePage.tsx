import React from "react";
import { connect } from "react-redux";

import ContentLayout from "../../components/contentLayout/contentLayout";
import Log from "../../components/log/log";
import View from "../../components/view/view";
import { LoadingStatus } from "../../states/projectSlice";
import { ApplicationState } from "../../states/store";
import StructureView from "../../views/structure/structureView";
import WaveContainer from "../../views/wave/waveContainer";
import WaveControlView from "../../views/waveControl/waveControlView";

interface PropsFromState {
  loaded: boolean;
}

interface PropsFromDispatch {}

interface Props {}

type AllProps = PropsFromState & PropsFromDispatch & Props;

class StructurePage extends React.Component<AllProps> {
  render() {
    Log.info("render", StructurePage.name);
    return (
      <ContentLayout
        topLeft={<View body={<WaveContainer />}></View>}
        topRight={<View body={<WaveControlView />}></View>}
        bottom={<View body={<StructureView />}></View>}
      ></ContentLayout>
    );
  }
}

const mapStateToProps = ({ project }: ApplicationState) => {
  return {
    loaded: project.status === LoadingStatus.INITIALIZED
  };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
