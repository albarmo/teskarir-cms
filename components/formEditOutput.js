import React, { useEffect, useState } from "react";
import styles from "./ProductAdd.module.css";
import { useRouter } from "next/router";
import qoreContext from "../qoreContext";

const FormEditOutput = (props) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setVisible] = useState(true);
  const [idRelationType, setIdRelationType] = useState(
    "df178bb4-0589-432b-bca4-e3902089b1f6"
  );

  const [outputId, setOutputId] = useState("");

  useEffect(() => {
    setVisible(true);
  }, []);

  const { data: allTypes, statusallTypes, errorallTypes } = qoreContext
    .view("allTypes")
    .useListRow({ order: "asc" });
  const { user } = qoreContext.useCurrentUser();

  async function typeTestHandler(id) {
    console.log(id, "id");
    setIdRelationType(id);
  }

  const { data: allOutputs, revalidate } = qoreContext
    .view("allOutputs")
    .useListRow({ order: "asc" }, { networkPolicy: "cache-only" });

  const { addRelation, removeRelation, statuses, errors } = qoreContext
    .view("allOutputs")
    .useRelation(props.output.id);
  console.log(statuses, "<<< remove relation");

  const { updateRow, status } = qoreContext.view("allOutputs").useUpdateRow();

  let tagsRelation = props.article.tags;

  async function editOutput(e) {
    e.preventDefault();
    await removeRelation({
      tags: tagsRelation.map((item) => item.id),
    });
    try {
      let newOutput = await updateRow(props.output.id, {
        name: name,
        description: description,
        typeTestId: [idRelationType],
      });

      let removeTags = await removeRelation({
        tags: [props.article.tags.nodes[0].id],
      });
      let addNewRelation = addRelation({
        typeTestId: [idRelationType],
      });
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
          <h2>Edit Output</h2>
          <form>
            <div className={styles.formInput}>
              <label htmlFor="name">Output Name</label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                defaultValue={props.output.name}
              />
              <label htmlFor="description">Description</label>
              <textarea
                type="textarea"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={props.output.description}
              />
              <label htmlFor="description">Type Test</label>
              <select onChange={(e) => typeTestHandler(e.target.value)}>
                {allTypes
                  ? allTypes.map((option, index) => {
                      return (
                        <>
                          <option key={index} value={option.id}>
                            {option.name}
                          </option>
                        </>
                      );
                    })
                  : null}
              </select>
            </div>

            <br></br>
            <button className={styles.btn} onClick={(e) => editOutput(e)}>
              Submit
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => router.push("/outputs")}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default FormEditOutput;
