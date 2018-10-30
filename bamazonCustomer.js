var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
})

connection.connect(function(err) {
  if (err) throw err
  console.log("Connected as id: " + connection.threadId)
  queryProducts()
})
function queryProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("ID| ITEM             |PRICE")
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].id + " | " + res[i].product_name + " | " + res[i].price
      )
      console.log("---------------------------------")
    }
    askUser()
  })
}
function askUser() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "productID",
        message: "Please type the ID of the product you'd like to buy"
      },
      {
        type: "input",
        name: "productUnits",
        message: "How many units would you like to buy"
      }

      // After the prompt, store the user's response in a variable called location.
    ])
    .then(function(inquirerResponse) {
      // console.log(location.userInput);
      console.log(inquirerResponse.productID)
      console.log(inquirerResponse.productUnits)
    })
}
