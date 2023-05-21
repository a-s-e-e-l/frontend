<template>
  <div>
    <div id="preloader">
      <div class="loader"></div>
    </div>
    <!-- preloader area end -->
    <!-- login area start -->
    <div class="login-area">
      <div class="container" style="margin-bottom: 0px">
        <div class="login-box ptb--100">
          <form @submit.prevent="loginUser">
            <div class="login-form-head" style="text-align: center !important">
              <h4 class="sign">SIGN IN</h4>
              <p class="hello">Hello there, Sign in and start managing your Admin <br> Template</p>
            </div>
            <div class="login-form-body">
              <div class="form-gp">
                <!-- <label for="exampleInputEmail1">Email address</label> -->

                <label class="fromto email">Email</label> <br>
                <input class="form-control" type="email" v-model="email" id="exampleInputEmail1" placeholder="Your Email address" />
                <!-- <i class="ti-email"></i> -->
              </div>

              <label class="fromto Password">Password</label> <br>
              <div class="form-gp">
                <!-- <label for="exampleInputPassword1">Password</label> -->
                <input class="form-control" type="password" v-model="password" id="exampleInputPassword1"
                  placeholder="Enter Your Password" />
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
                  <router-link to="/register"><a>Sign up</a></router-link>
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
  name: "loginScreem",
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    loginUser() {
      const userData = {
        email: this.email,
        password: this.password
      };
      axios.post('http://localhost:5000/api/login', userData)
        .then(response => {
          console.log(response.data);
          const token = response.data.token;
          localStorage.setItem('token', token);
          window.location.href = 'http://localhost:8080'
          // Redirect to the desired page
          // this.$router.push('/success');
        })
        .catch(error => {
          if (error.response.status === 401) {
            // Handle registration conflict
            console.log('Login failed due to authentication failure');
            // Display an error message to the user indicating the conflict and how to resolve it
          } else {
            // Handle other errors
            console.log(userData)
            console.log('Login failed with error:', error);
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
  font-size: 12px;
}

.arrow-right {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.login-area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F3F8FB;
}

.sign,
.hello {
  text-align: center;
  color: black;
  font-family: 'Poppins', sans-serif;
}

.login-form-head {
  /* background-color: #8655FC; */
  padding: 20px;
}

.login-form-head h4 {
  text-transform: uppercase;
  /* font-weight: 600px; */
  margin-bottom: 7px;
  font-size: 1.5rem;
}

.hello {
  line-height: 22px;
}

form {
  background-color: white;
  border-radius: 30px;
  padding: 40px;
}

.fromto {
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.form-gp {
  margin-bottom: 17px;
}

.form-control {
  height: 40px;
  font-size: 16px;
  border-radius: 4px;
  padding: 5px;
  border: 1px solid #ced4da;
  padding-right: 200px;
  margin-top: 10px;
  font-family: 'Poppins', sans-serif;
}

.rmber-area {
  display: flex;
}

.rmber-area>div {
  flex: 1;
}

.rmber-area .col-6.text-right {
  display: flex;
  justify-content: flex-end;
}

.custom-control-label {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  margin-left: 5px;
}

.rmber-area a {
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  color: #007bff;
  font-size: 12px;
}

#form_submit {
  width: 100%;
  height: 50px;
  border: none;
  background: #4336FB;
  color: white;
  border-radius: 40px;
  text-transform: uppercase;
  letter-spacing: 0;
  font-weight: 600;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  margin: 18px 0 18px 0;
}

.arrow-right {
  border-right: solid white !important;
  border-bottom: solid white !important;
}

.login-other.row {
  display: flex;
  /* justify-content: space-between; */
}

.login-other .col-6 {
  flex: 1;
}

.facebook {
  background: #8655FC;
  text-align: center;
  display: block;
  width: 100%;
  max-width: 160px;
  height: 43px;
  line-height: 43px;
  border-radius: 40px;
  text-transform: capitalize;
  letter-spacing: 0;
  font-weight: 600;
  font-size: 12px;
  margin-left: 20px;
}

.facebook a {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
}

.google {
  background: #fb5757;
  text-align: center;
  display: block;
  width: 100%;
  max-width: 160px;
  height: 43px;
  line-height: 43px;
  border-radius: 40px;
  text-transform: capitalize;
  letter-spacing: 0;
  font-weight: 600;
  font-size: 12px;
  margin-left: 35px;
}

.google a {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
}

.text-muted {
  font-family: 'Poppins', sans-serif;
  color: #6c757d;
}

.form-footer {
  margin-top: 3rem;
  text-align: center;
}

.form-footer a {
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  color: #007bff;
}
</style>
