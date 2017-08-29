var socket = io();
$(document).ready(function(){
  setInterval(function(){refreshTicket()}, 10000);
});

function refreshTicket(){
  socket.emit('pingticket', 'RefreshTickets!');
}
socket.on('ticketRefresh', function(data){
  $('.canvasRequest').empty();
  data.forEach(function(req){
    $('.canvasRequest').append(
      "<tr><th>" + req.number + "</th>" +
      "<th>"+ req.state +"</th></tr>");
  });
})
