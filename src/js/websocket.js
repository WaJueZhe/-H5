import api from './apiConfig.js';

var stompClient = null;
var socket = new SockJS(api.socketurl); 
stompClient = Stomp.over(socket);

export default {
  stompClient
}
