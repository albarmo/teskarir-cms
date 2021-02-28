import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAddGroup from "../components/formAddGroup";
import FormEditGroup from "../components/formEditGroup";
import Swal from "sweetalert2";

const StatementGroup = () => {
  const [GroupId, setGroupId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);
  const [showAddStatement, setShowAddStatement] = useState(true);

  // all allStatementsGroup
  const {
    data: allStatementsGroup,
    revalidate,
    statusGet,
    errorGet,
  } = qoreContext
    .view("allStatementsGroup")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  // all allStatementsGroup
  const { data: allStatements } = qoreContext
    .view("allStatements")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  useEffect(() => {
    revalidate();
  }, []);

  // read product
  const { data: Group, statusDetails, errorDetails } = qoreContext
    .view("allStatementsGroup")
    .useGetRow(GroupId);

  //   delete product
  const deleteStatementGroup = qoreContext
    .view("allStatementsGroup")
    .useDeleteRow();

  function getDetail(id) {
    setModalVisible(!modalVisible);
    setGroupId(id);
  }

  async function removeData(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(`deleting group statement with id ${id}`);
        await deleteStatementGroup.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  function showHandler(id) {
    setGroupId(id);
    setShowAddStatement(!showAddStatement);
    // console.log(GroupId, "<<< group id");
  }

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allStatementsGroup")
    .useRelation(GroupId);
  console.log(statuses, "status add statement to table group statement");

  const addStatement = async (idStatement) => {
    setShowAddStatement(!showAddStatement);
    await addRelation({
      statements: [idStatement],
    });
    revalidate();
  };

  const removeRelationById = async (idStatement) => {
    await removeRelation({ statements: [idStatement] });
  };

  function relationHanler(statementId, groupId) {
    console.log(statementId, "<<<>>>", groupId, "<<<<<");
    setGroupId(groupId);
    console.log(groupId);
    removeRelationById(statementId);
    revalidate();
  }

  return (
    <>
      <Head>
        <title>Admin Teskarir - SG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {/* form add */}
          {formAdd ? <FormAddGroup /> : null}
          {formEdit ? <FormEditGroup group={Group} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {Group ? (
                <>
                  <h2>{Group.name}</h2>
                  <div className={styles.modalsContent}>
                    <p>Group ID : {Group.id} </p>
                    <p>
                      <h3>Test :</h3>
                      {JSON.stringify(Group.testId)}
                    </p>

                    <p>
                      <h3>Statements :</h3>
                      {Group.statements
                        ? Group.statements.nodes.map((state, id) => {
                            return <p>{state.displayField}</p>;
                          })
                        : "null"}
                    </p>
                  </div>
                  <div className={styles.containerButton}>
                    <button onClick={() => setFormEdit(!formEdit)}>
                      Edit Data
                    </button>
                    <button
                      onClick={() => setModalVisible(false)}
                      style={{
                        width: "90px",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                "unset"
              )}
            </div>
          ) : (
            "unset"
          )}

          <div className={styles.headerSection}>
            <h1>Statement Management</h1>
            <img
              src="http://teskarir.com/wp-content/uploads/2020/06/imageedit_17_9008611935-150x150.png"
              alt="logo teskarir"
            ></img>
          </div>
          <button
            className={styles.buttonAdd}
            onClick={() => setFormAdd(!formAdd)}
          >
            Tambah Data
          </button>

          <table>
            <tr>
              <th>No</th>
              <th>Test ID</th>
              <th>Statement ID</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allStatementsGroup
              ? allStatementsGroup.map((val, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{val.testId ? val.testId.displayField : "none"}</td>
                      <td>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {val.statements
                            ? val.statements.nodes.map((item, id) => {
                                return (
                                  <span
                                    key={id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      relationHanler(item.id, val.id)
                                    }
                                  >{` ${id + 1}. ${item.displayField}`}</span>
                                );
                              })
                            : "unset"}
                          {showAddStatement ? (
                            <p
                              style={{
                                cursor: "pointer",
                                background: "#000038",
                                width: "40%",
                                padding: "1%",
                                textAlign: "center",
                                borderRadius: "5px",
                                color: "white",
                              }}
                              onClick={() => showHandler(val.id)}
                            >
                              + add statement
                            </p>
                          ) : (
                            <select
                              style={{ marginTop: "20px" }}
                              onChange={(e) => addStatement(e.target.value)}
                            >
                              <option value="none" selected>
                                unset
                              </option>
                              {allStatements
                                ? allStatements.map((statement, id) => {
                                    return (
                                      <option key={id} value={statement.id}>
                                        {statement.name}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetail(val.id)}>
                          Details
                        </button>

                        <button onClick={() => removeData(val.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : "unset"}
          </table>
        </div>
      </div>
    </>
  );
};

export default StatementGroup;
