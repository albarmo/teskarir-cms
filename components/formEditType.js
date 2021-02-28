import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormEditTypes = (props) => {
  // console.log(props);
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setVisible] = useState(true);

  const { data: allOutputTest, revalidate } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });
  const { updateRow, status } = qoreContext.view("allTypes").useUpdateRow();

  useEffect(() => {
    setVisible(true);
  }, []);

  async function editItem(e) {
    e.preventDefault();
    await updateRow(props.type.id, {
      name: name,
      description: description,
    });
    console.log(status);
    if (status == "success") {
      setVisible(false);
      revalidate();
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Edit Type</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                name="name"
                defaultValue={props.type.name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={props.type.description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <br></br>
            <button className={styles.btn} onClick={(e) => editItem(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => setVisible(!isVisible)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormEditTypes;
