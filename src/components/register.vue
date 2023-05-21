<template>
  <div>
    <div id="preloader">
      <div class="loader"></div>
    </div>
    <!-- preloader area end -->
    <!-- login area start -->
    <div class="login-area" style="padding-top: 20px">
      <div class="container" style="margin-bottom: 0px">
        <div class="login-box ptb--100">
          <form @submit.prevent="registerUser">
            <div class="login-form-head" style="text-align: center !important">
              <h4 class="sign" style="
                    letter-spacing: 0;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 7px;
                  ">
                Sign up
              </h4>
              <p class="hello">Hello there, Sign up and Join with Us</p>
            </div>
            <div class="login-form-body">
              <div class="form-gp">
                <!-- <label for="exampleInputName1">Full Name</label> -->
                <label class="fromto">Your Name:</label> <br>
                <input class="form-control" type="text" v-model="name" id="exampleInputName1" placeholder="Full Name"
                  required />
                <!-- <i class="ti-user"></i> -->
              </div>
              <div class="form-gp">
                <!-- <label for="exampleInputEmail1">Email address</label> -->
                <label class="fromto">Your Email:</label> <br>
                <input class="form-control" type="email" v-model="email" id="exampleInputEmail1"
                  placeholder="Email address" required />
                <!-- <i class="ti-email"></i> -->
              </div>
              <div class="form-gp">
                <!-- <label for="exampleInputPassword1">Password</label> -->
                <label class="fromto">Creat Password:</label> <br>
                <input class="form-control" v-model="password" type="password" id="exampleInputPassword1"
                  placeholder="Password" required />
                <!-- <i class="ti-lock"></i> -->
              </div>
              <div class="form-gp">
                <!-- <label for="exampleInputPassword2">Confirm Password</label> -->
                <label class="fromto">Confirm Your Password:</label> <br>
                <input class="form-control" type="password" v-model="password_confirm" id="exampleInputPassword2"
                  placeholder="Confirm Password" required />
                <!-- <i class="ti-lock"></i> -->
              </div>
              <div class="submit-btn-area">
                <button id="form_submit" type="submit">
                  Submit <i class="arrow-right"></i>
                </button>
                
              </div>
              <div class="form-footer text-center mt-5">
                <p class="text-muted">
                  Don't have an account?
                  <router-link to="/Login"><a>Sign in</a> </router-link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: "registerScreen",
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirm: ''
    };
  },
  methods: {
    registerUser() {
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirm: this.password_confirm
      };
      axios.post('http://localhost:5000/api/register', userData)
        .then(response => {
          console.log(response.data);
          const token = response.data.token;
          localStorage.setItem('token', token);
          window.location.href = 'http://localhost:8080'
          // Redirect to the desired page
          // this.$router.push('/success');
        })
        .catch(error => {
          if (error.response.status === 409) {
            // Handle registration conflict
            console.log('Registration failed due to conflict');
            // Display an error message to the user indicating the conflict and how to resolve it
          } else {
            // Handle other errors
            console.log('Registration failed with error:', error);
            // Display a generic error message to the user or handle the error accordingly
          }
        });
    }
  }
}
</script>

<style>
.form-gp input::placeholder {
  font-weight: bold;
  opacity: 0.5;
  color: rgb(89, 88, 88);
}

.arrow-right {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.f2 a {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
}
</style>