$(document).ready(function () {
  $(".toast__close").click(function (e) {
    e.preventDefault();
    var parent = $(this).parent(".toast");
    parent.fadeOut("slow", function () {
      $(this).toggleClass("hidden");
    });
  });
});

const errorCodes = {
  200: "OK โ Weโre cool.๐",
  201: "Created โ Iโve created what you requested.๐",
  202: "Accepted โ I acknowledged what you were saying.๐ค",
  204: "No Content โ ๐",
  301: "Moved Permanently โ We moved! Please donโt visit here next time.๐ซ",
  302: "Found โ Weโre still here, but please follow the sign till weโre backโก๏ธ",
  304: "Not Modified โ Please use cached data.๐",
  307: "Temporary Redirect ๐",
  308: "Permanent Redirect ๐",
  400: "Bad Request โ Iโm not sure what you meant.๐ฅบ",
  401: "Unauthorized โ It failed to identify yourself.๐ซ",
  403: "Forbidden โYou have no permission to do that.โ",
  404: "Not Found โ I canโt find what youโre looking for.๐โโ๏ธ",
  405: "Method Not AllowedโWe donโt support your method.๐โโ๏ธ",
  429: "Too Many Request โ Please slow down!โ",
  500: "Internal Server Error โ There are something wrong with us.๐",
  503: "Service Unavailable โ We are currently busy, can you try again sometime later?๐",
};

// Show toast based on response message

function showToast(status_code, message) {
  // $(".toast__type").text(status_code);
  if (message) {
    $(".toast__message").text(message);
  } else {
    $(".toast__message").text(errorCodes[status_code]);
  }
  if (status_code >= 200 && status_code < 300) {
    $(".toast__icon").empty().html(`<svg
    version="1.1"
    class="toast__svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    style="enable-background: new 0 0 512 512"
    xml:space="preserve"
  >
    <g>
      <g>
        <path
          d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0    c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7    C514.5,101.703,514.499,85.494,504.502,75.496z"
        ></path>
      </g>
    </g>
  </svg>`);
    $("#toast")
      .addClass("toast--green")
      .removeClass("toast--red")
      .removeClass("toast--blue")
      .removeClass("toast--violet");
  } else if (status_code >= 300 && status_code < 400) {
    $(".toast__icon").empty().html(
      `<img src="https://img.icons8.com/metro/52/ffffff/cancel.png"/>`
    );
    $("#toast")
      .removeClass("toast--green")
      .removeClass("toast--red")
      .removeClass("toast--violet")
      .addClass("toast--blue");
  } else if (status_code >= 400 && status_code < 500) {
    $(".toast__icon").empty().html(
      `<img src="/images/auth/cancel.png"/>`
    );
    $("#toast")
      .removeClass("toast--green")
      .removeClass("toast--blue")
      .removeClass("toast--violet")
      .addClass("toast--red");
  } else {
    $(".toast__icon").empty().html(
      `<img src="https://img.icons8.com/windows/32/ffffff/amazon-web-services.png"/>`
    );
    $("#toast")
      .removeClass("toast--green")
      .removeClass("toast--blue")
      .removeClass("toast--red")
      .addClass("toast--violet");
  }
  $("#toast").fadeIn("slow", () => {
    $(this).toggleClass("hidden");
  });
  setTimeout(() => {
    $("#toast").fadeOut("slow", function () {
      $(this).toggleClass("hidden");
    });
  }, 5000);
}

// showToast(400, 'lorem10asudhfuiewhfiuahdflaius')
