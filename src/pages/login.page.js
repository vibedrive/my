var html = require('choo/html')
var Notifications = require('../components/notifications')

module.exports = function (state, emit) {
  return html`
    <body class="anim-fadein vh-100">
      ${Notifications.render()}
      <section class="bg-black flex justify-center items-center h-100" >
          <div class="" style="min-width: 480px">
            <div class="">

              <div class="w-100 tc">
                <h2 class="mv0 fw3">Vibedrive</h2>
                <h1 class="f2 fw5 mv5">Log In</h1>
              </div>

              <form class="mv4">

                <div class="">
                  <label class="f5 fw6 moon-gray">Email</label>
                  <div class=""> 

                    <input 
                      type="text" 
                      name="email" 
                      class="w-100 mt3 mb4 br1 ph3 pv3 f4" 
                      placeholder="Email" 
                      value=${state.auth.email}
                      oninput=${e => emit('auth:input-email', e.target.value)}/>
                    <span class="">
                      <i class=""></i>
                    </span>

                  </div>
                </div>

                <div class="">
                  <label class="f5 fw6 moon-gray">Password</label>
                  <div class=""> 

                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Password" 
                      class="w-100 mt3 mb4 br1 ph3 pv3 f4"
                      value=${state.auth.password}
                      oninput=${e => emit('auth:input-password', e.target.value)}/> 
                    <span class="">
                      <i class=""></i>
                    </span>

                  </div>
                </div>

                <button 
                  onclick=${e => emit('login', e)} 
                  class="w-100 mv4 bg-white f4 br1 black-70 ph4 pv3 dim ${state.loggingIn ? 'is-loading' : ''}">
                  Log In
                </button>

              </form>

              <p class="mv0">
                Need a Vibedrive account? <a class="teal" href="https://vibedrive.co/signup">Create an account</a>
              </p>

            </div>
          </div>

      </section>
    </body>`
}