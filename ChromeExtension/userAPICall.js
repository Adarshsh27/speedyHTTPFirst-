 function apiGetAllUserCall(){
    alert("making the call");
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
    fetch(`http://localhost:8080/userEntry/${userID}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => apiAddUserCall());
}
 function apiAddUserCall(message){
    fetch( 'http://localhost:8080/userEntry' ,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(message)
    })
    .then(reponse => reponse.json())
    .then(data => console.log("new user added" + data))
    .catch(error => console.log("unsual error occured please try again later "));
}

 function apiAddURLCall(message){
    fetch(`http://localhost:8080/userEntry/${message.userID}` , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(message.newURL)
    })
    .then(reponse => reponse.json())
    .then(data => console.log("new url added to " + console.log(data)))
    .catch(error => console.log("unsual error occured please try again later "));
}

 function apiRemoveURLCall(){
    fetch(`http://localhost:8080/userEntry/${message.userID}` , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(message.URL)
    })
    .then(reponse => reponse.json())
    .then(data => console.log("url deleted from " + console.log(data)))
    .catch(error => console.log("unsual error occured please try again later "));
}
