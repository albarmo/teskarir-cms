import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

var answerForm = [];

const FormEditArticle = (props) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [articleId, setArticleId] = useState("");
  const [isVisible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    console.log(props);
  }, []);

  const { updateRow, status } = qoreContext.view("allArticle").useUpdateRow();

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allArticle")
    .useRelation(props.article.id);

  const { data: allArticle, revalidate } = qoreContext
    .view("allArticle")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { data: allOutputs } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  function idTagsHandler(id) {
    setArticleId(id);
  }

  async function addData(e) {
    e.preventDefault();
    setArticleId("");

    e.preventDefault();
    try {
      let newOutput = await updateRow(props.article.id, {
        title: title,
        description: description,
        image: image,
        tags: [tags],
        date: new Date(),
      });
      let addNewRelation = await addRelation({
        tags: [tags],
      });
      console.log(newOutput);
      console.log(newOutput);
      if (newOutput) {
        revalidate();
        setVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {isVisible ? (
        <div className={styles.modals}>
          <h2>Edit Article</h2>

          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Article Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setTitle(e.target.value)}
                placeholder={props.article.title}
              />

              <label htmlFor="name">Description</label>
              <textarea
                type="text"
                name="name"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="product Description"
                width="100%"
                placeholder={props.article.description}
              />
              <label htmlFor="name">Image</label>
              <input
                type="file"
                name="name"
                onChange={(e) => setImage(e.target.value)}
                placeholder={props.article.image}
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
            </div>
            <br></br>
            <button className={styles.btn} onClick={(e) => addData(e)}>
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

export default FormEditArticle;
