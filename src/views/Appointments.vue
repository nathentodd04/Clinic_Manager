<script setup>
import { onMounted, ref, watch } from "vue";

let appointments = ref([]);
let doctors = ref([]);
let patients = ref([]);
let id = ref(null);
let status = ref(null);
let place = ref(null);
let doctor = ref(null);
let patient = ref(null);
let date = ref(null);
let time = ref(null);

onMounted(async () => {
  const appointmentList = await fetch("http://localhost:4000/appointment", { method: "GET" });
  appointments.value = await appointmentList.json();
  const doctorList = await fetch("http://localhost:4000/doctor", { method: "GET" });
  doctors.value = await doctorList.json();
  const patientList = await fetch("http://localhost:4000/patient", { method: "GET" });
  patients.value = await patientList.json();
});

function addAppointment(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.place == "" ||
      data.date == ""){
        alert('Please complete all forms.');
        return;
      }

      console.log("Data: ", data)
      console.log("Appointments: ", appointments.value)

  for (let i = 0; i < appointments.value.length; i++) {
    if (data.date == appointments.value[i].date.split('T')[0] &&
        data.time == appointments.value[i].time){
          alert("This date and time is already reserved for another appointment. Please reschedule.")
          return
        }
  }

  fetch("http://localhost:4000/appointment", {
    method: "POST",
    headers: {
      "content-type":"application/json"
    },
    body: JSON.stringify(data)
  })
  alert('Appointment Added!');
  location.reload();
}

async function deleteAppointment(appointment_id) {
  const res = await fetch(`http://localhost:4000/appointment/delete/${appointment_id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    }
  });

  alert("Appointment deleted from the database.");
  location.reload();
}

function editAppointment(appointment) {
  console.log(appointment._id);
  id.value.value = appointment._id;
  status.value.value = appointment.status;
  place.value.value = appointment.place;
  date.value.value = appointment.date.split('T')[0];
  time.value.value = appointment.time;
  doctor.value.value = appointment.doctor;
  patient.value.value = appointment.patient;
  let modal = new bootstrap.Modal(document.querySelector("#editAppointment"));
  modal.show();
}

function updateAppointment(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.place == "" ||
      data.date == ""){
        alert('Please complete all forms.');
        return;
      }

  fetch(`http://localhost:4000/appointment/update/${data.id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Appointment Updated!");
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
    <div id="inputForm" class="col-4">
      <form @submit.prevent="addAppointment">
        <div class="row">
            <h3>New Appointment</h3>
            <br>
          <div class="col-6">
            Status:
            <br />
            <select name="status" class="formInput">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Delayed">Delayed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <br />
            <br />
            Doctor:
            <br />
            <select name="doctor" class="formInput">
              <option v-for="doctor in doctors" :key="doctor._id" :value="doctor.lname">Dr. {{ doctor.lname }}</option>
            </select>
            <br />
            <br />
            Date:
            <br>
            <input type="date" name="date" class="formInput">
            <br>
            <br>
          </div>
          <div class="col-6">
            Location:
            <br />
            <input type="text" name="place" class="formInput">
            <br />
            <br />
            Patient:
            <br>
            <select name="patient" class="formInput">
              <option v-for="patient in patients" :key="patient._id" :value="patient.lname">{{ patient.lname }}</option>
            </select>
            <br>
            <br>
            Time:
            <br>
            <select name="time" class="formInput">
              <option value="8 AM">8 AM</option>
              <option value="9 AM">9 AM</option>
              <option value="10 AM">10 AM</option>
              <option value="11 AM">11 AM</option>
              <option value="12 AM">12 AM</option>
              <option value="1 PM">1 PM</option>
              <option value="2 PM">2 PM</option>
              <option value="3 PM">3 PM</option>
              <option value="4 PM">4 PM</option>
              <option value="5 PM">5 PM</option>
              <option value="6 PM">6 PM</option>
              <option value="7 PM">7 PM</option>
              <option value="8 PM">8 PM</option>
            </select>
            <br>
            <br>
          </div>
        </div>
        <button class="btn btn-primary" id="addAppointmentButton" type="submit">Add Appointment</button>
      </form>
    </div>
    <div class="col-8" id="appointmentList">
        <h3>All Appointments</h3>
        <br>
        <table class="table table-striped">
            <thead>
                <th>Status</th>
                <th>Location</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Edit</th>
                <th>Delete</th>
            </thead>
            <tbody>
          <tr v-for="appointment in appointments" v-bind:key="appointment._id">
            <td>{{ appointment.status }}</td>
            <td>{{ appointment.place }}</td>
            <td>Dr. {{ appointment.doctor }}</td>
            <td>{{ appointment.patient }}</td>
            <td>{{ appointment.date.split('T')[0] }}</td>
            <td>{{ appointment.time }}</td>
            <td>
              <button class="btn btn-success" @click.prevent="editAppointment(appointment)">Edit</button>
            </td>
            <td>
              <button class="btn btn-danger" @click.prevent="deleteAppointment(appointment._id)">Delete</button>
            </td>
          </tr>
        </tbody>
        </table>
    </div>
  </div>

  <!--Modal-->
  <div class="modal fade" id="editAppointment" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Appointment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateAppointment">
          <div class="modal-body">
            <div class="row">
          <div class="col-6">
            Status:
            <br />
            <select name="status" ref="status" class="formInput">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Delayed">Delayed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <br />
            <br />
            Doctor:
            <br />
            <select name="doctor" class="formInput" ref="doctor">
              <option v-for="doctor in doctors" :key="doctor._id" :value="doctor.lname">Dr. {{ doctor.lname }}</option>
            </select>
            <br />
            <br />
            Date:
            <br>
            <input type="date" name="date" class="formInput" ref="date">
            <br>
            <br>
          </div>
          <div class="col-6">
            Location:
            <br />
            <input type="text" name="place" class="formInput" ref="place">
            <br />
            <br />
            Patient:
            <br>
            <select name="patient" class="formInput" ref="patient">
              <option v-for="patient in patients" :key="patient._id" :value="patient.lname">{{ patient.lname }}</option>
            </select>
            <br>
            <br>
            Time:
            <br>
            <select name="time" class="formInput" ref="time">
              <option value="8 AM">8 AM</option>
              <option value="9 AM">9 AM</option>
              <option value="10 AM">10 AM</option>
              <option value="11 AM">11 AM</option>
              <option value="12 AM">12 AM</option>
              <option value="1 PM">1 PM</option>
              <option value="2 PM">2 PM</option>
              <option value="3 PM">3 PM</option>
              <option value="4 PM">4 PM</option>
              <option value="5 PM">5 PM</option>
              <option value="6 PM">6 PM</option>
              <option value="7 PM">7 PM</option>
              <option value="8 PM">8 PM</option>
            </select>
            <br>
            <br>
          </div>
          <input type="hidden" name="id" ref="id">
        </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Update Appointment</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
    #addAppointmentButton{
        width: 30%;
        margin-top: 5%;
    }

    .formInput{
      width: 100%;
      height: 15%;
    }

    #appointmentList {
      padding-left: 5%;
    }
</style>