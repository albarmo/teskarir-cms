import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAddType from "../components/formAddType";
import FormEditType from "../components/formEditType";
import Swal from "sweetalert2";

const Schedule = () => {
  const [ProductId, setProductId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // get all data from submision qore project table
  const { data: allSubmission, status, error, revalidate } = qoreContext
    .view("allSubmission")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });
  // console.log(status, "<< Status get all submision");
  // console.log(error, "<< error get all submison");

  // get one data
  const { data: someSubmision, statusDetails, errorDetails } = qoreContext
    .view("allSubmission")
    .useGetRow(ProductId);

  const [data, setData] = useState(allSubmission);

  useEffect(() => {
    if (!allSubmission) {
      console.log("loading");
    } else if (allSubmission) {
      console.log(allSubmission, "all sub");
      let filterApproved = allSubmission.filter(
        (val, id) => val.status === "approved"
      );
      console.log(filterApproved, "filtereddd");
      setData(filterApproved);
    }
  }, [allSubmission]);

  console.log(data, "<<< data fitlered");
  function getDetail(id) {
    setModalVisible(!modalVisible);
    setProductId(id);
  }

  // change update status (approval / rejected)
  const updateData = qoreContext.view("allSubmission").useUpdateRow();
  async function changeStatus(value, id) {
    console.log(`updating types data ${id} => ${value} `);
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
  const deleteData = qoreContext.view("allSubmission").useDeleteRow();
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
        await deleteData.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  console.log(someSubmision);

  return (
    <>
      <Head>
        <title>Admin Teskarir - Schedule</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {/* form add */}
          {formAdd ? <FormAddType /> : null}
          {formEdit ? <FormEditType type={someSubmision} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {someSubmision ? (
                <>
                  <h2>{someSubmision.name}</h2>
                  <div className={styles.modalsContent}>
                    <p>someSubmision ID : {someSubmision.id} </p>
                    <p>
                      Contributor :{" "}
                      {someSubmision
                        ? JSON.stringify(someSubmision.testId)
                        : "loading"}
                    </p>
                    <p>Date : {someSubmision.date}</p>
                    <p>Status : {someSubmision.status}</p>
                    <p>
                      Data : {someSubmision.data ? someSubmision.data : "unset"}
                    </p>
                    <p>
                      Result :
                      {someSubmision.result ? someSubmision.result : "unset"}
                    </p>
                  </div>
                  <div className={styles.containerButton}>
                    <button onClick={() => setFormEdit(!formEdit)}>
                      Change Status
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
            <h1>Scheduled Test</h1>
            <img
              src="http://teskarir.com/wp-content/uploads/2020/06/imageedit_17_9008611935-150x150.png"
              alt="logo teskarir"
            ></img>
          </div>

          <h3 style={{ width: "100%" }}>Approved Test</h3>
          <table>
            <tr>
              <th>No</th>
              <th>Test</th>
              <th>Contributor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Data</th>
              <th>Result</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {data
              ? data.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>
                        {item.test.displayField
                          ? item.test.displayField
                          : "loading"}
                      </td>
                      <td>
                        {item.contributor
                          ? item.contributor.displayField
                          : "loading"}
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <select
                          onChange={(e) =>
                            changeStatus(e.target.value, item.id)
                          }
                          defaultValue={item.status}
                        >
                          <option value="waiting">waiting</option>
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                          <option value="done">done</option>
                        </select>
                      </td>
                      <td>{item.data ? item.data : "unset"}</td>
                      <td>{item.result ? item.result : "unset"}</td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetail(item.id)}>
                          Details
                        </button>

                        <button onClick={() => removeType(item.id)}>
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

export default Schedule;
