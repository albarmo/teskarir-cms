import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAdd from "../components/formAddArticle";
import FormEdit from "../components/formEditArticle";
import Swal from "sweetalert2";

const Article = () => {
  const [ProductId, setProductId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // get all data from submision qore project table
  const { data: allArticle, status, error, revalidate } = qoreContext
    .view("allArticle")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });
  console.log(status, "<< Status get all article");
  console.log(error, "<< error get all article");

  // get one data
  const { data: someArticle } = qoreContext
    .view("allArticle")
    .useGetRow(ProductId);

  function getDetail(id) {
    setModalVisible(!modalVisible);
    setProductId(id);
  }

  // change update status (approval / rejected)
  const updateData = qoreContext.view("allArticle").useUpdateRow();
  async function changeStatus(value, id) {
    console.log(`updating  data ${id} => ${value} `);
    await updateData
      .updateRow(id, {
        status: value,
      })
      .then((resp) => {
        console.log(resp, "response");
      });
    revalidate();
  }

  //   delete some submision data
  const deleteData = qoreContext.view("allArticle").useDeleteRow();
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
        await deleteData.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  console.log(allArticle);

  return (
    <>
      <Head>
        <title>Admin Teskarir - Article</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {/* form add */}
          {formAdd ? <FormAdd /> : null}
          {formEdit ? <FormEdit article={someArticle} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {someArticle ? (
                <>
                  <h2>Title : {someArticle.title}</h2>
                  <div className={styles.modalsContent}>
                    <p>someArticle ID : {someArticle.id} </p>
                    <p>{someArticle.title ? someArticle.title : "loading"}</p>
                    <p>{someArticle.description}</p>
                    <img
                      src={someArticle.image}
                      alt="article image"
                      width="30%"
                    />
                    <p>
                      Tags :
                      {someArticle.tags
                        ? someArticle.tags.nodes.map((state, id) => {
                            return <p>{state.displayField}</p>;
                          })
                        : "null"}
                    </p>
                    <p>Published at : {someArticle.date}</p>
                  </div>
                  <div className={styles.containerButton}>
                    <button onClick={() => setFormEdit(!formEdit)}>
                      Edit this article
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
            <h1>Article Management</h1>
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
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Tag</th>
              <th>Date</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allArticle
              ? allArticle.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{item.title ? item.title : "loading"}</td>
                      <td>{item.description}</td>
                      <td>{item.image}</td>
                      <td>
                        {item.tags.nodes
                          ? item.tags.nodes.map((val, id) => {
                              return (
                                <>
                                  <p key={id}>{val.displayField}</p>
                                </>
                              );
                            })
                          : "unset"}
                      </td>
                      <td>{item.date}</td>
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

export default Article;
