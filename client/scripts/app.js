var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};

var app = {

  //NOTE@WHITNEY: added server string. Simplifies code and fixes fetch test
  server: 'http://parse.SFM6.hackreactor.com/chatterbox/classes/messages',
  
  init: function() {
    app.clearMessages();
    app.fetch();
  },

  //NOTE@WHITNEY: adding OICE Documentation
  
  /** 
   * Sends a message object to Chatterbox
   * param: Message to send to Chatterbox
   */
  send: function(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
        app.clearMessages();
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  /** 
   * Fetches messages from Chatterbox
   */
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        for (var i = 0; i < messages.length; i++) {
          app.renderMessage(messages[i]);
        }
      },
    });
  },

  /**
   * Appends a message object to the chatroom feed
   * param: message Message to append to the chatroom feed
   */
  renderMessage: function(message) {  
    var message = $('<div/>', { // POST
      class: 'message',
    })
      .append($('<div/>', { // Post Header
        class: 'postNav',
      })
        .append($('<a/>', {
          class: 'username',
          text: message.username,
          // class: @TODO
        }))
        .append($('<p/>', {
          text: message.createdAt,
        })) 
      .append($('<p/>', {
        text: message.text,
      })))

    $('#chats').append(message);
  },

  //**NOTE ON THIS: would love to have a new room REPLACE current feed, instead of append beneath it in the DOM
  //basically individual custom feeds
  renderRoom: function(roomName) {
    var newRoom = $('<div id="newRoom">' + roomName + '</div>');
    $('#roomSelect').append(newRoom);
  },

  /**
   * Clears all messages
   */
  clearMessages: function() {
    $('#chats').empty();
  },

  handleUsernameClick: function(userName) {
    
  }


};
