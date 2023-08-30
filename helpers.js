const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const path = require("path");

const getInactiveUsers = async () => {
  try {
    const response = await fetch(`${process.env.URL}/rest/api/3/users/search`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${process.env.API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const allUsersData = await response.json();
    if (allUsersData.length === 0) {
      console.log(
        "there are no users in this instance or something went wrong!"
      );
      return;
    }
    const inActiveUserIds = allUsersData
      .filter(
        (user) => user.accountType === "atlassian" && user.active === false
      )
      .map((user) => user.accountId);

    if (inActiveUserIds.length === 0) {
      console.log("there are no inactive users");
      return;
    }

    return inActiveUserIds;
  } catch (err) {
    console.log(err);
  }
};

const findInactiveUserDashboards = async (userIds) => {
  let dashboardSelfUrls = [];
  await Promise.all(
    userIds.map(async (id) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/dashboard/search/?accountId=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        let { values } = await response.json();
        if (values.length > 0) {
          let selfUrl = values.map((dashboard) => dashboard.self);
          dashboardSelfUrls.push(...selfUrl);
        } else if (values.length === 1) {
          let selfUrl = values.self;
          dashboardSelfUrls.push(selfUrl);
        } else {
          console.log(`no dashboards were found for user with id ${id}`);
          return;
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  let allDashboardDetails = [];
  await Promise.all(
    dashboardSelfUrls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Basic ${process.env.API_KEY}`,
            Accept: "application/json",
          },
        });
        let data = await response.json();
        allDashboardDetails.push(data);
      } catch (err) {
        console.log(err);
        return;
      }
    })
  );
  const refinedDashboardDetails = allDashboardDetails.map(
    ({ description, id, name, owner }) => ({
      id,
      name,
      description,
      owner: owner.displayName,
    })
  );
  return refinedDashboardDetails;
};

const findInactiveUserFilters = async (userIds) => {
  let filterSelfUrls = [];
  await Promise.all(
    userIds.map(async (id) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/filter/search/?accountId=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        let { values } = await response.json();
        if (values.length > 0) {
          let selfUrl = values.map((filter) => filter.self);
          filterSelfUrls.push(...selfUrl);
        } else if (values.length === 1) {
          let selfUrl = values.self;
          filterSelfUrls.push(selfUrl);
        } else {
          console.log(`no filters were found for user with id ${id}`);
          return;
        }
      } catch (err) {
        console.log(err);
        return;
      }
    })
  );
  let allFilterDetails = [];
  await Promise.all(
    filterSelfUrls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Basic ${process.env.API_KEY}`,
            Accept: "application/json",
          },
        });
        let data = await response.json();
        allFilterDetails.push(data);
      } catch (err) {
        console.log(err);
        return;
      }
    })
  );
  const refinedFilterDetails = allFilterDetails.map(
    ({ id, name, description, owner, jql, viewUrl }) => ({
      id,
      name,
      description,
      owner: owner.displayName,
      jql,
      viewUrl,
    })
  );
  return refinedFilterDetails;
};

const returnCSV = async (data, fileName) => {
  const csvRows = [];
  //get the headers (properties) from the object in the first array
  const headers = Object.keys(data[0]);
  //add the headers to the csvRows array, joined by a comma
  csvRows.push(headers.join(","));
  // Loop to get value of each object's key
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      return `"${val}"`;
    });

    // To add, separator between each value
    csvRows.push(values.join(","));
  }

  //To add new line for each object's value
  const finalData = csvRows.join("\n");

  // use fs.write to create the .csv file
  fs.writeFile(`${fileName}.csv`, finalData, { encoding: "utf8" }, (err) => {
    if (err) console.log(err);
  });
};

module.exports = {
  getInactiveUsers,
  findInactiveUserDashboards,
  findInactiveUserFilters,
  returnCSV,
};
