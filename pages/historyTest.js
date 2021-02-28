import React, { useEffect, useState, Component } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import Swal from "sweetalert2";
import formatDate from "../helpers/formatDate";

import ReactHTMLTableToExcel from "react-html-table-to-excel";

const HistoryTest = () => {
  const [GroupId, setGroupId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [allHistoryData, updateAllHistory] = useState();
  const [freeTest, updateFreetest] = useState("");
  const [selectedTest, updateSelectedtest] = useState("all");

  const [submisionSelectedId, updateSubmisionId] = useState("");
  const [historyBySubmisionId, updateHistoryBySubmisionId] = useState("");

  // date Ranger
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // all allData
  const { data: allHistory, revalidate } = qoreContext
    .view("allHistoryTest")
    .useListRow({ limit: 50, order: "asc" }, { networkPolicy: "cache-only" });

  const { data: allFreeTest } = qoreContext
    .view("freeTestHistory")
    .useListRow({ limit: 50, order: "asc" }, { networkPolicy: "cache-only" });

  const { data: submisionDone } = qoreContext
    .view("submisionDone")
    .useListRow({ limit: 50, order: "asc" }, { networkPolicy: "cache-only" });

  useEffect(() => {
    revalidate();
  }, []);

  // console.log(allHistory[15] ? allHistory[15].submisionHistory.id : "test");
  let dataLoop = allHistory ? allHistory : "loading";

  let filteredHistoryBySubmisionId = () => {
    let arrayFiltered = [];
    console.log("ini ketriger did moiunt");
    for (let i = 0; i < dataLoop.length; i++) {
      if (dataLoop[i].submisionHistory) {
        console.log(dataLoop[i]);
        if (dataLoop[i].submisionHistory.id === submisionSelectedId)
          arrayFiltered.push(dataLoop[i]);
      }
    }
    updateHistoryBySubmisionId(arrayFiltered);
  };

  useEffect(() => {
    filteredHistoryBySubmisionId();
  }, [submisionSelectedId]);

  useEffect(() => {
    if (!allHistory) {
      updateHistory("loading");
    } else {
      updateAllHistory(allHistory);
      updateFreetest(allFreeTest);
    }
  }, [allHistory]);

  // read test
  const { data: History, statusDetails, errorDetails } = qoreContext
    .view("allHistoryTest")
    .useGetRow(GroupId);

  //   delete product
  const deleteStatementGroup = qoreContext
    .view("allHistoryTest")
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
        await deleteStatementGroup.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  useEffect(() => {
    if (dateRange.start) {
      console.log(allHistory);
      let filteredHistory = allHistory.filter(
        (val) => val.date.slice(0, 10) === dateRange.start
      );
      let freeTestFiltered = allFreeTest.filter(
        (val) => val.date.slice(0, 10) === dateRange.start
      );
      updateAllHistory(filteredHistory);
      updateFreetest(freeTestFiltered);
    }
    if (dateRange.start && dateRange.end) {
      console.log(allHistory);
      let filteredHistory = allHistory.filter(
        (val) =>
          val.date.slice(0, 10) > dateRange.start &&
          val.date.slice(0, 10) < dateRange.end
      );
      let freeTestFiltered = allFreeTest.filter(
        (val) =>
          val.date.slice(0, 10) > dateRange.start &&
          val.date.slice(0, 10) < dateRange.end
      );
      updateAllHistory(filteredHistory);
      updateFreetest(freeTestFiltered);
    }
  }, [dateRange]);

  return (
    <>
      <Head>
        <title>Admin Teskarir - SG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.users}>
        <Navbar />
        <div className={styles.right}>
          {modalVisible ? (
            <div className={styles.modals}>
              {History ? (
                <>
                  <h2>History</h2>
                  <div className={styles.modalsContent}>
                    <p style={{ width: "60%" }}>History ID : {History.id} </p>
                    {console.log(History)}
                    <p>
                      {History.userId
                        ? History.userId.displayField
                        : "loading data"}
                    </p>
                    <p>Date : {History.date}</p>
                    <p>
                      Test :
                      {History.testId
                        ? History.testId.displayField
                        : "loading data"}
                    </p>
                    <p>
                      Type :
                      {History.type
                        ? History.type.displayField
                        : "loading data"}
                    </p>
                    <p>
                      Result :
                      {History.result
                        ? History.result.displayField
                        : "loading data"}
                    </p>
                  </div>
                  <div className={styles.containerButton}>
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
                "loading"
              )}
            </div>
          ) : null}
          <div className={styles.headerSection}>
            <h1>History Test</h1>
            <img
              src="http://teskarir.com/wp-content/uploads/2020/06/imageedit_17_9008611935-150x150.png"
              alt="logo teskarir"
            ></img>
          </div>
          <div className={styles.historyFilter}>
            <div>
              {selectedTest === "all" || selectedTest === "free" ? (
                <>
                  <h4>Search By Test Date : </h4>
                  <input
                    type="date"
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </>
              ) : null}

              <select
                style={{ marginLeft: "50px" }}
                onChange={(e) => updateSelectedtest(e.target.value)}
              >
                <option value="all">All Test</option>
                <option value="submision">Test By Submision</option>
                <option value="free">Free Test</option>
              </select>
            </div>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className={styles.buttonAdd}
              table="table-to-xls"
              filename={`test-report-${date}`}
              sheet="tablexls"
              buttonText="Generate Test Report"
            />
          </div>
          {selectedTest === "free" ? (
            <table id="table-to-xls">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Test</th>
                  <th>Date</th>
                  <th>User </th>
                  <th>Type Test </th>
                  <th>Result </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>
              {freeTest
                ? freeTest.map((item, id) => {
                    return (
                      <tbody key={id}>
                        <tr key={id}>
                          <td>{id + 1}</td>
                          <td>{item.testId.displayField}</td>
                          <td>{item.date.toLocaleString()}</td>
                          <td>
                            {item.userId ? item.userId.displayField : "loading"}
                          </td>
                          <td>
                            {item.type ? item.type.displayField : "free test"}
                          </td>
                          <td>
                            {item.result ? item.result.displayField : "unset"}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <button onClick={() => getDetail(item.id)}>
                              Details
                            </button>

                            <button onClick={() => removeData(item.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })
                : null}
            </table>
          ) : null}
          {selectedTest === "submision" ? (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Contributor</th>
                  <th>Test </th>
                  <th>Date</th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>
              {submisionDone
                ? submisionDone.map((item, id) => {
                    return (
                      <tbody key={id}>
                        <tr
                          key={id}
                          style={{ cursor: "pointer" }}
                          onClick={() => updateSubmisionId(item.id)}
                        >
                          <td>{id + 1}</td>
                          <td>
                            {item.contributor
                              ? item.contributor.displayField
                              : "loading"}
                          </td>
                          <td>{item.test.displayField}</td>
                          <td>{item.date}</td>

                          <td style={{ textAlign: "center" }}>
                            <button onClick={() => removeData(item.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })
                : null}
            </table>
          ) : null}
          {selectedTest === "submision" ? (
            <>
              <table id="table-to-xls" style={{ marginTop: "auto" }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Test</th>
                    <th>Date</th>
                    <th>User </th>
                    <th>Type Test </th>
                    <th>Result </th>
                    <th colSpan={3} style={{ textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                {historyBySubmisionId
                  ? historyBySubmisionId.map((item, id) => {
                      return (
                        <tbody key={id}>
                          <tr key={id}>
                            <td>{id + 1}</td>
                            <td>{item.testId.displayField}</td>
                            <td>{item.date.toLocaleString()}</td>
                            <td>
                              {item.userId
                                ? item.userId.displayField
                                : "loading"}
                            </td>
                            <td>
                              {item.type ? item.type.displayField : "free test"}
                            </td>
                            <td>
                              {item.result ? item.result.displayField : "unset"}
                            </td>

                            <td style={{ textAlign: "center" }}>
                              <button onClick={() => getDetail(item.id)}>
                                Details
                              </button>

                              <button onClick={() => removeData(item.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })
                  : null}
              </table>
            </>
          ) : null}
          {selectedTest === "all" ? (
            <table id="table-to-xls">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Test</th>
                  <th>Date</th>
                  <th>User </th>
                  <th>Type Test </th>
                  <th>Result </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>
              {allHistoryData
                ? allHistoryData.map((item, id) => {
                    return (
                      <tbody key={id}>
                        <tr key={id}>
                          <td>{id + 1}</td>
                          <td>
                            {item.testId
                              ? item.testId.displayField
                              : "free test"}
                          </td>
                          <td>{item.date.toLocaleString()}</td>
                          <td>
                            {item.userId ? item.userId.displayField : "loading"}
                          </td>
                          <td>
                            {item.type ? item.type.displayField : "free test"}
                          </td>
                          <td>
                            {item.result
                              ? item.result.displayField
                              : "free test"}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <button onClick={() => getDetail(item.id)}>
                              Details
                            </button>

                            <button onClick={() => removeData(item.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })
                : null}
            </table>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default HistoryTest;
