var app = {
  init: function(){
    return true;
  },

  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.HRSF90.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      // message: {
      //   username: 'shawndrost',
      //   text: 'trololo',
      //   roomname: '4chan'
      // };
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function(){
    $.get();
  },

  renderMessage: function() {},

  renderRoom: function(){},

  clearMessages: function(){
    return true;
  }

}
