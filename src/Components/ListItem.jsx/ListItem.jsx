import React from "react";
import styles from "./ListItem.module.css";

const ListItem = ({ imageurl, heading, description }) => {
  return (
    <div className={styles.list_item}>
      <img src={imageurl} alt="Image" />
      <h3>{heading}</h3>
      <p>{description}</p>
    </div>
  );
};
export default ListItem;
