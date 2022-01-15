import React, { FC } from "react";
import styles from "./styles.module.scss";

type BlockProps = {
	title: string;
};

const Block: FC<BlockProps> = ({ title, children }) => (
	<section className={styles.block}>
		<span className={styles.title}>{title}</span>
		<span className={styles.text}>{children}</span>
	</section>
);

export default Block;
