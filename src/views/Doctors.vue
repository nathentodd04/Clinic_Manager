<script setup>
import { onMounted, ref, watch } from "vue";

let doctors = ref([]);
let id = ref(null);
let fname = ref(null);
let lname = ref(null);
let phone_number = ref(null);
let specialty = ref(null);

onMounted(async () => {
  const res = await fetch("http://localhost:4000/doctor", { method: "GET" });
  doctors.value = await res.json();
});

function addDoctor(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.fname == "" ||
      data.lname == "" ||
      data.phone_number == "" ||
      data.specialty == ""){
        alert('Please complete all forms.');
        return;
      }

  fetch("http://localhost:4000/doctor", {
    method: "POST",
    headers: {
      "content-type":"application/json"
    },
    body: JSON.stringify(data)
  })
  alert('Doctor Added!');
  location.reload();
}

async function deleteDoctor(doctor_id) {
  const res = await fetch(`http://localhost:4000/doctor/delete/${doctor_id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (res.status == 400){
    alert("There was an error deleting this doctor. Please make sure there isn't an appointment scheduled for this doctor.")
    return;
  }

  alert("Doctor deleted from the database.");
  location.reload();
}

function editDoctor(doctor) {
  id.value.value = doctor._id;
  fname.value.value = doctor.fname;
  lname.value.value = doctor.lname;
  phone_number.value.value = doctor.phone_number;
  specialty.value.value = doctor.specialty;
  let modal = new bootstrap.Modal(document.querySelector("#editDoctor"));
  modal.show();
}

function updateDoctor(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.fname == "" ||
      data.lname == "" ||
      data.phone_number == "" ||
      data.specialty == ""){
        alert('Please complete all forms.');
        return;
      }

  fetch(`http://localhost:4000/doctor/update/${data.id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Doctor Updated!");
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
            <router-link class="nav-link active" to="/doctors">Doctors</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" to="/accounts">Password Manager</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" to="/">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="row">
    <div id="inputForm" class="col-4">
      <form @submit.prevent="addDoctor">
        <div class="row">
            <h3>New Doctor</h3>
            <br>
          <div class="col-6">
            First Name:
            <br />
            <input type="text" name="fname" />
            <br />
            <br />
            Phone Number:
            <br />
            <input type="number" name="phone_number" />
            <br />
            <br />
          </div>
          <div class="col-6">
            Last Name:
            <br />
            <input type="text" name="lname" />
            <br />
            <br />
            Specialty:
            <br />
            <input type="text" name="specialty" />
          </div>
        </div>
        <button class="btn btn-primary" id="addDoctorButton" type="submit">Add Doctor</button>
      </form>
    </div>
    <div class="col-8" id="doctorsList">
        <h3>All Doctors</h3>
        <br>
        <table class="table table-striped">
            <thead>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Specialty</th>
                <th>Edit</th>
                <th>Delete</th>
            </thead>
            <tbody>
          <tr v-for="doctor in doctors" v-bind:key="doctor.doctor_id">
            <td>{{ doctor.fname }} {{ doctor.lname }}</td>
            <td>{{ doctor.phone_number }}</td>
            <td>{{ doctor.specialty }}</td>
            <td>
              <button class="btn btn-success" @click.prevent="editDoctor(doctor)">Edit</button>
            </td>
            <td>
              <button class="btn btn-danger" @click.prevent="deleteDoctor(doctor._id)">Delete</button>
            </td>
          </tr>
        </tbody>
        </table>
    </div>
  </div>

  <!--Modal-->
  <div class="modal fade" id="editDoctor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Doctor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateDoctor">
          <div class="modal-body">
            <div class="row">
          <div class="col-6">
            First Name:
            <br />
            <input type="text" name="fname" ref="fname"/>
            <br />
            <br />
            Phone Number:
            <br />
            <input type="number" name="phone_number" ref="phone_number"/>
            <br />
            <br />
          </div>
          <div class="col-6">
            Last Name:
            <br />
            <input type="text" name="lname" ref="lname"/>
            <br />
            <br />
            Specialty:
            <br>
            <input type="text" name="specialty" ref="specialty">
            <br>
            <br>
          </div>
          <input type="hidden" name="id" ref="id">
        </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Update Doctor</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
    #addDoctorButton{
        width: 25%;
    }

    #doctorsList {
      padding-left: 5%;
    }
</style>