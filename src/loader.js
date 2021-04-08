import "./loader.css";
import { useSelector } from "react-redux";
const Loader = () => {
  const { loaderVisible } = useSelector((state) => {
    return state.gameState;
  });
  return (
    <>
      {loaderVisible === true ? (
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : null}
    </>
  );
};

export default Loader;
