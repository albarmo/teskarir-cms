import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import qoreContext from "../qoreContext";

const Navbar = () => {
  const router = useRouter();
  const { user } = qoreContext.useCurrentUser();

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("token");
    console.log("User is logged out, store now is clear");
    router.push("/");
  };

  return (
    <>
      <div className={styles.navbar}>
        <div>
          <h1>Admin Dashboard</h1>
          {user ? <h4>{user.data.email}</h4> : <h4>Teskarir.com</h4>}
        </div>
        <div className={styles.menu}>
          <p onClick={() => router.push("/users")}>User Management</p>
          <p onClick={() => router.push("/products")}>Products</p>
          <p onClick={() => router.push("/types")}>Types</p>
          <p onClick={() => router.push("/outputs")}>Outputs</p>
          <p onClick={() => router.push("/statements")}>Statements</p>
          <p onClick={() => router.push("/statementGroup")}>Statement Group</p>
          <p onClick={() => router.push("/test")}>Test</p>
          <p onClick={() => router.push("/testOutput")}>Test Output</p>
          <p onClick={() => router.push("/submision")}>Submision</p>
          <p onClick={() => router.push("/scheduled")}>Scheduled Test</p>
          <p onClick={() => router.push("/article")}>Article</p>
          <p onClick={() => router.push("/historyTest")}>History Test</p>
        </div>
        <p onClick={() => handleLogout()}>Logout</p>
      </div>
    </>
  );
};

export default Navbar;
