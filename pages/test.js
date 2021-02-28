import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAdd from "../components/formAddTest";
import FormEdit from "../components/formEditTest";
import Swal from "sweetalert2";

const StatementGroup = () => {
  const [GroupId, setGroupId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // all allData
  const { data: allData, revalidate, statusGet, errorGet } = qoreContext
    .view("allTest")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  useEffect(() => {
    revalidate();
  }, []);

  // read product
  const { data: Test, statusDetails, errorDetails } = qoreContext
    .view("allTest")
    .useGetRow(GroupId);

  //   delete product
  const deleteStatementGroup = qoreContext.view("allTest").useDeleteRow();

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
        await deleteStatementGroup.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  return (
    <>
      <Head>
        <title>Admin Teskarir - Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {/* form add */}
          {formAdd ? <FormAdd /> : null}
          {formEdit ? <FormEdit test={Test} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {Test ? (
                <>
                  <h2>{Test.name}</h2>
                  <div className={styles.modalsContent}>
                    <p style={{ width: "60%" }}>Test ID : {Test.id} </p>
                    <p>Description: {Test.description} </p>
                    <p>Product: {JSON.stringify(Test.productId)}</p>
                    <p>Type : {JSON.stringify(Test.testType)} </p>
                    <p>Quiz Type : {Test.type} </p>
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
            <h1>Test Management</h1>
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
              <th>Product </th>
              <th>Type Test </th>
              <th>Quiz Type </th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allData
              ? allData.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      {/* <td>{item.productId.nodes[0].id}</td> */}
                      {item.productId ? (
                        <td>
                          {item.productId.nodes
                            ? item.productId.nodes[0].displayField
                            : null}
                        </td>
                      ) : null}
                      <td>
                        {item.testType ? item.testType.displayField : "none"}
                      </td>
                      <td>{item.type}</td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetail(item.id)}>
                          Details
                        </button>

                        <button onClick={() => removeData(item.id)}>
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

export default StatementGroup;
