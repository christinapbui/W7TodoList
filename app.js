const fs = require('fs') // fs = file system
const yargs = require("yargs") // importing yargs 
const chalk = require('chalk')


function loadData() {
    try {
        const buffer = fs.readFileSync("data.json") // read file to buffer/binary data
        const data = buffer.toString() // stringify/turn into a string
        const dataObj = JSON.parse(data) // convert JSON data into a JS object
        return dataObj
    } catch (err) {
        return []
    }
}

function saveData(data){
    // need an argument to save data
    fs.writeFileSync("data.json", JSON.stringify(data)) // "data.json" is the file name
}

function addTodo(todo, status){
    const data = loadData() 
    const newTodo = { todo: todo, status: status } //key & variable/parameter from when we called function; if they have the same name, you can skip the variable/parameter ({todo, status})
    data.push(newTodo)
    saveData(data)
}

function deleteTodo(idx){
    const data = loadData()
    data.splice(idx,1)
    saveData(data)
}

function deleteAll(){
    fs.writeFileSync("data.json", JSON.stringify([]))
}

function toggleDone(idx){
    const data = loadData()
    data[idx].status = !(data[idx].status)
    saveData(data)
}

yargs.command({ // add object
    command: "list",
    describe: "Listing all todos",
    builder: {
        status: {
            describe: "status of todos",
            default: "all",
            type: "string",
            alias: "s"
        }
    },
    handler: function(arg){ // can have "arg" inside () but if not used within function, can leave () empty
        let data = loadData()
        if(arg.status === "all"){
            data = data
            console.log(chalk.blue.bold("Listing all todos"))
        }else if(arg.status === "complete"){
            data = data.filter(el => el.status === true)
            console.log(chalk.green.bold("Listing completed todos"))
        }else if(arg.status === "incomplete"){
            data = data.filter(el => el.status === false)
            console.log(chalk.red.bold("Listing incomplete todos"))
        }
        data.forEach(({todo,status},idx) => console.log(`
        idx: ${idx}
        todo: ${todo}
        status: ${status}`)) // structured argument for forEach: element {todo,status}, index, array (there's no array in this case)
    }
})

yargs.command({
    command: "add",
    describe: "Add a new todo",
    builder: {
        todo: {
            describe: "todo content", // this is the third argument from the // above
            demandOption: true, // "is this argument required or not?"
            type: "string",
            alias: "t"
        },
        status: {
            describe: "Status of your todo",
            demandOption: false,
            type: "boolean",
            alias: "s",
            default: false
        }
    },
    handler: function({todo, status}){ // handler is always a function
        addTodo(todo, status)
        console.log(chalk.yellowBright.bold("Added your todo"))
    } 
})

yargs.command({
    command: "delete",
    describe: "Delete a todo",
    builder: {
        idx: {
            describe: "index of todo", 
            type: "number",
            alias: "d",
            demandOption: true
        }
    },
    handler: function({idx}){ // handler is always a function
        deleteTodo(idx)
        console.log(chalk.cyanBright.bold("Deleted your todo"))
    } 
})

yargs.command({
    command: "delete_all",
    describe: "Delete all todos",
    handler: function(){
        deleteAll()
        console.log(chalk.magentaBright.bold("Deleted all todos"))
    } 
})

yargs.command({
    command: "toggle_done",
    describe: "Toggle between complete/incomplete todos",
    builder: {
        idx: {
            describe: "index of todo", 
            type: "number",
            alias: "t",
            demandOption: true
        }
    },
    handler: function({idx}){
        toggleDone(idx)
        console.log(chalk.blue.bold("Toggled the todo"))
    } 
})

// yargs.command({
//     command: "list_complete",
//     describe: "List all completed todos",
//     handler: function({todo, status}){
//         console.log(chalk.green.bold("Completed todos"))
//         const data = loadData()
//         data.forEach(({todo,status},idx) => {
//         if(status === true){
//             console.log(`
//             idx: ${idx}
//             todo: ${todo}
//             status: ${status}`)}
//         })
//     }
// })




yargs.parse() // to execute the yargs.command
