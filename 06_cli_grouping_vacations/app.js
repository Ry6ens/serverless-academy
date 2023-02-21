const fs = require("fs");

const { getUsers } = require("./api");

async function groupingVacations() {
  const data = await getUsers();

  const result = [];

  data.forEach(({ user, startDate, endDate }) => {
    const findIndexUser = result.findIndex((el) => el.userId === user._id);

    if (findIndexUser >= 0) {
      result[findIndexUser].vacations.push({
        startDate: startDate,
        endDate: endDate,
      });

      return;
    }

    result.push({
      userId: user._id,
      userName: user.name,
      vacations: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
    });
  });

  fs.writeFile(
    "./result.txt",
    JSON.stringify(result),
    {
      encoding: "utf8",
      flag: "w",
      mode: 0o666,
    },
    (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
        const file = fs.readFileSync("./result.txt", "utf8");
        console.log(JSON.parse(file));
      }
    }
  );

  return result;
}

(async () => {
  await groupingVacations();
})();
