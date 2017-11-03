var html = require('choo/html')

module.exports = function (state, emit) {
  return html`
    <body>
      <section class="">
        <div class="">
          <div class="">
            <div class="">
              <form>
                <div class="field">
                  <label class="">Email</label>
                  <div class=""> 
                    <input type="text" name="email" class="" />
                    <span class="">
                      <i class=""></i>
                    </span>
                  </div>
                </div>
                <div class="">
                  <label class="">Password</label>
                  <div class=""> 
                    <input type="password" name="password" class="" />
                    <span class="">
                      <i class=""></i>
                    </span>
                  </div>
                </div>
                <button 
                  onclick=${e => emit('login', e)} 
                  class="${state.loggingIn ? 'is-loading' : ''}">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </body>`
}