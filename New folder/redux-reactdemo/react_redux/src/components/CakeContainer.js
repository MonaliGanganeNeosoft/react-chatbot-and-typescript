import React from "react";
import { connect } from "react-redux";
import { buyCake } from "./redux/cake/cakeActions";

function CakeContainer(props) {
  console.log(props);
  return (
    <div>
      <h2>Number of cakes-{props.numOfCakes}</h2>
      <button onClick={props.buyCake}>Buy cake</button>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    numOfCakes: state.numOfCakes,
  };
};
const mapDispatchProps = (dispatch) => {
  return {
    buyCake: () => dispatch(buyCake()),
  };
};
export default connect(mapStateToProps, mapDispatchProps)(CakeContainer);
