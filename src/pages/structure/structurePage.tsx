import React from "react";
import { connect } from "react-redux";

import ContentLayout from "../../components/contentLayout/contentLayout";
import View from "../../components/view/view";
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
    console.log("render structurePage");
    return (
      <ContentLayout
        topLeft={
          <View body={this.props.loaded ? <WaveContainer /> : <></>}></View>
        }
        topRight={
          <View body={this.props.loaded ? <WaveControlView /> : <></>}></View>
        }
        bottom={<View body={<StructureView />}></View>}
      ></ContentLayout>
    );
  }
}

const mapStateToProps = ({ project }: ApplicationState) => {
  return {
    loaded: project.loaded
  };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(StructurePage);
