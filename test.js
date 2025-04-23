$.ajax(settings).done(function (response) {
  myLoader.del();
  var result = JSON.parse(response);
  console.log(result);
  if (result && result.payload && result.payload.success) {
    if (result.payload.donInfo) {
      const D = result.payload.donInfo;
      mailReceipt(D.type, D.id, D.token, D.fName, D.email);
    } else {
      Swal.fire("Amazing", `Payment has successfully been entered!`, "success");
    }
  } else {
    alert("an error occured");
  }
  reInitManualDons();
});
