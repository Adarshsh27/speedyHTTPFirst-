// import {} from "./userAPICall.js";

function apiGetAllUserCall(){
    // alert("making the call");
    fetch('http://localhost:8080/userEntry' , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}
function apiGetUserCall(userID){
    console.log(userID);
    console.log("http://localhost:8080/userEntry/" + userID);
    fetch("http://localhost:8080/userEntry/"+userID , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => (response.json()))
    .then(data => console.log(data))
    .catch(error => console.log("error has occured" ));
}
function apiAddUserCall(message){
    console.log(message);
    console.log(JSON.stringify(message));
    fetch( 'http://localhost:8080/userEntry' ,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(message)
    })
    .then(reponse => reponse.json())
    .then(data => console.log("new user added" + data))
    .catch(error => console.error('Error:', error));
}
function apiAddURLCall(message){
    console.log("user iD " + message.uid);
    fetch(`http://localhost:8080/userEntry/${message.uid}` , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body :  message.newURL})
    .then(reponse => reponse.json())
    .then(data => console.log("new url added to " + console.log(data)))
    .catch(error => console.log("an error has occured while adding url "));
}
function apiRemoveURLCall(message){
    console.log(message);
    fetch(`http://localhost:8080/userEntry/${message.UID}` , {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
        body : message.newURL
    })
    .then(reponse => reponse.json())
    .then(data => console.log("url deleted from " + console.log(data)))
    .catch(error => console.error('Error:', error));
}


document.getElementById("sign-out").addEventListener("click" ,() =>{
    // alert("moving to background");
    const res = chrome.runtime.sendMessage({
        message : 'logout' ,
        function(response){
            // alert(response);
            // alert("signint out ");
            window.close();
            console.log("sending closing message");
                if(response === 'success'){
                    console.log("should close the window");
                }
        }
    });
    console.log("back here");
    // apiGetAllUserCall();
    // apiAddUserCall({
    //     uid : "12324395345",
    //     name : "Manvithegreat"
    // });
    // apiGetUserCall("123245");
    // apiAddURLCall({
    //     uid : 123245,
    //     newURL : 'www.twitter.com'
    // })
    // apiRemoveURLCall({
    //     uid : 123245,
    //     newURL : '"www.google.com"'
        
    // })
    // apiGetUserCall(123245);
});



document.getElementById("checkUserStatus").addEventListener('click' , ()=>{
    console.log("flow is passing");
    chrome.runtime.sendMessage({message : 'isUserSignedIn' } , function(response){
        console.log("flow has returned ");
        
        if(response === true){
            alert("User is Already Signed in.");
        }
        else{
            alert("User is not signed in!. Sign in to proceed");
        }
    });
});

