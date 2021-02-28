import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";

const AllData = () => {
  // const { data: allMember, statusAuth, errorAuth } = qoreContext
  //   .view("allMember")
  //   .useListRow({ order: "asc" });

  // const { data: allProducts, status } = qoreContext
  //   .view("allProducts")
  //   .useListRow({ order: "asc" });

  // const { data: allOutputs, statusOutput, errorOutput } = qoreContext
  //   .view("allOutputs")
  //   .useListRow({ order: "asc" });

  // const { data: allTypes, statusallTypes, errorallTypes } = qoreContext
  //   .view("allTypes")
  //   .useListRow({ order: "asc" });

  // const { data: allTest, statusallTest, errorallTest } = qoreContext
  //   .view("allTypes")
  //   .useListRow({ order: "asc" });

  // const {
  //   data: allStatements,
  //   statusallStatements,
  //   errorallStatements,
  // } = qoreContext.view("allTypes").useListRow({ order: "asc" });

  // const {
  //   data: allOutputTest,
  //   statusallOutputTest,
  //   errorallOutputTest,
  // } = qoreContext.view("allOutputTest").useListRow({ order: "asc" });

  // const {
  //   data: allStatementsGroup,
  //   statusallStatementsGroup,
  //   errorallStatementsGroup,
  // } = qoreContext.view("allStatementsGroup").useListRow({ order: "asc" });

  const { data: allMember, status, fetchMore } = qoreContext
    .view("allMember")
    .useListRow({
      offset: 10,
      limit: 10,
    });

  return (
    <>
      <ul>
        {allMember.map((user) => (
          <li>{user.username}</li>
        ))}
        <button
          onClick={() => {
            // new items are being pushed to allTasks
            fetchMore({ offset: allTasks.length, limit: 10 });
          }}
        >
          Load more
        </button>
      </ul>
      {/* <h1>All Data On Development - TEST</h1>
      <p>All Members : {JSON.stringify(allMember)}</p> */}
      {/* <p>Products :{JSON.stringify(allProducts)}</p>
      <p>Outputs : {JSON.stringify(allOutputs)}</p>
      <p>All Types : {JSON.stringify(allTypes)}</p>
      <p>All Test : {JSON.stringify(allTest)}</p>
      <p>All Statements : {JSON.stringify(allStatements)}</p>
      <p>All Output Test : {JSON.stringify(allOutputTest)}</p>
      <p>All Statement Group : {JSON.stringify(allStatementsGroup)}</p> */}
    </>
  );
};

export default AllData;
