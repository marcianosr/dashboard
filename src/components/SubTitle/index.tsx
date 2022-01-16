import React, { FC } from "react";
import styles from "./styles.module.scss";

const SubTitle: FC = ({ children }) => (
	<span className={styles.subTitle}>{children}</span>
);

export default SubTitle;
