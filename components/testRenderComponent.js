import react from "react";
import { render } from "react-dom";
import parse from "html-react-parser";

const RenderComponent = (props) => {
  return <>{parse(props.value)}</>;
};

export default RenderComponent;
