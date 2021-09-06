const dateElement = document.getElementById("date");
list = document.getElementById("list")

let popup = document.getElementById("popup")


// Show todays date
const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);


function loadList(array) {
    array.forEach(function (item) {
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

var todoText = document.getElementById("input");
let database = firebase.database().ref("tasks");


function addTodo() {

    if (todoText.value == "") {
        popup.classList.add("show")
    }
    else {

        
        let TodoKey = database.push().key;
        let ObjTodo = {
            task: todoText.value,
            key: TodoKey
        }

        database.child(TodoKey).set(ObjTodo)

    }

        todoText.value = ""

}

todoText.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("add").click();
    }
});


firebase.database().ref("tasks").on("child_added",function(TodoData){

    li = document.createElement("li")
    li.setAttribute("class", "item")
    list.appendChild(li)


    para = document.createElement("p")
    li.appendChild(para)
    para.setAttribute("class", "text")
    inpText = document.createTextNode(TodoData.val().task);
    para.appendChild(inpText)


    btnDiv = document.createElement("div")
    li.appendChild(btnDiv)
    btnDiv.setAttribute("class", "btn-div")


    editBtn = document.createElement("button")
    btnDiv.appendChild(editBtn)
    editBtn.setAttribute("class", "btn")
    editBtn.setAttribute("id",TodoData.val().key)
    editBtn.setAttribute("onclick", "editItem(this)")


    editTag = document.createElement("i")
    editBtn.appendChild(editTag)
    editTag.setAttribute("class", "fa fa-edit")


    delBtn = document.createElement("button")
    btnDiv.appendChild(delBtn)
    delBtn.setAttribute("class", "btn")
    delBtn.setAttribute("id",TodoData.val().key)
    delBtn.setAttribute("onclick", "deleteItem(this)")


    delTag = document.createElement("i")
    delBtn.appendChild(delTag)
    delTag.setAttribute("class", "fa fa-trash")

})




function deleteItem(e) {
    database.child(e.id).remove()
    li = e.parentNode
    li.parentNode.remove()
}

function delAll() {
    list.innerHTML = ""
    database.remove()
}

function editItem(e) {

    task = prompt("Edit your task", e.parentNode.parentNode.firstChild.firstChild.nodeValue)
    let editTodo = {
        task: task,
        key: e.id
    }
    database.child(e.id).set(editTodo)
    e.parentNode.parentNode.firstChild.firstChild.nodeValue = task
}


function closePopup() {
    document.getElementById("popup").classList.remove("show")
}