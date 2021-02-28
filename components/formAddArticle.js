import React, { useEffect, useState } from "react";
import styles from "./addArticle.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";
import RenderComponent from "./testRenderComponent";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
import "react-quill/dist/quill.snow.css";

const FormAddArticle = () => {
  const client = qoreContext.client;

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [articleId, setArticleId] = useState("");
  const [isVisible, setVisible] = useState(true);

  const [value, setValue] = useState("");

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  const { send, status } = qoreContext.view("allArticle").useForm("addArticle");

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allArticle")
    .useRelation(articleId);

  const { data: allArticle, revalidate } = qoreContext
    .view("allArticle")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { data: allOutputs } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  async function addArticle(e) {
    e.preventDefault();
    setArticleId("");
    let newData = await send({
      title: title,
      description: description,
      content: value,
      image: image,
      tags: [tags],
      date: new Date(),
    });
    if (newData) {
      await addRelation({
        tags: [tags],
      });
    }
    if (statuses) {
      setVisible(false);
      revalidate();
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Add Article</h2>

          <form>
            <div className={styles.formInput}>
              <label htmlFor="title">Article Name</label>
              <input
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="product name"
              />

              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="article description"
              />

              <label htmlFor="name">Image</label>
              <Dropzone
                styles={{ background: "white" }}
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                onSubmit={handleSubmit}
                accept="image/*,audio/*,video/*"
              />

              <label htmlFor="description">Tags</label>
              <select onChange={(e) => setTags(e.target.value)}>
                <option value="none">none</option>
                {allOutputs
                  ? allOutputs.map((val, id) => {
                      return (
                        <>
                          <option key={id} value={val.id}>
                            {val.name}
                          </option>
                        </>
                      );
                    })
                  : "loading"}
              </select>

              <label htmlFor="name">Content</label>
              <ReactQuill
                style={{
                  width: "100%",
                  minHeight: "400px",
                  height: "auto",
                  background: "white",
                }}
                theme="snow"
                value={value}
                onChange={(e) => setValue(e)}
              />
              {/* <RenderComponent value={value} /> */}
            </div>

            <button className={styles.btn} onClick={(e) => addArticle(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => setVisible(!isVisible)}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormAddArticle;
