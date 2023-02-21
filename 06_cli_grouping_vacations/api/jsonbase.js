const url = "https://jsonbase.com/sls-team/vacations";

const fetchUsers = async () => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

module.exports = fetchUsers;
