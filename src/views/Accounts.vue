<script setup>
import { onMounted, ref, watch } from "vue";

let accounts = ref([]);
let id = ref(null);
let username = ref(null);
let password = ref(null);
let type = ref(null);

onMounted(async () => {
  const res = await fetch("http://localhost:4000/account", { method: "GET" });
  accounts.value = await res.json();
});

function addAccount(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.username == "" ||
      data.password == ""){
        alert('Please complete all forms.');
        return;
      }

  fetch("http://localhost:4000/account", {
    method: "POST",
    headers: {
      "content-type":"application/json"
    },
    body: JSON.stringify(data)
  })
  alert('Account Added!');
  location.reload();
}

async function deleteAccount(account) {
    if (account.username == "admin1" &&
        account.password == "admin1"){
            alert("You cannot delete the default admin account.");
            return
        }

  const res = await fetch(`http://localhost:4000/account/delete/${account._id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    }
  });

  alert("Account deleted from the database.");
  location.reload();
}

function editAccount(account) {
  id.value.value = account._id;
  username.value.value = account.username;
  password.value.value = account.password;
  type.value.value = account.type;
  let modal = new bootstrap.Modal(document.querySelector("#editAccount"));
  modal.show();
}

function updateAccount(e) {
  let form = e.target;
  let data = Object.fromEntries(new FormData(form));

  if (data.username == "" ||
      data.password == ""){
        alert('Please complete all forms.');
        return;
      }

  fetch(`http://localhost:4000/account/update/${data.id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Account Updated!");
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
      <div class="col-4">
    <div id="inputForm">
      <form @submit.prevent="addAccount">
        <div class="row">
            <h3>New Account</h3>
            <br>
          <div>
            Username:
            <br />
            <input type="text" name="username" class="formInput"/>
            <br />
            <br />
            Password:
            <br />
            <input type="text" name="password" class="formInput"/>
            <br />
            <br />
            Type:
            <br>
            <select name="type" class="formInput">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>
            <br>
            <br>
            <br>
          </div>
        </div>
        <button class="btn btn-primary" id="addaccountButton" type="submit">Add account</button>
      </form>
    </div>
    </div>
    <div class="col-8" id="accountsList">
        <h3>All Accounts</h3>
        <br>
        <table class="table table-striped">
            <thead>
                <th>Username</th>
                <th>Password</th>
                <th>Type</th>
                <th>Edit</th>
                <th>Delete</th>
            </thead>
            <tbody>
          <tr v-for="account in accounts" v-bind:key="account.account_id">
            <td>{{ account.username }}</td>
            <td>{{ account.password }}</td>
            <td>{{ account.type }}</td>
            <td>
              <button class="btn btn-success" @click.prevent="editAccount(account)">Edit</button>
            </td>
            <td>
              <button class="btn btn-danger" @click.prevent="deleteAccount(account)">Delete</button>
            </td>
          </tr>
        </tbody>
        </table>
    </div>
  </div>

  <!--Modal-->
  <div class="modal fade" id="editAccount" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateAccount">
          <div class="modal-body">
            <div class="row">
          <div>
            Username:
            <br />
            <input type="text" name="username" ref="username" class="formInput"/>
            <br />
            <br />
            Password:
            <br />
            <input type="text" name="password" ref="password" class="formInput"/>
            <br />
            <br />
            Type:
            <br>
            <select name="type" class="formInput" ref="type">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
            </select>
            <br>
            <br>
          </div>
          <input type="hidden" name="id" ref="id">
        </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Update Account</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
    #addaccountButton{
        width: 25%;
    }

    #accountsList {
      padding-left: 5%;
    }

    .formInput {
        width: 50%;
        height: 15%;
    }
</style>