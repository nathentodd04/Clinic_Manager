<script setup>
import { onMounted, ref, watch } from "vue";
import {useRouter} from "vue-router";
let router = useRouter()

let accounts = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:4000/account", { method: "GET" });
  accounts.value = await res.json();
});

function login(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.username == "" || data.password == "") {
    alert("Please complete all forms.");
    return;
  }

  console.log("Accounts: ", accounts.value);
  console.log("Data: ", data)

  for (let i = 0; i < accounts.value.length; i++){
    if (
      accounts.value[i].username == data.username &&
      accounts.value[i].password == data.password &&
      accounts.value[i].type == "admin"
    ) {
      alert("Welcome, Admin!");
      localStorage.setItem("currentAccount", JSON.stringify(accounts[i]));
      router.push("/doctors");
      return;
    } else if (
      accounts.value[i].username == data.username &&
      accounts.value[i].password == data.password &&
      accounts.value[i].type == "staff"
    ) {
      alert("Welcome, Staff Member!");
      localStorage.setItem("currentAccount", JSON.stringify(accounts[i]));
      router.push("/patients");
      return;
    }
  }
  alert("Your username and/or password is incorrect.");
}
</script>

<template>
  <div class="loginForm">
    <h3>Welcome to the Clinic Manager</h3>
    <br />
    <br />
    <form @submit.prevent="login">
      Username:
      <br />
      <input type="text" name="username" />
      <br />
      <br />
      Password:
      <br />
      <input type="text" name="password" />
      <br />
      <br />
      <button class="btn btn-light" type="submit">Login</button>
    </form>
  </div>
</template>

<style>
#addDoctorButton {
  width: 25%;
}

#doctorsList {
  padding-left: 5%;
}
</style>