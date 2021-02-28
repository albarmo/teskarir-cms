import React, { useEffect, useState } from "react";
import Head from "next/head";
import qoreContext from "../qoreContext";
import styles from "../styles/User.module.css";
import Navbar from "../components/navbar";
import FormAddProduct from "../components/formAddProduct";
import FormEditProduct from "../components/formEditProduct";
import Swal from "sweetalert2";

const Products = () => {
  const [ProductId, setProductId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formAdd, setFormAdd] = useState(false);
  const [formEdit, setFormEdit] = useState(false);

  // all members
  const {
    data: allProducts,
    revalidate,
    statusGet,
    errorGet,
  } = qoreContext
    .view("allProducts")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  useEffect(() => {
    revalidate();
  }, []);

  // read product
  const { data: Product, statusDetails, errorDetails } = qoreContext
    .view("allProducts")
    .useGetRow(ProductId);

  // change update
  const updateUserStatus = qoreContext.view("allProducts").useUpdateRow();

  //   delete product
  const deleteProduct = qoreContext.view("allProducts").useDeleteRow();
  function getDetailProduct(id) {
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

  async function removeProduct(id) {
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
        console.log(`deleting product with id ${id}`);
        await deleteProduct.deleteRow(id);
        revalidate();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
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
          {formAdd ? <FormAddProduct /> : null}
          {formEdit ? <FormEditProduct product={Product} /> : null}

          {modalVisible ? (
            <div className={styles.modals}>
              {Product ? (
                <>
                  <h2>{Product.name}</h2>
                  <div className={styles.modalsContent}>
                    <p>Product ID : {Product.id} </p>
                    <h2>Description : </h2>
                    <p>{Product.description ? Product.description : "none"}</p>
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
            <h1>Products Management</h1>
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
              <th>Majors</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
            {allProducts
              ? allProducts.map((product, id) => {
                  return (
                    <tr key={id}>
                      <td>{id + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.majors}</td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => getDetailProduct(product.id)}>
                          Details
                        </button>

                        <button onClick={() => removeProduct(product.id)}>
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

export default Products;
