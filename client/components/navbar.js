Vue.component('navbar', {
    template: `
    <nav class="blue">
    <div class="nav-wrapper">
      <ul class="left" v-if="userEmail">
        <li><a style="cursor: auto">Signed in as {{userEmail}}</a></li>
      </ul>
      <a class="brand-logo center">Emailer App<i class="material-icons">email</i></a>
      <ul class="right">
      <li @click="switchToContacts" v-if="contactList"><a href="#">Contact List</a></li>
      <li @click="switchToEmailForm" v-if="emailForm"><a href="#">New Email</a></li>
      <li @click="signOutUser" v-if="logout"><a href="#">Logout</a></li>
    </ul>
    </div>
  </nav>
    `,
    props: ['logout','contactList','emailForm','userEmail'],
    methods: {
      switchToContacts() {
        this.$emit('emailsent');
      },
      switchToEmailForm() {
        this.$emit('createemail');
      },
      async signOutUser() {
        let data = await axios.post('/logout');
        window.location = '/';
      }
    }
})