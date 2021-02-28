import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormEditTest = (props) => {
  console.log(props);
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [isVisible, setVisible] = useState(true);

  const [productId, setProductId] = useState("");
  const [typeId, setTypeId] = useState("");

  useEffect(() => {
    setVisible(true);
  }, []);

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allTest")
    .useRelation(props.test.id);
  console.log(statuses, "status remove relation");

  const { data: allData, revalidate } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { data: allProducts, statusProduct, errorProduct } = qoreContext
    .view("allProducts")
    .useListRow({ order: "asc" });

  const { data: allTypes, statusType, errorType } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" });

  const { updateRow, status } = qoreContext.view("allTest").useUpdateRow();
  console.log(status, "status edit test");

  console.log(props);
  let productArr = props.test.productId.nodes;
  let testTypeRelation = props.test.testType;

  async function editData(e) {
    e.preventDefault();
    try {
      await removeRelation({
        testType: [testTypeRelation.id],
        productId: productArr.map((item) => item.id),
      });

      let newOutput = await updateRow(props.test.id, {
        name: name,
        description: description,
        type: type,
      });
      await addRelation({
        productId: [productId],
        testType: [typeId],
      });
      if (newOutput) {
        setVisible(false);
        revalidate();
      }
      console.log(newOutput);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Test </h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name"> Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder={props.test.name}
              />

              <label htmlFor="name"> Description</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setDescription(e.target.value)}
                placeholder={props.test.description}
              />

              <label htmlFor="qtype"> Quiz Type</label>
              <select onChange={(e) => setType(e.target.value)}>
                <option value="R">Ranking</option>
                <option value="PG">Pilihan Ganda</option>
                <option value="TF">True Or False</option>
              </select>
              <label htmlFor="test id">Product ID</label>
              <select onChange={(e) => setProductId(e.target.value)}>
                {allProducts
                  ? allProducts.map((option, index) => {
                      return (
                        <>
                          <option key={index} value={option.id}>
                            {`${option.name} ${option.majors}`}
                          </option>
                        </>
                      );
                    })
                  : null}
              </select>
              <label htmlFor="test id">Type ID</label>
              <select onChange={(e) => setTypeId(e.target.value)}>
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
            <button className={styles.btn} onClick={(e) => editData(e)}>
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

export default FormEditTest;
