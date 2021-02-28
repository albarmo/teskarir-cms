import Head from "next/head";
import { useEffect, useState } from "react";
import qoreContext from "../qoreContext";
import styles from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const client = qoreContext.useClient();

  // login authentification
  const { data: authData, statusAuth, errorAuth } = qoreContext
    .view("authData")
    .useListRow({ order: "asc" });
  // get current user

  function getUserID(email) {
    let userCheck = authData.filter(function (user) {
      return user.email === email;
    });
    if (userCheck.length > 0) {
      console.log(`user ada! email => ${userCheck[0].email}`);
      console.log(`user ada! role => ${userCheck[0].role.displayField}`);
    }
    return userCheck[0].role.displayField;
  }

  const handleLogin = async () => {
    console.log("login clicked", email, password);
    try {
      const token = await client.authenticate(email, password);
      localStorage.setItem("access_token", token);
      Cookies.set("token", token);
      console.log(token, "user tokenn");
      console.log(
        localStorage.getItem("access_token"),
        "<<< from localStorage"
      );
      console.log(getUserID(email));
      let role = getUserID(email);
      if (role === "admin") {
        console.log(role, "<< user role");
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "success login",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/users");
        console.log(`success login`);
      } else {
        console.log("users role not admin redirect to public");

        router.push("http://localhost:3001/");
      }
    } catch (error) {
      console.log(error.message);
      if (error.message == "Request failed with status code 400") {
        Swal.fire({
          title: "Uupps!",
          text: "Jangan lupa masukan email dan password.",
          imageUrl:
            "https://images.vexels.com/media/users/3/193270/isolated/preview/1665b158b55ec87c9c7c6cebc3d702d0-covid-19-symptom-character-headache-by-vexels.png",
          imageWidth: 300,
          imageHeight: 300,
          imageAlt: "imageModal",
        });
      } else if (error.message == "Request failed with status code 401") {
        Swal.fire({
          title: "Email atau password salah!",
          text: "harap masukan email dan password dengan baik ya",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Teskarir</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Admin <a>Teskarir.com</a>
        </h1>
        <p className={styles.description}>lets login </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <form method="post" className="form">
              <label
                htmlFor="user-email"
                style={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                &nbsp;Email
              </label>
              <input
                style={{
                  width: "300px",
                  height: "40px",
                  borderRadius: "5px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                required
              />
              <div className="form-border"></div>
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
                htmlFor="user-password"
              >
                &nbsp;Password
              </label>
              <input
                style={{
                  width: "300px",
                  height: "40px",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                required
              />
              <div className="form-border"></div>

              <div
                style={{
                  background: "#0A76F3",
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                  color: "white",
                  cursor: "pointer",
                  marginTop: "30px",
                }}
                onClick={() => handleLogin()}
              >
                Login
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="http://teskarir.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Teskarir - 1000 startup @2021{" "}
        </a>
      </footer>
    </div>
  );
}
