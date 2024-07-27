import styles from "./page.module.scss";
import { useState } from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <Form />
      <hr />
    </main>
  );
}

function Form() {
  return (
    <form id={styles.form}>
      <select name="form__select" id="" className={styles.form__item}>
        <option value="收入">收入</option>
        <option value="支出">支出</option>
      </select>
      <input
        id="form__amount"
        className={styles.form__item}
        placeholder="請輸入金額"
        size={9}
        required
      />
      <input
        id="form__detail"
        className={styles.form__item}
        placeholder="請輸入明細"
        required
      />
      <button className={styles.form__item}>新增紀錄</button>
    </form>
  );
}
