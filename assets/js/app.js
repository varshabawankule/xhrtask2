const cl= console.log;

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`



const postContainer = document.getElementById('postContainer');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const addbtn = document.getElementById('addbtn');
const updatebtn = document.getElementById('updatebtn');
const postForm= document.getElementById('postForm')

function snackBar(msg, icon){
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000


    })
}

function createPostCards(arr){

    let result= '';

   
arr.forEach(post => {

    result+= `
    <div class="col-md-4 mb-3" id=${post.id}>
        <div class="card h-100">
            <div class="card-header">
                <h3>${post.title}</h3>
            </div>
            <div class="card-body">
                <p>${post.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">

                <button onClick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                <button onClick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button>

            </div>
        </div>
    </div>
    
 
    `

    })

    postContainer.innerHTML= result;


}


function fetchPost(){
    spinner.classList.remove('d-none')
let xhr = new XMLHttpRequest()
xhr.open('GET',POST_URL, true)
xhr.send(null)
xhr.onload= function(){

    if(xhr.status >= 200 && xhr.status <= 299){
let postArr = JSON.parse(xhr.response)
    createPostCards(postArr)

    spinner.classList.add('d-none')


    }else{
    snackBar(`something went wrong`, `error`)
    spinner.classList.add('d-none')

    }

}


}
fetchPost()



function onPostSubmit(eve){
    eve.preventDefault()

    let postObj = 
    {
title : titleControl.value ,
body : bodyControl.value ,
userId : userIdControl.value ,

    }
   // cl(postObi)
    spinner.classList.remove('d-none')

   let xhr= new XMLHttpRequest();
   xhr.open('POST', POST_URL, true)
   xhr.send(JSON.stringify(postObj))

   xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let res= JSON.parse(xhr.response)

        let col= document.createElement('div');
    
        col.className= `col-md-4 mb-3`;
        col.id = res.id;
        col.innerHTML= `
         <div class="card h-100">
            <div class="card-header">
                <h3>${postObj.title}</h3>
            </div>
            <div class="card-body">
                <p>${postObj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">

                <button onClick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                <button onClick="onRemove(this)" class="btn btn-sm btn-danger">Update</button>

            </div>
        </div>

        `
postContainer.prepend(col);
postForm.reset()
    spinner.classList.add('d-none')


    }else{
       snackBar(`something went wrong`, `error`)
    spinner.classList.add('d-none')

    }
   }
}

function onEdit(ele){
 //cl(ele)
 let EDIT_ID = ele.closest('.col-md-4').id;
//  cl(EDIT_ID)
  localStorage.setItem("EDIT_ID", EDIT_ID);

let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`

    spinner.classList.remove('d-none')

let xhr= new XMLHttpRequest();
xhr.open('GET', EDIT_URL)
xhr.send()
xhr.onload= function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let EDIT_OBJ= JSON.parse(xhr.response)

        titleControl.value = EDIT_OBJ.title,
        bodyControl.value = EDIT_OBJ.body,
        userIdControl.value = EDIT_OBJ.userId


        addbtn.classList.add('d-none')
        updatebtn.classList.remove('d-none')
    spinner.classList.add('d-none')

    }else{

    spinner.classList.add('d-none')

    }
}

}

function onUpdatePost(){
    let UPDATE_ID = localStorage.getItem('EDIT_ID');
  localStorage.removeItem("EDIT_ID");
     
  let UPDATED_OBJ={
    title : titleControl.value,
    body : bodyControl.value,
    userId : userIdControl.value

  }

  let UPDATED_URL= `${BASE_URL}/posts/${UPDATE_ID}`

    spinner.classList.remove('d-none')

let xhr= new XMLHttpRequest()
xhr.open('PATCH', UPDATED_URL)
xhr.send(JSON.stringify(UPDATED_OBJ))
xhr.onload= function(){
    if(xhr.status >= 200 &&  xhr.status <=299){

        let res= JSON.parse(xhr.response)

    
        let col= document.getElementById(UPDATE_ID)
      let h3 = col.querySelector(".card-header h3");
        let p = col.querySelector(".card-body p")

        h3.innerText = UPDATED_OBJ.title;
        p.innerText= UPDATED_OBJ.body
        postForm.reset()
        snackBar(`Post with id ${UPDATE_ID} updated successfully`, `success`)
    spinner.classList.add('d-none')

        addbtn.classList.remove('d-none')
        updatebtn.classList.add('d-none')


    }else{
        snackBar(`something went wrong`, `error`)
    spinner.classList.add('d-none')


    }
}
    
}

function onRemove(ele){

Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let REMOVE_ID= ele.closest('.col-md-4').id
    let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`


    spinner.classList.remove('d-none')

    let xhr= new XMLHttpRequest()
    xhr.open('DELETE', REMOVE_URL)
    xhr.send()
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            ele.closest('.col-md-4').remove()
        
        }
            snackBar(`the post with id ${REMOVE_ID} REMOVE successfully`, `success`)

    spinner.classList.add('d-none')

    }
  }else{
        snackBar(`something went wrong`, `error`)
    spinner.classList.add('d-none')

  }


})

}



postForm.addEventListener('submit', onPostSubmit);
updatebtn.addEventListener('click', onUpdatePost)