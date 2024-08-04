"use client";
import styles from "./page.module.scss";
import Link from "next/link";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/");
      } else {
        const userId = user.uid;
        try {
          const recordsSnapshot = await getDocs(
            collection(db, "users", userId, "records")
          );
          const recordsData = recordsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              detail: data.detail,
              category: data.category,
              amount: data.amount,
            } as {
              id: string;
              title: string;
              detail: string;
              category: string;
              amount: number;
            };
          });
          setAccountRecord(recordsData);
        } catch (error) {
          console.error("載入紀錄時發生錯誤：", error);
        }
      }
    });

    // 清理
    return () => unsubscribe();
  }, []);

  const amount = parseFloat(newInput) * (category === "收入" ? 1 : -1); // 根據類別設置正負金額

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!Number.isInteger(Number(newInput))) {
      alert("請輸入數字");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.error("使用者未登入");
      return;
    }

    const userId = user.uid;
    const newRecord = {
      id: crypto.randomUUID(),
      title: newInput,
      detail: newDetail,
      category,
      amount,
    };

    setAccountRecord((currentAccountRecord) => [
      ...currentAccountRecord,
      newRecord,
    ]);

    try {
      await setDoc(doc(db, "users", userId, "records", newRecord.id), {
        title: newInput,
        detail: newDetail,
        category: category,
        amount: amount,
      });
      console.log("紀錄已儲存到 Firestore");
    } catch (error) {
      console.error("儲存到 Firestore 時發生錯誤：", error);
    }

    setNewInput("");
    setNewDetail("");
  }

  // 計算總和
  const totalAmount = accountRecord.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  async function deleteAccountRecord(id: string) {
    const user = auth.currentUser;
    if (!user) {
      console.error("使用者未登入");
      return;
    }
    const userId = user.uid;

    try {
      await deleteDoc(doc(db, "users", userId, "records", id));
      console.log("紀錄已從 Firestore 刪除");

      setAccountRecord((currentAccountRecord) => {
        return currentAccountRecord.filter((record) => record.id !== id);
      });
    } catch (error) {
      console.error("從 Firestore 刪除紀錄時發生錯誤：", error);
    }
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
        className={styles.form__item}
      >
        <option value="收入">收入</option>
        <option value="支出">支出</option>
      </select>
      <input
        className={styles.form__item}
        placeholder="請輸入整數金額"
        size={12}
        required
        value={newInput}
        onChange={(e) => setNewInput(e.target.value)}
      />
      <input
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
