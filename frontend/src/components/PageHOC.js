import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import { useGlobalContext } from "../context/WalletContext";
import Alert from "./Alert";
//higher order components take a component as a first argument and act as a wrapper
const PageHOC = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext();
  const navigate = useNavigate();
  return (
    <div className={styles.hocContainer}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
        <div className={styles.hocBodyWrapper}>
          <div className="flex flex-row w-full">
            <h1 className={`flex ${styles.headText} head-text`}> {title}</h1>
          </div>
          <p className={`${styles.normalText} my-10`}>{description}</p>
          <Component />
        </div>
      </div>
  );
};

export default PageHOC;
