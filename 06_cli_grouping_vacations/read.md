Let's imagine we have a JSON file with a list of developers. Each has a unique id, name, as well as different vacation periods and other information. This data we need to format into a more convenient and universal form.

In the original JSON, in a situation where the user has multiple vacation periods, this information is output as a separate object for with the user name repeated.

👉You can find the original JSON <a href="https://jsonbase.com/sls-team/vacations">here</a>.

Requirements

As a result we should transform the original JSON in the following way:

- User must occur once in JSON regardless of the number of vacations taken;
- The user should have an array of vacations with relevant information, in a nice and readable way;
- In the resulting JSON there should be only the following keys: userId, userName, and vacations.

An ideal result must have the following structure:

[
{
"userId":"60b7c1f04df06a0011ef0e76",
"userName":"Laurence Knox",
"vacations":[
{
"startDate":"2021-11-19",
"endDate":"2021-11-23"
},
{
"startDate":"2021-12-09",
"endDate":"2021-12-10"
}
]
}
]
