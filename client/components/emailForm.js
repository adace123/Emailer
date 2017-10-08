Vue.component('emailForm', {
    template: `
    <div>
    <div class="red center" v-if="errors.length > 0" v-for="error in errors">
        {{error}}
    </div>
    <div class="green center" v-if="success">
        Email successfully sent!
    </div>
    <div class="purple center" v-if="sending">
        Sending your email...
    </div>
    <form enctype="multipart/form-data">
        <div class="input-group col s12 center">
            <h4>Send an Email</h4>
        </div>
            <div class="input-group col s12">
                <label for="to">To</label>
                <input @input="errors = []" v-model="email" id="to" type="email" placeholder="example@gmail.com">
            </div>
            <div class="input-group col s12">
                <label for="subject">Subject</label>
                <input @input="errors = []" v-model="subject" id="subject" type="text">
            </div>
            <div class="input-group col s12">
                <textarea @input="errors = []" class="materialize-textarea" v-model="body" placeholder="Message"></textarea>
            </div>

            <div class="input-group col s12" style="margin-bottom: 5%;">
                <input name="files[]" @change="onFileChange" type="file" multiple>
            </div>

            <div class="center" v-if="attachments.length > 0" style="margin-bottom: 2%;">
                <h6>Your attached files:</h6>
                <li style="color:purple;margin-bottom: 1%;text-align:center;" v-for="attachment in attachments">
                    {{attachment.name}} - {{Math.round(attachment.size/1000,2)}} KB <i @click="removeAttachment(attachment)" style="cursor: pointer;" class="material-icons">delete</i>
                </li>
            </div>
            <div class="input-group col s12">
                <a @click="sendEmail" class="blue waves-effect waves-light btn" style="width: 100%">Send</a>
            </div>
    </form>
    </div>
    `,
    data() {
        return {
            email: this.namedContact,
            subject: '',
            body: '',
            attachments: [],
            errors: [],
            fileSize: 0,
            success: false,
            sending: false
        }
    },
    props: ['namedContact'],
    methods: {
        async sendEmail() {
            this.success = false;
            this.sending = true;
            let formData = new FormData();
            
            for(let attachment of this.attachments) {
                formData.append(attachment.name, attachment);
                
            }
            formData.append('subject', this.subject);
            formData.append('fileSize',this.fileSize);
            formData.append('body', this.body);
            formData.append('email', this.email);
            let data = await axios.post('/emailForm', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            this.sending = false;

           if(data.data.errors) {
               this.errors = data.data.errors;
           } else {
               this.success = true;
           }
        },
        onFileChange(e) {
            this.attachments.push(e.target.files[0]);
            this.fileSize += e.target.files[0].size;
            document.querySelector('input[type=file]').value = null;
        },
        removeAttachment(attachment) {
            this.errors = [];
            this.attachments.splice(this.attachments.indexOf(attachment), 1);
        }
    }
});