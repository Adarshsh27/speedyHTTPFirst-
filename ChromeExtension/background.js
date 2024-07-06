// {let user_signed_in = false;
// const CLIENT_ID = encodeURIComponent('722881287038-veuoleb71mbgpl1jubrelk4mpnvh7bjp.apps.googleusercontent.com');
// const RESPONSE_TYPE = encodeURIComponent('id_token token');
// const REDIRECT_URI = encodeURIComponent('https://omkgamlccbnnlhlmjlmglbdlinplknkk.chromiumapp.org');
// const STATE = encodeURIComponent('jkls24a3n');
// const SCOPE = encodeURIComponent('openid https://www.googleapis.com/auth/userinfo.profile');
// const PROMPT = encodeURIComponent('consent');


// function create_auth_endpoint() {
//     let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

//     let openId_endpoint_url =
//         `https://accounts.google.com/o/oauth2/v2/auth
// ?client_id=${CLIENT_ID}
// &response_type=${RESPONSE_TYPE}
// &redirect_uri=${REDIRECT_URI}
// &scope=${SCOPE}
// &state=${STATE}
// &nonce=${nonce}
// &include_granted_scope=true
// &prompt=${PROMPT}`;

//     // console.log(openId_endpoint_url);
//     return openId_endpoint_url;
// }
// function is_user_signed_in() {
//     return user_signed_in;
// }
// function parseJWT (token) {
//     var base64Url = token.split('.')[1];
//     var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));

//     return JSON.parse(jsonPayload);
// }
// function sendMessage(userID){
//     chrome.runtime.sendMessage({
//         message : "userIn",
//         uid : userID
//     } 
// )
// };
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.message === 'login') {
//         if (user_signed_in) {
//             console.log("User is already signed in.");
//         } else {
//             chrome.identity.launchWebAuthFlow({
//                 'url': create_auth_endpoint(),
//                 'interactive': true
//             }, function (redirect_url) {
//                 if (chrome.runtime.lastError) {
//                     // problem signing in
//                 } else {
//                     let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
//                     id_token = id_token.substring(0, id_token.indexOf('&'));
//                     const user_info = parseJWT(id_token);
//                     console.log(user_info);
//                     if ((user_info.iss === 'https://accounts.google.com' || user_info.iss === 'accounts.google.com')
//                         && user_info.aud === CLIENT_ID) {
//                     console.log("User successfully signed in.");
//                     user_signed_in = true;
//                     chrome.action.setPopup({ popup: './popup-signed-in.html' }, ()=>{
//                         sendResponse({
//                             uid : user_info.sub,
//                             name : user_info.name
//                         });
//                     });
//                     // sendMessage(user_info.sub);
//                 } else {
//                     console.log("Invalid credentials.");
//                 }
//                 }
//             });

//             return true;
//         }
//     } else if (request.message === 'logout') {
//         // console.log("signing out");
//         user_signed_in = false;
//         // sendResponse('success');
//         chrome.action.setPopup({ popup: './popup.html' }, ()=>{
//             // console.log("inside the function ");
//             sendResponse('success');
//             // console.log("in background trying to close the windows");
//         });
//         // return true;
//     } else if (request.message === 'isUserSignedIn') {
//         sendResponse(is_user_signed_in());
//     }
// });
// }
