var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};

var app = {

  //NOTE@WHITNEY: added server string. Simplifies code and fixes fetch test
  server: 'http://parse.SFM6.hackreactor.com/chatterbox/classes/messages',
  user: window.location.search.substring(10),
  room: undefined,
  friends: [],
  roomList: [],

  init: function() {
    app.clearMessages();
    app.fetch();
    app.getRooms();
  },
  
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
        app.clearMessages();
        if (app.room) {
          app.fetch(app.room);
        } else {
          app.fetch();
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  /** 
   * Fetches messages from Chatterbox
   */
  fetch: function(roomName) {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        
        if (roomName) {
          messages = messages.filter(function(message) {
            return message.roomname === roomName;
          });
        }
        for (var i = 0; i < messages.length; i++) {
          app.renderMessage(messages[i]);
        }
      },
    });
  },
  
  /**
   * Checks for new rooms in server to populate roomlist
   */
  getRooms: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        
        app.roomList = [];
        for (var i = 0; i < messages.length; i++) {
          if (!!messages[i].roomname) {
            app.roomList.push(messages[i].roomname);            
          }
        }
        
        app.roomList = _.uniq(app.roomList);
        
        app.populateRoomList();
      },
    });
  },

  /**
   * Appends a message object to the chatroom feed
   * param: message Message to append to the chatroom feed
   */
  renderMessage: function(message) {  
    var messageDiv = $('<div/>', { // POST
      class: 'message',
    })
      .append($('<div/>', { // Post Header
        class: 'postNav',
      })
        .append($('<a/>', {
          class: 'username',
          text: message.username,
        })
          .on('click', function() {
            app.handleUsernameClick(message.username);
          }))
          
        .append($('<p/>', {
          text: message.createdAt,
        })) 
        .append($('<p/>', {
          text: message.text,
        })));

    $('#chats').append(messageDiv);
  },

  /**
   * Creates a new user-generated chat filter and adds to roomlist
   * Param: roomname
   */
  renderRoom: function(roomName) {
    //gives a form, and adds new room to roomList
    app.roomList.push(roomName);
    app.populateRoomList();
    app.enterRoom(roomName);
  },
  
  /**
   * Appends rooms list to the rooms list dropdown
   */
  populateRoomList: function() {
    $('.dropdown option').remove();
    
    for (var i = 0; i < app.roomList.length; i++) {
      $('.dropdown').append(
        $('<option/>', {
          text: app.roomList[i],
        })
      );
    }
    
    $('.dropdown')[0].selectedIndex = app.roomList.length - 1;
    
  },
  
  /**
   * Replaces current feed with room specific feed
   * Param: roomName
   */
  enterRoom: function(roomName) {
    app.room = roomName;
    app.clearMessages();
    app.fetch(roomName);
  },
  
  /**
   * Clears all messages
   */
  clearMessages: function() {
    $('#chats').empty();
  },

  handleSubmit: function(post) {
    app.send(post);
  },
  
  handleUsernameClick: function(userName) {
    if (!app.friends.includes(userName)) {
      app.friends.push(userName);
      alert(userName + ' has been added');
    }
  },


};
