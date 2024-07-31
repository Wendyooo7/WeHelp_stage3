// import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Wendy の React 練習專案</h1>

      <Form />

      {/* <Link className={styles.link} href="/accounting" title="點此前往">
        記帳小本本
      </Link> */}
    </main>
  );
}

function Form() {
  return (
    <>
      <form className={styles.form}>
        <h3>登入系統</h3>
        <div className={styles.formDiv}>
          <label htmlFor="email">電郵：</label>
          <input type="text" className={styles.input} />
        </div>

        <div className={styles.formDiv}>
          <label htmlFor="password">密碼：</label>
          <input type="password" className={styles.input} />
        </div>

        <button className={styles.btn}>登入</button>
      </form>

      <form className={styles.form}>
        <h3>註冊帳戶</h3>
        <div className={styles.formDiv}>
          <label htmlFor="email">電郵：</label>
          <input type="text" className={styles.input} />
        </div>

        <div className={styles.formDiv}>
          <label htmlFor="password">密碼：</label>
          <input type="password" className={styles.input} />
        </div>

        <button className={styles.btn}>註冊</button>
      </form>
    </>
  );
}
