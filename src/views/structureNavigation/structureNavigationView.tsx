import React, { Component } from "react";
import { connect } from "react-redux";

import SectionOverview from "../../components/sectionOverview/sectionOverview";
import { ApplicationState } from "../../states/store";

interface PropsFromState {}

interface PropsFromDispatch {}

type AllProps = PropsFromState & PropsFromDispatch;

class StructureNavigationView extends Component<AllProps> {
  render() {
    return <SectionOverview></SectionOverview>;
  }
}

const mapStateToProps = ({}: ApplicationState) => {
  return {};
};

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StructureNavigationView);
