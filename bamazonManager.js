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
  menuOptions()
})
function menuOptions() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Selection an option",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ],
        name: "menuOption"
      }
    ])
    .then(function(inquirerResponse) {
      switch (inquirerResponse.menuOption) {
        case "View Products for Sale":
          viewProducts()
          break
        case "View Low Inventory":
          viewLow()
          break
        case "Add to Inventory":
          addInventory()
          break
        case "Add New Product":
          addProduct()
          break
        default:
          console.log("Not a valid option")
      }
    })
}
function viewProducts() {
  console.log("PRODUCTS FOR SALE")
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("ID| Item             |Price  | Left in Stock")
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].id +
          " | " +
          res[i].product_name +
          " | " +
          res[i].price +
          " | " +
          res[i].stock_quantity
      )
      console.log("---------------------------------")
    }
  })
}
function viewLow() {
  console.log("ITEMS WITH LEFT THAN 5 IN STOCK")
  connection.query(
    "SELECT id,product_name, stock_quantity, price FROM products WHERE stock_quantity < 5",
    function(err, res) {
      console.log("ID| Item             |Price  | Left in Stock")

      for (var i = 0; i < res.length; i++) {
        console.log(
          res[i].id +
            " | " +
            res[i].product_name +
            " | " +
            res[i].price +
            " | " +
            res[i].stock_quantity
        )
        console.log("---------------------------------")
      }
    }
  )
}
function addInventory() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "productID",
        message: "Please type the ID of the product you'd like to add"
      },
      {
        type: "input",
        name: "productUnits",
        message: "How many units would you like to add"
      }

      // After the prompt, store the user's response in a variable called location.
    ])
    .then(function(inquirerResponse) {
      connection.query(
        "SELECT * FROM products WHERE ?",
        [{ id: inquirerResponse.productID }],
        function(err, res) {
          var ProductStock = parseInt(res[0].stock_quantity)
          var ProductName = res[0].product_name
          var UserStock = parseInt(inquirerResponse.productUnits)
          let stockUpdated = ProductStock + UserStock
          console.log("------------------------")
          console.log(
            "Store had a total of " + ProductStock + " " + ProductName + " left"
          )
          updateDatabase(stockUpdated, ProductName)
        }
      )
    })
}
function addProduct() {
  console.log("Adding new Product")
}
function updateDatabase(stockUpdated, ProductName) {
  console.log("Updating database...\n")
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: stockUpdated
      },
      {
        product_name: ProductName
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " products updated!\n")
      connection.query(
        "SELECT * FROM products WHERE ?",
        [{ product_name: ProductName }],
        function(err, res) {
          console.log(
            "Store has a total of " +
              res[0].stock_quantity +
              " " +
              res[0].product_name
          )
        }
      )
    }
  )
}
