import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormAddTest = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [isVisible, setVisible] = useState(true);

  const [productId, setProductId] = useState("");
  const [typeId, setTypeId] = useState("");

  const [outputId, setOutputId] = useState("");
  const { insertRow, status } = qoreContext.view("allTest").useInsertRow();

  useEffect(() => {
    setVisible(true);
  }, []);

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allTest")
    .useRelation(outputId);

  const { data: allProducts, statusProduct, errorProduct } = qoreContext
    .view("allProducts")
    .useListRow({ order: "asc" });
  const { user } = qoreContext.useCurrentUser();

  const { data: allTypes, statusType, errorType } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" });

  async function typeTestHandler(id) {
    console.log(id, "id");
    setIdRelationType(id);
  }

  const { data: allTest, revalidate } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function addData(e) {
    e.preventDefault();
    try {
      let newOutput = await insertRow({
        name: name,
        description: description,
        type: type,
        productId: [productId],
        testType: [typeId],
      });
      if (newOutput) {
        setVisible(false);
        revalidate();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   if (status === "success") {
  //     revalidate();
  //     setVisible(false);
  //   }
  // }, [status]);

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Test </h2>
          {name}
          {description}
          {type}
          {productId}
          {typeId}
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name"> Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="type name"
              />

              <label htmlFor="name"> Description</label>
              <textarea
                style={{ width: "100%" }}
                type="text"
                name="name"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="type name"
              />

              <label htmlFor="qtype"> Quiz Type</label>
              <select onChange={(e) => setType(e.target.value)}>
                <option value="" selected>
                  none
                </option>
                <option value="R">Ranking</option>
                <option value="PG">Pilihan Ganda</option>
                <option value="TF">True Or False</option>
              </select>
              <label htmlFor="test id">Product ID</label>
              <select onChange={(e) => setProductId(e.target.value)}>
                <option value="" selected>
                  none
                </option>
                {allProducts
                  ? allProducts.map((option, index) => {
                      return (
                        <>
                          <option key={index} value={option.id}>
                            {`${option.name} - ${option.majors}`}
                          </option>
                        </>
                      );
                    })
                  : null}
              </select>
              <label htmlFor="test id">Type ID</label>
              <select onChange={(e) => setTypeId(e.target.value)}>
                <option value="" selected>
                  none
                </option>
                {allTypes
                  ? allTypes.map((option, index) => {
                      return (
                        <>
                          <option key={index} value={option.id}>
                            {option.name}
                          </option>
                        </>
                      );
                    })
                  : null}
              </select>
            </div>

            <br></br>
            <button className={styles.btn} onClick={(e) => addData(e)}>
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

export default FormAddTest;
