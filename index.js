const {
  getInactiveUsers,
  findInactiveUserDashboards,
  findInactiveUserFilters,
  returnCSV,
} = require("./helpers.js");
require("dotenv").config();

const script = async () => {
  const inactiveUserIds = await getInactiveUsers();
  if(inactiveUserIds){
    const inactiveDashboards = await findInactiveUserDashboards(inactiveUserIds);
    returnCSV(inactiveDashboards, "dashboards");
    const inactiveFilters = await findInactiveUserFilters(inactiveUserIds);
    returnCSV(inactiveFilters, "filters");
  } else console.log(`There are no inactive users in this instance.`);
};

script();