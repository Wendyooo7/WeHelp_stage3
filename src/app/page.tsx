"use client";

// import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Wendy の React 練習專案</h1>

      <SignInForm />
      <SignUpForm />

      {/* <Link className={styles.link} href="/accounting" title="點此前往">
        記帳小本本
      </Link> */}
    </main>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    // 清理
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e: any) => {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });

      if (!res) {
        alert("請確認帳號和密碼皆輸入正確");
      }
      //  else {
      //   // const signInEmail = res._tokenResponse.email;
      //   // const SignInDiv = document.querySelector("#signIn");
      //   // SignInDiv.innerHTML = `<p>您已經使用${signInEmail}登入</p>
      //   // <button className=${styles.btn}>立刻開始</button><Link className=${styles.link}>登出</Link>`;
      // }
    } catch (err) {
      console.error(err);
    }
    setEmail("");
    setPassword("");
  };

  const handleSignOut = () => {
    auth.signOut();
    setUserEmail(null);
  };

  if (userEmail) {
    return (
      <div className={styles.signedIn}>
        <p>您已經使用 {userEmail} 登入</p>
        <button className={styles.btn}>立刻開始</button>
        <button onClick={handleSignOut} className={styles.btn}>
          登出
        </button>
      </div>
    );
  } else {
    return (
      <form id="signIn" className={styles.form}>
        <h3>登入系統</h3>
        <div className={styles.formDiv}>
          <label htmlFor="email">電郵：</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formDiv}>
          <label htmlFor="password">密碼：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button onClick={handleSignIn} className={styles.btn}>
          登入
        </button>
      </form>
    );
  }
}

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignUP = async (e: any) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form id="signUp" className={styles.form}>
      <h3>註冊帳戶</h3>
      <div className={styles.formDiv}>
        <label htmlFor="email">電郵：</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formDiv}>
        <label htmlFor="password">密碼：</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </div>

      <button onClick={handleSignUP} className={styles.btn}>
        註冊
      </button>
    </form>
  );
}
