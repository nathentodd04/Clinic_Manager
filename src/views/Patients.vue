<script setup>
import { onMounted, ref, watch } from "vue";

let patients = ref([]);
let id = ref(null);
let fname = ref(null);
let lname = ref(null);
let sex = ref(null);
let address = ref(null);
let zip = ref(null);
let phone_number = ref(null);
let dob = ref(null);

onMounted(async () => {
  const res = await fetch("http://localhost:4000/patient", { method: "GET" });
  patients.value = await res.json();
});

function addPatient(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

    if (data.fname == "" ||
        data.lname == "" ||
        data.sex == "" ||
        data.address == "" ||
        data.zip == "" ||
        data.phone_number == "" ||
        data.dob == ""){
      alert('Please complete all forms.');
      return;
    }

  fetch("http://localhost:4000/patient", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Patient Added!");
  location.reload();
}

async function deletePatient(patient_id) {
  const res = await fetch(`http://localhost:4000/patient/delete/${patient_id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (res.status == 400){
    alert("There was an error deleting this patient. Please make sure there isn't an appointment scheduled for this patient.")
    return;
  }

  alert("Patient deleted from the database.");
  location.reload();
}

function editPatient(patient) {
  console.log(patient)
  id.value.value = patient._id;
  fname.value.value = patient.fname;
  lname.value.value = patient.lname
  sex.value.value = patient.sex;
  address.value.value = patient.address;
  zip.value.value = patient.zip;
  phone_number.value.value = patient.phone_number;
  dob.value.value = patient.dob.split('T')[0];
  let modal = new bootstrap.Modal(document.querySelector("#editPatient"));
  modal.show();
}

function updatePatient(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.fname == "" ||
        data.lname == "" ||
        data.sex == "" ||
        data.address == "" ||
        data.zip == "" ||
        data.phone_number == "" ||
        data.dob == ""){
      alert('Please complete all forms.');
      return;
    }

  fetch(`http://localhost:4000/patient/update/${data.id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Patient Updated!");
  location.reload();
}
</script>

<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Clinic Manager</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" to="/appointments">Appointments</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" to="/patients">Patients</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" to="/">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="row">
    <div class="col-4">
      <form @submit.prevent="addPatient">
        <div class="row">
          <h3>New Patient</h3>
          <br />
          <div class="col-6">
            First Name:
            <br />
            <input type="text" name="fname" class="formInput"/>
            <br />
            <br />
            Sex:
            <br />
            <select name="sex" class="formInput">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <br />
            <br />
            Zip:
            <br>
            <input type="number" name="zip" class="formInput">
            <br>
            <br>
            Date of Birth
            <br>
            <input type="date" name="dob" class="formInput">
            <br>
            <br>
          </div>
          <div class="col-6">
            Last Name:
            <br />
            <input type="text" name="lname" class="formInput"/>
            <br />
            <br />
            Address:
            <br />
            <input type="text" name="address" class="formInput"/>
            <br />
            <br />
            Phone Number:
            <br>
            <input type="number" name="phone_number" class="formInput">
            <br>
            <br>
          </div>
        </div>
        <button class="btn btn-primary" id="addPatientButton" type="submit">
          Add Patient
        </button>
      </form>
    </div>
    <div class="col-7" id="patientList">
      <h3>All Patients</h3>
      <br />
      <table class="table table-striped">
        <thead>
          <th>Name</th>
          <th>Sex</th>
          <th>Address</th>
          <th>Zip</th>
          <th>Phone Number</th>
          <th>DOB</th>
          <th>Edit</th>
          <th>Delete</th>
        </thead>
        <tbody>
          <tr v-for="patient in patients" v-bind:key="patient._id">
            <td>{{ patient.fname }} {{ patient.lname }}</td>
            <td>{{ patient.sex }}</td>
            <td>{{ patient.address }}</td>
            <td>{{ patient.zip }}</td>
            <td>{{ patient.phone_number }}</td>
            <td>{{ patient.dob.split('T')[0] }}</td>
            <td>
              <button class="btn btn-success" @click.prevent="editPatient(patient)">Edit</button>
            </td>
            <td>
              <button class="btn btn-danger" @click.prevent="deletePatient(patient._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!--Modal-->
  <div class="modal fade" id="editPatient" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Patient</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updatePatient">
          <div class="modal-body">
            <div class="row">
          <div class="col-6">
            First Name:
            <br />
            <input type="text" name="fname" ref="fname" class="formInput"/>
            <br />
            <br />
            Sex:
            <br />
            <select name="sex" ref="sex" class="formInput">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <br />
            <br />
            Zip:
            <br>
            <input type="number" name="zip" ref="zip" class="formInput">
            <br>
            <br>
            Date of Birth
            <br>
            <input type="date" name="dob" class="formInput" ref="dob">
          </div>
          <div class="col-6">
            Last Name:
            <br />
            <input type="text" name="lname" ref="lname" class="formInput"/>
            <br />
            <br />
            Address:
            <br />
            <input type="text" name="address" ref="address" class="formInput"/>
            <br />
            <br />
            Phone Number:
            <br>
            <input type="number" name="phone_number" ref="phone_number" class="formInput">
            <br>
            <br>
          </div>
          <input type="hidden" name="id" ref="id">
        </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Update Patient</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
#addPatientButton {
  width: 25%;
}

.formInput {
  width: 100%;
  height: 10%;
}

#patientList {
  padding-left: 5%;
}
</style>