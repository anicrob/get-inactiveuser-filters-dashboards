const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const projectKeys = ["TDSP"];
const deleteProjects = async () => {
  await Promise.all(
    projectKeys.map(async (key) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/project/${key}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const message = `An error has occured trying to delete project with key, ${key},: ${response.status} ${response.statusText}`;
          throw new Error(message);
        }
        console.log(`project with key, ${key}, has been successfully deleted`);
      } catch (err) {
        console.log(err);
      }
    })
  );
};

deleteProjects();
