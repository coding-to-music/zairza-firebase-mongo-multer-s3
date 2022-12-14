$(".submit-btn").on("click", function () {
  $review = $(this)
    .parent()
    .parent()
    .siblings("#accept")
    .find("#text-area")
    .val();
  $approved = $(this).attr("approved");
  $weekNo = $(this).attr("weekNo");
  $regdId = $(this).attr("regdId");
  $presentDomain = $(this).attr("presentDomain");
  if ($review.length == 0) {
    showToast(401, "Please give some review!");
    return;
  }
  const data = {
    weekNo: $weekNo,
    registrationId: $regdId,
    approved: $approved,
    comment: $review,
    domainId: $presentDomain,
  };
  $.ajax({
    method: "POST",
    url: "/skills/api/mentor-submit",
    data: data,
  })
    .done(function (data) {
      showToast(200, "submitted successfully!");
      self.location.reload();
    })
    .fail(function (err) {
      showToast(400, err.responseJSON.message);
    });
});
$(".reject-btn").on("click", function () {
  $review = $(this)
    .parent()
    .parent()
    .siblings("#reject")
    .find("#text-space")
    .val();
  $approved = $(this).attr("approved");
  $weekNo = $(this).attr("weekNo");
  $regdId = $(this).attr("regdId");
  $presentDomain = $(this).attr("presentDomain");
  if ($review.length == 0) {
    showToast(401, "Please give some review!");
    return;
  }
  const data = {
    weekNo: $weekNo,
    registrationId: $regdId,
    approved: $approved,
    comment: $review,
    domainId: $presentDomain,
  };
  $.ajax({
    method: "POST",
    url: "/skills/api/mentor-submit",
    data: data,
  })
    .done(function (data) {
      showToast(200, "submitted successfully!");
      self.location.reload();
    })
    .fail(function (err) {
      showToast(400, err.responseJSON.message);
    });
});
