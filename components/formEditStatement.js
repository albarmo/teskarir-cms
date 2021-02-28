import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

var answerForm = [];

const FormEditStatement = (props) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [add, setAdd] = useState("");
  const [answer, setAnswer] = useState([{ Answer: "" }]);
  const [isVisible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, []);

  const { updateRow, status } = qoreContext
    .view("allStatements")
    .useUpdateRow();

  const { data: allStatements, revalidate } = qoreContext
    .view("allStatements")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function editStatement(e) {
    e.preventDefault();
    let newData = await updateRow(props.statement.id, {
      name: name,
      type: type,
      answers: answer,
    });
    console.log(status);
    if (newData) {
      revalidate();
      setVisible(false);
    }
  }

  function answerPush() {
    answerForm.push({
      Answer: add,
    });
    setAdd("");
    setAnswer(answerForm);
    console.log(answerForm);
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Edit Statement</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Statement Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder={props.statement.name}
              />

              <label htmlFor="description">Type</label>
              <select onChange={(e) => setType(e.target.value)}>
                <option value="TF">True False</option>
                <option value="PG">Pilihan Ganda</option>
                <option value="R">Rangking</option>
              </select>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "10px",
                }}
              >
                {answerForm
                  ? answerForm.map((val, id) => {
                      return (
                        <>
                          <p
                            key={id}
                            style={{
                              width: "20%",
                              background: "gray",
                              padding: "6px",
                              marginTop: "10px",
                              borderRadius: "5px",
                              marginLeft: "10px",
                              textAlign: "center",
                            }}
                          >
                            {val.Answer}
                          </p>
                        </>
                      );
                    })
                  : null}
              </div>
              {type === "PG" ? (
                <>
                  <label htmlFor="major">Answer</label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <input
                      type="text"
                      name="anwer"
                      onChange={(e) => setAdd(e.target.value)}
                      placeholder="answer json"
                      style={{
                        padding: "3%",
                        borderRadius: "5px",
                        marginLeft: "5px",
                        width: "80%",
                      }}
                    />
                    <h3
                      style={{
                        background: "gray",
                        color: "white",
                        padding: "2.5%",
                        borderRadius: "5px",
                        marginLeft: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => answerPush()}
                    >
                      push
                    </h3>
                  </div>
                </>
              ) : null}
            </div>
            <br></br>
            <button className={styles.btn} onClick={(e) => editStatement(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => router.push("/statements")}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormEditStatement;
