import fetch from "node-fetch";

import { endpoints } from "./endpoints.js";

let trueValues = 0;
let falseValues = 0;

for (const endpoint of endpoints) {
  let response = null;
  let retries = 0;

  while (retries < 3 && response === null) {
    try {
      response = await fetch(endpoint);

      if (response.status !== 200) {
        response = null;
        throw new Error();
      }
      const data = await response.json();
      for (const key in data) {
        if (data[key].hasOwnProperty("isDone")) {
          data[key].isDone === true ? trueValues++ : falseValues++;
          console.log(`[Success] ${endpoint}: isDone - ${data[key].isDone}`);
        }
      }

      if (data.hasOwnProperty("isDone")) {
        data.isDone === true ? trueValues++ : falseValues++;
        console.log(`[Success] ${endpoint}: isDone - ${data.isDone}`);
      }
    } catch (error) {
      if (retries === 2) {
        console.log(`[Fail] ${endpoint}: The endpoint is unavailable`);
      }

      retries++;
    }
  }
}

console.log(`Found True values: ${trueValues}`);
console.log(`Found False values: ${falseValues}`);
