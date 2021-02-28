import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormEditProduct = (props) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [majors, setMajors] = useState("");
  const [isVisible, setVisible] = useState(true);

  const { updateRow, status } = qoreContext.view("allProducts").useUpdateRow();

  async function editProduct(e) {
    e.preventDefault();
    let newData = await updateRow(props.product.id, {
      name: name,
      description: description,
      majors: majors,
    });
    console.log(status);
    if (newData) {
      console.log(newData);
      setVisible(false);
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Edit Product</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder={props.product.name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                placeholder={props.product.description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label htmlFor="major">Majors</label>
              <input
                type="text"
                name="major"
                placeholder={props.product.majors}
                onChange={(e) => setMajors(e.target.value)}
              />
            </div>
            <br></br>
            <button className={styles.btn} onClick={(e) => editProduct(e)}>
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

export default FormEditProduct;
