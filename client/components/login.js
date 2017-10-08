Vue.component('login', {
    template: `
    <div>
    <div class="red center" v-if="errors.length > 0" v-for="error in errors">
        {{error}}
    </div>
    <form>
        <div class="input-group col s12 center">
            <h4>Sign in</h4>
        </div>
         
            <div class="input-group col s12">
                <label for="email">Email</label>
                <input @input="errors = []" v-model="email" id="email" placeholder="example@gmail.com">
            </div>
            <div class="input-group col s12">
                <label for="password">Password</label>
                <input @input="errors = []" v-model="password" placeholder="8-32 characters" type="password">
            </div>
            <div class="input-group col s12">
                <a @click="login" class="blue waves-effect waves-light btn" style="width: 100%">Sign in</a>
            </div>
            <div class="input-group col s12 center">
                <p class="center">No account? <a @click="changeToRegister">Create one!</a></p>
            </div>
    </form>
    </div>
    `,
    methods: {
        changeToRegister() {
            this.$emit('change',{component: 'register'});
        },
        async login() {
           let user = await axios.post('/login',{email: this.email, password: this.password});
           if(user.data.errors) {
               this.errors = user.data.errors;
               console.log(this.errors);
           } else {
               
              window.location = '/emailform';
           }
        }
    },
    data() {
        return {
            password: '',
            email: '',
            errors: []
        }
    }
});