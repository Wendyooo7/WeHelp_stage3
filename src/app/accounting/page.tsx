"use client";
import styles from "./page.module.scss";
import Link from "next/link";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// 定義 Form 組件的 props 類型
interface FormProps {
  newInput: string;
  newDetail: string;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  setNewInput: Dispatch<SetStateAction<string>>;
  setNewDetail: Dispatch<SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

interface ListProps {
  accountRecord: {
    id: string;
    title: string;
    amount: number;
    detail: string;
    category: string;
  }[];
  deleteAccountRecord: (id: string) => void;
}

export default function Home() {
  const [category, setCategory] = useState("收入");
  const [newInput, setNewInput] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [accountRecord, setAccountRecord] = useState<
    {
      id: string;
      title: string;
      detail: string;
      category: string;
      amount: number;
    }[]
  >([]);
  // 上行useState([])沒定義型別的話，下面(currentAccountRecord) => { 會報錯

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      }
    });

    // 清理
    return () => unsubscribe();
  }, []);

  const amount = parseFloat(newInput) * (category === "收入" ? 1 : -1); // 根據類別設置正負金額

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAccountRecord((currentAccountRecord) => [
      ...currentAccountRecord,
      {
        id: crypto.randomUUID(),
        title: newInput,
        detail: newDetail,
        category,
        amount,
      },
    ]);
    setNewInput("");
    setNewDetail("");
  }

  // 計算總和
  const totalAmount = accountRecord.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  function deleteAccountRecord(id: string) {
    setAccountRecord((currentAccountRecord) => {
      return currentAccountRecord.filter((record) => record.id !== id);
    });
  }

  return (
    <main className={styles.main}>
      <Form
        category={category}
        setCategory={setCategory}
        newInput={newInput}
        setNewInput={setNewInput}
        newDetail={newDetail}
        setNewDetail={setNewDetail}
        handleSubmit={handleSubmit}
      />

      <hr />

      <List
        accountRecord={accountRecord}
        deleteAccountRecord={deleteAccountRecord}
      />

      <section id={styles.main__bottom}>
        <div className={styles.main__buttom__item}>
          <span id={styles.form__total}>小計 : </span>
          {totalAmount}
        </div>
        <Link className={styles.main__buttom__item} id={styles.link} href="/">
          返回首頁
        </Link>
      </section>
    </main>
  );
}

function Form({
  category,
  setCategory,
  newInput,
  setNewInput,
  newDetail,
  setNewDetail,
  handleSubmit,
}: FormProps) {
  return (
    <form onSubmit={handleSubmit} id={styles.form}>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        name="form__select"
        id=""
        className={styles.form__item}
      >
        <option value="收入">收入</option>
        <option value="支出">支出</option>
      </select>
      <input
        className={styles.form__item}
        placeholder="請輸入金額"
        size={9}
        required
        value={newInput}
        onChange={(e) => setNewInput(e.target.value)}
      />
      <input
        id="form__detail"
        className={styles.form__item}
        placeholder="請輸入明細"
        required
        value={newDetail}
        onChange={(e) => setNewDetail(e.target.value)}
      />
      <button className={styles.form__item}>新增紀錄</button>
    </form>
  );
}

function List({ accountRecord, deleteAccountRecord }: ListProps) {
  return (
    <div className={styles.list__accountRecord}>
      {accountRecord.map((record: any) => (
        <div className={styles.list__row} key={record.id}>
          {/* <label
            style={{ color: record.category === "收入" ? "green" : "red" }}
          > */}
          <span
            className={styles.list__amount}
            style={{ color: record.amount > 0 ? "green" : "red" }}
          >
            {record.amount > 0 ? `+${record.amount}` : record.amount}
          </span>
          <span className={styles.list__detail}>{record.detail}</span>
          <button
            onClick={() => deleteAccountRecord(record.id)}
            className={styles.list__deleteBtn}
          >
            刪除
          </button>
        </div>
      ))}
    </div>
  );
}
