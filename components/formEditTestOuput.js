import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormEditTestOutput = (props) => {
  console.log(props);
  const router = useRouter();
  const [isVisible, setVisible] = useState(true);
  const [name, setName] = useState("");
  const [testId, setTestId] = useState("");
  const [outputId, setOutputId] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    setVisible(true);
    console.log(user);
    setTestId(props.group.id);
  }, []);

  const { data: allTest, statusTest, errorTest } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" });

  const { user } = qoreContext.useCurrentUser();

  const { data: allOutput, statusType, errorType } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" });

  const { data: allOutputTest, revalidate } = qoreContext
    .view("allOutputTest")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allOutputTest")
    .useRelation(props.group.id);
  console.log(statuses, "<<< remove relation");

  const { updateRow, status } = qoreContext
    .view("allOutputTest")
    .useUpdateRow();
  console.log(status, "updateRow");

  async function editData(e) {
    e.preventDefault();
    if (props.group.testId || props.group.statements) {
      await removeRelation({
        testId: [props.group.testId.id],
        outputId: [props.group.outputId.id],
      });
    }
    try {
      let newOutput = await updateRow(props.group.id, {
        name: name,
        res: result,
      });
      let addNewRelation = await addRelation({
        testId: [testId],
        outputId: [outputId],
      });
      console.log(addNewRelation);
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
          <h2>Edit Test Output </h2>
          <form>
            <div className={styles.formInput} style={{ textAlign: "left" }}>
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder={props.group.name}
                style={{ width: "80%" }}
              />

              <label htmlFor="test-id">Test</label>
              <select onChange={(e) => setTestId(e.target.value)}>
                <option value="empty" selected>
                  empty
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
                <option value="empty" selected>
                  empty
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
                <option value="empty" selected>
                  empty
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <br></br>
            <button className={styles.btn} onClick={(e) => editData(e)}>
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

export default FormEditTestOutput;
