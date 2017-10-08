Vue.component('register', {
    template: `
    <div>
    <div class="red center" v-if="errors.length > 0" v-for="error in errors">
        {{error}}
    </div>
    <form>
        <div class="input-group col s12 center">
            <h4>Register</h4>
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
                <a @click="register" class=" blue waves-effect waves-light btn" style="width: 100%">Submit</a>
            </div>
            <div class="input-group col s12">
                <p class="center">Already have an account? <a @click="changeToLogin">Login</a></p>
            </div>
    </form>
    </div>
    `,
    methods: {
        changeToLogin() {
            this.$emit('change',{component: 'login'});
        },
        //send register info to Node
        async register() {
           let register = await axios.post('/register',{email: this.email, password: this.password});
           if(register.data.errors) {
               this.errors = register.data.errors;
           } else window.location = '/emailForm';       
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