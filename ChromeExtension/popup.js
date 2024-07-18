
const signInButton = document.getElementById("sign");

    if(signInButton){
    signInButton.addEventListener("click" , () => {
         chrome.runtime.sendMessage({
            message : "login"} ,  (response) => {
                if(response.message === 'success'){
                    console.log("closing window");
                    window.close();
                }
            });    
        });
    }
