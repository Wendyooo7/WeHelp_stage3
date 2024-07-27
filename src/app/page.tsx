// import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <header>
        <h1>Wendy の React 練習專案</h1>
      </header>

      <Link className={styles.link} href="/accounting" title="點此前往">
        記帳小本本
      </Link>
    </main>
  );
}
