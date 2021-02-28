import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAddType from "../components/formAddType";
import FormEditType from "../components/formEditType";

const Types = () => {
  const [ProductId, setProductId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // all data
  const { data: allTypes, revalidate, statusGet, errorGet } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  // create product

  // get one data
  const { data: Type, statusDetails, errorDetails } = qoreContext
    .view("allTypes")
    .useGetRow(ProductId);

  // change update
  const updateTypes = qoreContext.view("allTypes").useUpdateRow();

  //   delete product
  const deleteTypes = qoreContext.view("allTypes").useDeleteRow();
  function getDetailProduct(id) {
    setModalVisible(!modalVisible);
    setProductId(id);
  }

  async function updateType(id, status) {
    console.log(`updating types data ${id} => ${status} to ${!status}`);
    await updateTypes
      .updateRow(id, {
        status: !status,
      })
      .then((resp) => {
        console.log(resp, "response");
      });
    revalidate();
  }

  async function removeType(id) {
    console.log(`deleting type data with id ${id}`);
    await deleteTypes.deleteRow(id);
    revalidate();
  }

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
          {formAdd ? <FormAddType /> : null}
          {formEdit ? <FormEditType type={Type} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {Type ? (
                <>
                  <h2>{Type.name}</h2>
                  <div className={styles.modalsContent}>
                    <p>Type ID : {Type.id} </p>
                    <h2>Description : </h2>
                    <p>{Type.description ? Type.description : "none"}</p>
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
            <h1>Type Management</h1>
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
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allTypes
              ? allTypes.map((type, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{type.name}</td>
                      <td>{type.description}</td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetailProduct(type.id)}>
                          Details
                        </button>

                        <button onClick={() => removeType(type.id)}>
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

export default Types;
