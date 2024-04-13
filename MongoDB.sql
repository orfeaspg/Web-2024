db.dropDatabase()
use Web2023
db.createCollection("users")
db.users.insertOne({
    name: "John",
    surname: "Doe",
    email: "jd@jd.com",
    password: "123",
    phone_number: 123456789,
    username: "jd",
    user_type: "admin"
})
db.users.insertOne({
    name: "Mary",
    surname: "Jane",
    email: "mj@mj.com",
    password: "321",
    phone_number: 98765431,
    username: "mj",
    user_type: "citizen"
})
db.users.insertOne({
    name: "Dave",
    surname: "Bowie",
    email: "dave@dave.com",
    password: "111",
    phone_number: 1212434399,
    username: "db",
    user_type: "rescuer",
    location: "41.015137, 28.979530"
})

db.createCollection("products")
db.products.insertOne({
    name: "Product 1",
    description: "Product 1 description",
    stock: 10,
    storage_quantity: 9
})

db.createCollection("tasks")
db.tasks.insertOne({
    rescuer_id: "657e07995af2a124aaccb133",
    citizen_id: "657e07995af2a124aaccb132",
    product_id: "657e079a5af2a124aaccb134",
    status: "pending",
    location: "41.015137, 28.979530",
    task_type: "rescue",
    quantity: 1,
})

db.createCollection("admin_announcements")
db.admin_announcements.insertOne({
    admin_id: 1,
    products:
    [
        {
            product_id: 1,
            name: "Product 1",
            description: "Product 1 description",
            quantity: 1
        },
        {
            product_id: 2,
            name: "Product 2",
            description: "Product 2 description",
            quantity: 2
        }
    ]
})

db.admin_announcements.insertOne({
    admin_id: 2,
    products:
    [
        {
            product_id: 3,
            name: "Product 3",
            description: "Product 3 description",
            quantity: 1
        },
        {
            product_id: 4,
            name: "Product 4",
            description: "Product 4 description",
            quantity: 2
        }
    ]
})
