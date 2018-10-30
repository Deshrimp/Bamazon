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
  console.log("Viewing products for sale")
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
  console.log("Viewing Low Inventory")
}
function addInventory() {
  console.log("Adding to Inventory")
}
function addProduct() {
  console.log("Adding new Product")
}
