// JsonPowerDB Credentials
const token = "90934557|-31949210422052509|90959068";
const dbName = "StudentDB";
const relName = "EnrollmentData";

resetForm();

function validateAndGetFormData() {
  const rollnoVar = $("#rollno").val();
  const nameVar = $("#name").val();
  const classVar = $("#class").val();
  const address = $("#address").val();
  const birthDate = $("#BirthDate").val();
  const enrollmentDate = $("#EnrollmentDate").val();

  if (!rollnoVar || !nameVar || !classVar || !address || !birthDate || !enrollmentDate) {
    alert("All fields are required.");
    return "";
  }

  const jsonStrObj = {
    rollno: rollnoVar,
    name: nameVar,
    class: classVar,
    address: address,
    BirthDate: birthDate,
    EnrollmentDate: enrollmentDate
  };

  return JSON.stringify(jsonStrObj);
}

function saveToLocalStorage(resultObj) {
  const data = JSON.parse(resultObj.data);
  localStorage.setItem("rec_no", data.rec_no);
}

function resetForm() {
  $("#rollno").val("").prop("disabled", false);
  $("#name, #class, #address, #BirthDate, #EnrollmentDate").val("").prop("disabled", true);
  $("#savebutton, #update, #reset").prop("disabled", true);
}

function enableInput() {
  $("#name, #class, #address, #BirthDate, #EnrollmentDate, #reset").prop("disabled", false);
}

document.getElementById("rollno").addEventListener("focusout", checkRecord);

function checkRecord() {
  const rollnoVar = $("#rollno").val();
  if (!rollnoVar) {
    alert("Student Roll No is required.");
    $("#rollno").focus();
    return;
  }

  const jsonStr = JSON.stringify({ rollno: rollnoVar });
  const getReqStr = createGET_BY_KEYRequest(token, dbName, relName, jsonStr, true, true);

  jQuery.ajaxSetup({ async: false });
  const resultObj = executeCommandAtGivenBaseUrl(getReqStr, "http://api.login2explore.com:5577", "/api/irl");
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status !== 200) {
    $("#savebutton").prop("disabled", false);
    enableInput();
  } else {
    fillData(resultObj);
    $("#savebutton").prop("disabled", true);
    $("#update").prop("disabled", false);
  }
}

function fillData(resultObj) {
  const record = JSON.parse(resultObj.data).record;
  $("#rollno").val(record.rollno).prop("disabled", true);
  $("#name").val(record.name);
  $("#class").val(record.class);
  $("#address").val(record.address);
  $("#BirthDate").val(record.BirthDate);
  $("#EnrollmentDate").val(record.EnrollmentDate);

  enableInput();
  saveToLocalStorage(resultObj);
}

function Savedata() {
  const jsonStr = validateAndGetFormData();
  if (!jsonStr) return;

  const putReqStr = createPUTRequest(token, jsonStr, dbName, relName);
  jQuery.ajaxSetup({ async: false });
  const resultObj = executeCommandAtGivenBaseUrl(putReqStr, "http://api.login2explore.com:5577", "/api/iml");
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status === 200) {
    alert("Data added successfully.");
    resetForm();
  } else {
    alert("Error: " + resultObj.message);
  }
}

function Updatedata() {
  const jsonStr = validateAndGetFormData();
  if (!jsonStr) return;

  const rec_no = localStorage.getItem("rec_no");
  const updateReqStr = createUPDATERecordRequest(token, jsonStr, dbName, relName, rec_no);

  jQuery.ajaxSetup({ async: false });
  const resultObj = executeCommandAtGivenBaseUrl(updateReqStr, "http://api.login2explore.com:5577", "/api/iml");
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status === 200) {
    alert("Data updated successfully.");
    resetForm();
  } else {
    alert("Error: " + resultObj.message);
  }
}
