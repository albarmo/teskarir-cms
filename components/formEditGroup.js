import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormEditGroup = (props) => {
  const router = useRouter();
  const [isVisible, setVisible] = useState(true);
  const [groupId, setGroupId] = useState("");

  const [name, setName] = useState("");
  const [statementsId, setStatementsId] = useState("");
  const [testId, setTestId] = useState("");

  useEffect(() => {
    setVisible(true);
    setGroupId(props.group.id);
  }, []);

  let statementArr = props.group.statements.nodes;
  let testIdProps = props.group.testId;
  //   useEffect(async () => {
  //     if (props.group.testId || props.group.statements) {
  //       await removeRelation({
  //         testId: [props.group.testId.id],
  //         statements: statementArr.map((item) => item.id),
  //       });
  //     }
  //   }, []);

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allStatementsGroup")
    .useRelation(props.group.id);
  //   console.log(statuses, "status remove relation statement group edit");

  const { data: allTest } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" });

  const { data: allStatements } = qoreContext
    .view("allStatements")
    .useListRow({ order: "asc" });

  async function typeTestHandler(id) {
    setTestId(id);
  }

  const { data: allStatementsGroup, revalidate } = qoreContext
    .view("allStatementsGroup")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { updateRow, status } = qoreContext
    .view("allStatementsGroup")
    .useUpdateRow();
  console.log(status, "<<< status edit Group of statement");

  async function editData(e) {
    e.preventDefault();
    try {
      if (testIdProps && statementArr) {
        await removeRelation({
          testId: [testIdProps],
          statements: statementArr.map((item) => item.id),
        });
      }
      let newOutput = await updateRow(props.group.id, {
        name: name,
      });
      await addRelation({
        testId: [testId],
        statements: [statementsId],
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
          INI DIA : {JSON.stringify(props.group.statements)}
          <h2>Edit Statement Group</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder={props.group.name}
              />

              <label htmlFor="test id">Type ID</label>
              <select onChange={(e) => typeTestHandler(e.target.value)}>
                <option value="none" selected>
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

              <label htmlFor="test id">Type ID</label>
              <select onChange={(e) => setStatementsId(e.target.value)}>
                <option value="" selected>
                  none
                </option>
                {allStatements
                  ? allStatements.map((option, index) => {
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

export default FormEditGroup;
