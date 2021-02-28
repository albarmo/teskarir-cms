import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";

const Users = () => {
  const [userId, setUserId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // all members
  const { data: allMember, revalidate } = qoreContext
    .view("allMember")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { data: someUser, statusDetails, errorDetails } = qoreContext
    .view("allMember")
    .useGetRow(userId);

  // change status put
  const { updateRow, statusChange } = qoreContext
    .view("allMember")
    .useUpdateRow();

  const deleteUser = qoreContext.view("allMember").useDeleteRow();
  const updateUserStatus = qoreContext.view("allMember").useUpdateRow();

  function getUserDetails(id) {
    setModalVisible(!modalVisible);
    setUserId(id);
  }

  async function updateStatus(id, status) {
    console.log(`updating user status ${id} => ${status} to ${!status}`);
    await updateUserStatus.updateRow(id, {
      status: !status,
    });
    revalidate();
  }

  async function removeUser(id) {
    console.log(`deleting user with id ${id}`);
    await deleteUser.deleteRow(id);
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
          {modalVisible ? (
            <div className={styles.modals}>
              {someUser ? (
                <>
                  <h2>{someUser.username}</h2>
                  <div className={styles.modalsContent}>
                    <p>USER ID : {someUser.id} </p>
                    <h2>Email : {someUser.email}</h2>
                    <p>
                      Acount Status : {someUser.status ? "active" : "suspend"}
                    </p>
                    <p>Domicile : {someUser.domicile}</p>
                    <p>Birth Date : {someUser.birthDate}</p>
                  </div>
                  <div className={styles.containerButton}>
                    <button
                      onClick={() => updateStatus(someUser.id, someUser.status)}
                    >
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
            <h1>Users Management</h1>
            <img
              src="http://teskarir.com/wp-content/uploads/2020/06/imageedit_17_9008611935-150x150.png"
              alt="logo teskarir"
            ></img>
          </div>

          <div style={{ height: "800px", width: "100%", overflow: "scroll" }}>
            <table>
              <tr>
                <th>No</th>
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
                <th>Role</th>
                <th colSpan={3} style={{ textAlign: "center" }}>
                  Action
                </th>
              </tr>
              {allMember
                ? allMember.map((user, id) => {
                    return (
                      <tr key={id}>
                        <td>{id + 1}</td>
                        <td>{user.email}</td>
                        <td>{user.username ? user.username : "unset"}</td>
                        <td>{user.status ? "Actived" : "Suspended"}</td>
                        <td>{user.role ? user.role.displayField : "unset"}</td>
                        <td style={{ textAlign: "center" }}>
                          <button onClick={() => getUserDetails(user.id)}>
                            Details
                          </button>

                          <button onClick={() => removeUser(user.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </table>
          </div>
          <br />
        </div>
      </div>
    </>
  );
};

export default Users;
