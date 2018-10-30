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
  queryProducts()
})

//This shows all our products in our store
function queryProducts() {
  //Select items to show them
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

//Ask user what item they would like to buy
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
      //Then show the purchase and the old stock
    ])
    .then(function(inquirerResponse) {
      connection.query(
        "SELECT * FROM products WHERE ?",
        [{ id: inquirerResponse.productID }],
        function(err, res) {
          var ProductStock = parseInt(res[0].stock_quantity)
          var ProductName = res[0].product_name
          var ProductPrice = parseInt(res[0].price)
          var UserStock = parseInt(inquirerResponse.productUnits)
          var price
          var remaining
          if (ProductStock > UserStock) {
            price = ProductPrice * UserStock
            remaining = ProductStock - UserStock
            console.log("------------------------")
            console.log(
              "Store has a total of " + ProductStock + " " + ProductName
            )
            console.log("Client just bought " + UserStock + " " + ProductName)
            updateDatabase(remaining, ProductName, price)
            console.log("------------------------")
            console.log("Total Price: $" + price)
          } else {
            console.log("Sorry, we're out")
          }
        }
      )
    })
}
function updateDatabase(remaining, ProductName, price) {
  console.log("Updating database...\n")
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: remaining,
        product_sales: price
      },
      {
        product_name: ProductName
      }
    ],
    function(err, res) {
      console.log("-----------------------")
      console.log(res.affectedRows + " products updated!\n")
      connection.query(
        "SELECT * FROM products WHERE ?",
        [{ product_name: ProductName }],
        function(err, res) {
          console.log(
            "Store has a total of " +
              res[0].stock_quantity +
              " " +
              res[0].product_name +
              " left"
          )
        }
      )
    }
  )
  Loopet()
}
function Loopet() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Would you like to buy another product?",
        choices: ["Yes", "No"],
        name: "Loop"
      }
    ])
    .then(function(inquirerResponse) {
      switch (inquirerResponse.Loop) {
        case "Yes":
          askUser()
          break
        case "No":
          // Log all results of the SELECT statement
          connection.end()
          break
        default:
          console.log("Not a valid option")
      }
    })
}
