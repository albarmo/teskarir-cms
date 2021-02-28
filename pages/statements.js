import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAddStatement from "../components/formAddStatement";
import FormEditStatement from "../components/formEditStatement";
import Swal from "sweetalert2";

const Statements = () => {
  const [ProductId, setProductId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // all members
  const {
    data: allStatements,
    revalidate,
    statusGet,
    errorGet,
  } = qoreContext
    .view("allStatements")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  // create product

  useEffect(() => {
    revalidate();
  }, []);

  // read product
  const { data: Statement, statusDetails, errorDetails } = qoreContext
    .view("allStatements")
    .useGetRow(ProductId);

  // change update
  const updateUserStatus = qoreContext.view("allStatements").useUpdateRow();

  //   delete product
  const deleteStatement = qoreContext.view("allStatements").useDeleteRow();
  function getDetail(id) {
    setModalVisible(!modalVisible);
    setProductId(id);
  }

  async function updateStatus(id, status) {
    console.log(`updating user status ${id} => ${status} to ${!status}`);
    await updateUserStatus
      .updateRow(id, {
        status: !status,
      })
      .then((resp) => {
        console.log(resp, "response");
      });
    revalidate();
  }

  async function removeStatement(id) {
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
        await deleteStatement.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  return (
    <>
      <Head>
        <title>Admin Teskarir - Statement</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {/* form add */}
          {formAdd ? <FormAddStatement /> : null}
          {formEdit ? <FormEditStatement statement={Statement} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {Statement ? (
                <>
                  <h2>{Statement.name}</h2>
                  <div className={styles.modalsContent}>
                    <p>Statement ID : {Statement.id} </p>
                    <h2>Answer : </h2>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {Statement.answers
                        ? Statement.answers.map((val, id) => {
                            return (
                              <>
                                <p
                                  key={id}
                                  style={{
                                    width: "80%",
                                    background: "gray",
                                    padding: "6px",
                                    marginTop: "5px",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    color: "white",
                                  }}
                                >
                                  {val.Answer}
                                </p>
                              </>
                            );
                          })
                        : null}
                    </div>
                    <h2>Type : </h2>
                    <p>{Statement.type ? Statement.type : "none"}</p>
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
              ) : null}
            </div>
          ) : null}

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
              <th>name</th>
              <th>Type</th>
              <th>Answer</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allStatements
              ? allStatements.map((state, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{state.name}</td>
                      <td>{state.type}</td>
                      <td>
                        {state.answers
                          ? state.answers.map((val, id) => {
                              return (
                                <>
                                  <span key={id}>{`${val.Answer}  - `}</span>
                                </>
                              );
                            })
                          : "none"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetail(state.id)}>
                          Details
                        </button>

                        <button onClick={() => removeStatement(state.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </table>
        </div>
      </div>
    </>
  );
};

export default Statements;
