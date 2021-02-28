import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormAddTestOutput = () => {
  const router = useRouter();
  const [isVisible, setVisible] = useState(true);
  const [name, setName] = useState("");
  const [testId, setTestId] = useState("");
  const [outputId, setOutputId] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    setVisible(true);
    console.log(user);
  }, []);

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allTest")
    .useRelation(outputId);

  const { data: allTest, statusTest, errorTest } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" });

  const { user } = qoreContext.useCurrentUser();

  const { data: allOutput, statusType, errorType } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" });

  const { insertRow, status } = qoreContext
    .view("allOutputTest")
    .useInsertRow();
  console.log(status);

  const { data: allOutputTest, revalidate } = qoreContext
    .view("allOutputTest")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function addData(e) {
    e.preventDefault();
    try {
      let newOutput = await insertRow({
        name: name,
        res: result,
        testId: [testId],
        outputId: [outputId],
      });
      if (newOutput) {
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
          <h2>Add Test Output </h2>
          <form>
            <div className={styles.formInput} style={{ textAlign: "left" }}>
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                style={{ width: "80%" }}
              />

              <label htmlFor="test-id">Test</label>
              <select onChange={(e) => setTestId(e.target.value)}>
                <option value="" selected>
                  none
                </option>
                {allTest
                  ? allTest.map((option, index) => {
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

              <label htmlFor="output-id">Output</label>
              <select onChange={(e) => setOutputId(e.target.value)}>
                <option value="" selected>
                  none
                </option>
                {allOutput
                  ? allOutput.map((option, index) => {
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

              <label htmlFor="qtype"> Result</label>
              <select onChange={(e) => setResult(e.target.value)}>
                <option value="-" selected>
                  none
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <br></br>
            <button className={styles.btn} onClick={(e) => addData(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => setVisible(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormAddTestOutput;
