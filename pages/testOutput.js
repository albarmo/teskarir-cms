import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAdd from "../components/formAddTestOutput";
import FormEdit from "../components/formEditTestOuput";
import Swal from "sweetalert2";

const Testoutput = () => {
  const [GroupId, setGroupId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // all allData
  const { data: allData, revalidate, statusGet, errorGet } = qoreContext
    .view("allOutputTest")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  // create product

  // read product
  const { data: Group, status, errorDetails } = qoreContext
    .view("allOutputTest")
    .useGetRow(GroupId);
  console.log(status);

  //   delete product
  const deleteStatementGroup = qoreContext.view("allOutputTest").useDeleteRow();

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

  function editView() {
    setModalVisible(!modalVisible);
    setFormEdit(!formEdit);
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
          {formAdd ? <FormAdd /> : null}
          {formEdit ? <FormEdit group={Group} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {Group ? (
                <>
                  <h2>{Group.name}</h2>
                  <div className={styles.modalsContent}>
                    <p style={{ width: "80%" }}>Group ID : {Group.id} </p>
                    <p style={{ width: "60%" }}>
                      Test : {JSON.stringify(Group.testId)}
                    </p>
                    <p style={{ width: "75%", overflow: "scroll" }}>
                      Output : {JSON.stringify(Group.outputId)}
                    </p>
                    <p>Grade : {Group.res}</p>
                  </div>
                  <div className={styles.containerButton}>
                    <button onClick={() => editView()}>Edit Data</button>
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
            <h1>Test Output Management</h1>
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
              <th>Test</th>
              <th>Output</th>
              <th>Result</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allData
              ? allData.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td>{(id += 1)}</td>
                      <td>{item.name}</td>
                      <td>{item.testId ? item.testId.displayField : "none"}</td>
                      <td>
                        {item.outputId ? item.outputId.displayField : "none"}
                      </td>
                      <td>{item.res}</td>
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

export default Testoutput;
