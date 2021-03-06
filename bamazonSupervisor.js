//Require mysql
//Require Inquirer to ask user
var mysql = require("mysql")
var inquirer = require("inquirer")

//Provide information for the connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
})

//Create connection to the database
connection.connect(function(err) {
  if (err) throw err
  console.log("Connected as id: " + connection.threadId)
  menuOptions()
})
function menuOptions() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Selection an option",
        choices: ["View Product Sales by Department", "Create New Department"],
        name: "menuOption"
      }
    ])
    .then(function(inquirerResponse) {
      switch (inquirerResponse.menuOption) {
        case "View Product Sales by Department":
          viewProductsByDep()
          break
        case "Create New Department":
          newDepart()
          break
        default:
          console.log("Not a valid option")
      }
    })
}
function viewProductsByDep() {
  console.log("Viewing products sales by dep")
  connection.query(
    "select d.*, p.product_sales from departments d left join ( select SUM(product_sales) as product_sales, department_name from products group by department_name) p ON p.department_name = d.department_name",
    function(err, res) {
      console.log(
        "| department_id | department_name | over_head_costs | product_sales | total_profit |"
      )
      console.log(
        "| ------------- | --------------- | --------------- | ------------- | ------------ |"
      )
      for (var i = 0; i < res.length; i++) {
        var totalProfit = res[i].product_sales - res[i].over_head_costs
        console.log(
          "| " +
            res[i].id +
            "             | " +
            res[i].department_name +
            "          | " +
            res[i].over_head_costs +
            "          | " +
            res[i].product_sales +
            "            | " +
            totalProfit
        )
        console.log("---------------------------------")
      }
    }
  )
}
function newDepart() {
  console.log("Creating new Dep")
  connection.query(
    "ALTER TABLE bamazon_db`.`departments` ADD COLUMN `name` VARCHAR(30) NULL DEFAULT NULL AFTER `over_head_costs`"
  )
}
