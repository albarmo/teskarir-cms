import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAddOutput from "../components/formAddOutput";
import FormEditOutput from "../components/formEditOutput";
import Swal from "sweetalert2";

const Outputs = () => {
  const [itemId, setItemId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  useEffect(() => {
    revalidate();
  }, []);

  // all data
  const {
    data: allOutputs,
    revalidate,
    statusGet,
    errorGet,
  } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  // get one data
  const { data: someOutput, statusDetails, errorDetails } = qoreContext
    .view("allOutputs")
    .useGetRow(itemId);

  //   delete product
  const deleteTypes = qoreContext.view("allOutputs").useDeleteRow();
  function getDetailProduct(id) {
    setModalVisible(!modalVisible);
    setItemId(id);
  }
  async function removeType(id) {
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
        console.log(`deleting outputs data with id ${id}`);
        await deleteTypes.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allOutputs")
    .useRelation(itemId);
  console.log(statuses, "<< status remove relation");

  const removeTypeId = async (taskId, relationId) => {
    setItemId(taskId);
    console.log(itemId, "item id");
    console.log(taskId, "task id");
    console.log(relationId, "relation id");
    await removeRelation({ typeTestId: [relationId] });
    revalidate();
  };

  return (
    <>
      <Head>
        <title>Admin Teskarir - Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {/* form add */}
          {formAdd ? <FormAddOutput /> : null}
          {formEdit ? <FormEditOutput output={someOutput} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {someOutput ? (
                <>
                  <h2>{someOutput.name}</h2>
                  <div className={styles.modalsContent}>
                    <p>Output ID : {someOutput.id} </p>
                    <p>Test Type :</p>
                    <p>
                      {someOutput.typeTestId
                        ? JSON.stringify(someOutput.typeTestId)
                        : null}
                    </p>
                    <h2>Description : </h2>
                    <p>{someOutput ? someOutput.description : "none"}</p>
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
            <h1>Output Management</h1>
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
              <th>Description</th>
              <th>Test Type</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allOutputs
              ? allOutputs.map((outputs, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{outputs.name}</td>
                      <td>{outputs.description}</td>
                      <td>
                        {outputs.typeTestId
                          ? outputs.typeTestId.nodes.map((val, id) => {
                              return (
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) =>
                                    removeTypeId(outputs.id, val.id)
                                  }
                                >{`${val.displayField} - `}</span>
                              );
                            })
                          : "none"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetailProduct(outputs.id)}>
                          Details
                        </button>

                        <button onClick={() => removeType(outputs.id)}>
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

export default Outputs;
