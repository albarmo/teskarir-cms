import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormAddOutput = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setVisible] = useState(true);
  const [idRelationType, setIdRelationType] = useState(
    "df178bb4-0589-432b-bca4-e3902089b1f6"
  );

  const [outputId, setOutputId] = useState("");
  const { insertRow, status } = qoreContext.view("allOutputs").useInsertRow();

  useEffect(() => {
    setVisible(true);
  }, []);

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allOutputs")
    .useRelation(outputId);

  const { data: allTypes, statusallTypes, errorallTypes } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" });
  const { user } = qoreContext.useCurrentUser();

  async function typeTestHandler(id) {
    console.log(id, "id");
    setIdRelationType(id);
  }

  const { data: allOutputs, revalidate } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function addOutput(e) {
    e.preventDefault();
    try {
      let newOutput = await insertRow({
        name: name,
        description: description,
        typeTestId: [idRelationType],
      });
      setOutputId(newOutput.id);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (status === "success") {
      setVisible(false);
      revalidate();
    }
  }, [status]);

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Output</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Output Name</label>
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
              <label htmlFor="description">Type Test</label>
              <select onChange={(e) => typeTestHandler(e.target.value)}>
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
            <button className={styles.btn} onClick={(e) => addOutput(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => router.push("/outputs")}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormAddOutput;
