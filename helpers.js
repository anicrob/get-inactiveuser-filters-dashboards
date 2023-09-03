const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const getSelfUrls = async (userIds, type) => {
  let selfUrls = [];
  await Promise.all(
    userIds.map(async (id) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/${type}/search/?accountId=${id}`,
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
          let selfUrl = values.map((item) => item.self);
          selfUrls.push(...selfUrl);
        } else if (values.length === 1) {
          let selfUrl = values.self;
          selfUrls.push(selfUrl);
        } else {
          return;
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  return selfUrls;
};

const getDetails = async (selfUrls) => {
  const allDetails = [];
  await Promise.all(
    selfUrls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Basic ${process.env.API_KEY}`,
            Accept: "application/json",
          },
        });
        let data = await response.json();
        allDetails.push(data);
      } catch (err) {
        console.log(err);
        return;
      }
    })
  );
  return allDetails;
}
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
  const dashboardSelfUrls = await getSelfUrls(userIds, "dashboard");
  const allDashboardDetails = await getDetails(dashboardSelfUrls);
  const refinedDashboardDetails = allDashboardDetails.map(
    ({ description, id, name, owner }) => ({
      id,
      name,
      description: description ? description : " ",
      owner: owner.displayName,
    })
  );
  return refinedDashboardDetails;
};

const findInactiveUserFilters = async (userIds) => {
  const filterSelfUrls = await getSelfUrls(userIds, "filter");
  const allFilterDetails = await getDetails(filterSelfUrls);
  const refinedFilterDetails = allFilterDetails.map(
    ({ id, name, description, owner, jql, viewUrl }) => ({
      id,
      name,
      description: description ? description : " ",
      owner: owner.displayName,
      jql,
      viewUrl,
    })
  );
  return refinedFilterDetails;
};

const returnCSV = async (data, fileName) => {
  if (data.length > 0) {
    const csvRows = [];
    //get the headers (properties) from the first object in the data array
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

    // use fs.writeFile to create the .csv file
    fs.writeFile(`${fileName}.csv`, finalData, { encoding: "utf8" }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });

    console.log(`${fileName}.csv has been successfully created!`);
  } else {
    console.log(
      `there are no ${fileName} owned by inactive users in this instance`
    );
    return;
  }
};

module.exports = {
  getInactiveUsers,
  findInactiveUserDashboards,
  findInactiveUserFilters,
  returnCSV,
};
