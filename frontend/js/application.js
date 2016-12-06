$(".ny-username-modal").modal('show');

$('.ny-username-modal button').on('click', () => {
  let username = $('.ny-username-modal input').val();
  pickUsername(username);

  $('.ny-username-modal').modal('hide');
});

$(".ny-message-form").on('submit', function(event) {
  event.preventDefault();

  let messageContent = $(this).find('textarea').val();
  let message = {
    username: window.user.username,
    content: messageContent
  };

  sendMessage(message);
});

function sendMessage(message) {
  var messageComponent = $(`
    <div class="card card-block">
      <h6>${message.username}:</h6>
      <p>${message.content}</p>
    </div>
  `);

  $('.ny-messages-view').prepend(messageComponent);
}

function pickUsername(username) {
  window.user = {
    username: username
  };
}
