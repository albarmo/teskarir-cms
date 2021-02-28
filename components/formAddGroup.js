import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormAddGroup = () => {
  const [isVisible, setVisible] = useState(true);
  const [outputId, setOutputId] = useState("");
  const [typeId, setTypeId] = useState("6f87abac-aa94-4f69-bd19-e34105ed9c50");
  let statements = [];

  const { insertRow, status } = qoreContext
    .view("allStatementsGroup")
    .useInsertRow();
  console.log(status, "add data");

  useEffect(() => {
    setVisible(true);
  }, []);

  const { data: allTest } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" });

  const { data: allStatements } = qoreContext
    .view("allStatements")
    .useListRow({ order: "asc" });

  async function typeTestHandler(id) {
    console.log(id, "id");
    setTypeId(id);
  }

  const { data: allStatementsGroup, revalidate } = qoreContext
    .view("allStatementsGroup")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function addData(e) {
    e.preventDefault();
    try {
      let newOutput = await insertRow({
        name: "test",
        testId: [typeId],
        statements: statements.map((statement) => statement),
      });
      if (newOutput) {
        setOutputId(newOutput.id);
        setVisible(false);
        revalidate();
      }
    } catch (error) {
      console.log(error);
    }
    statements = [];
  }

  useEffect(() => {
    statements = [];
  }, []);

  function statementHandler(id) {
    statements.includes(id) ? console.log("included") : statements.push(id);
    console.log(statements, "<< current selected statement");
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Statement Group</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="test id">Type ID</label>
              <select onChange={(e) => typeTestHandler(e.target.value)}>
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
              <label htmlFor="test id">Statement</label>
              {JSON.stringify(statements)}
              {statements
                ? statements.map((selected, id) => {
                    return (
                      <>
                        <p
                          key={id}
                          style={{
                            width: "auto",
                            height: "30px",
                            background: "green",
                            padding: "5px",
                            textAlign: "center",
                            cursor: "pointer",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            color: "white",
                          }}
                          // onClick={() => statementHandler(selected.id)}
                        >
                          {selected.name}
                        </p>
                      </>
                    );
                  })
                : "loading"}

              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(5, 1fr)",
                  gridColumnGap: "5px",
                  gridAutoFlow: "row",
                }}
              >
                {allStatements
                  ? allStatements.map((option, index) => {
                      return (
                        <>
                          {!statements.includes(option.id) ? (
                            <p
                              key={index}
                              style={{
                                width: "auto",
                                background: "#A9A8A9",
                                padding: "10px",
                                textAlign: "center",
                                cursor: "pointer",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                color: "white",
                              }}
                              onClick={() => statementHandler(option.id)}
                            >
                              {option.name}
                            </p>
                          ) : null}
                        </>
                      );
                    })
                  : null}
              </div>
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

export default FormAddGroup;
