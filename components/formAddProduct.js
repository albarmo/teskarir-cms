import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormAddProduct = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [majors, setMajors] = useState("");
  const [isVisible, setVisible] = useState(true);

  const { insertRow, status } = qoreContext.view("allProducts").useInsertRow();

  const { data: allProducts, revalidate } = qoreContext
    .view("allProducts")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  useEffect(() => {
    setVisible(true);
  }, []);

  async function addProduct(e) {
    e.preventDefault();
    try {
      let newData = await insertRow({
        name: name,
        description: description,
        majors: majors,
      });
      if (newData) {
        console.log(newData);
        setVisible(false);
        revalidate();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Product</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="product name"
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="product description"
              />

              <label htmlFor="major">Majors</label>
              <input
                type="text"
                name="major"
                onChange={(e) => setMajors(e.target.value)}
                placeholder="product majors"
              />
            </div>
            <br></br>
            <button className={styles.btn} onClick={(e) => addProduct(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => router.push("/products")}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormAddProduct;
