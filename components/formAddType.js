import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";
import { set } from "js-cookie";

const FormAddType = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setVisible] = useState(true);

  const { insertRow, status } = qoreContext.view("allTypes").useInsertRow();
  console.log(status);

  const { data: allTypes, revalidate } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function addItem(e) {
    e.preventDefault();
    let newData = await insertRow({ name: name, description: description });
    if (newData) {
      setVisible(!isVisible);
      revalidate();
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Test Type</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Type Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="type name"
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="type description"
              />
            </div>
            <br></br>
            <button className={styles.btn} onClick={(e) => addItem(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => router.push("/types")}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormAddType;
