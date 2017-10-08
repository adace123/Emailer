Vue.component('contactList',{
   template: `
    <div style="text-align:center">
    <div v-if="user.contacts.length > 0">
        <h3>Your Contacts</h3>
        <div class="collection">
            <div class="collection-item" v-for="contact in user.contacts">
            <a style="cursor:pointer;" @click="sendEmailToContact(contact)">{{contact}}</a>
            <i @click="deleteContact(contact)" style="cursor:pointer" class="material-icons right">delete</i>
            </div>
        </div>
    </div>
    <div style="text-align:center" v-else>
        <h3>You don't have any contacts yet. Send an email to add a contact.</h3>
    </div>
    </div>
   `,
   props: ['user'],
   methods: {
      sendEmailToContact(contact) {
          this.$emit('sendtocontact', contact);
      },
      async deleteContact(contact) {
          if(confirm("Are you sure you want to delete this contact?")) {
              this.user.contacts.splice(this.user.contacts.indexOf(contact),1);
              let data = await axios.post('/deleteContact',{contact});
          }
      }
   },
   created() {
       this.user.contacts.sort();
   }
});