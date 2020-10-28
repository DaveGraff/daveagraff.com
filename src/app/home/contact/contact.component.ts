import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MaterialsModule } from '../../common/materials.module';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  subjectFormControl = new FormControl('', [
    Validators.required
  ]);

  messageFormControl = new FormControl('', [
    Validators.required
  ]);

  sendEmail(subject, email, message) {
    alert(`${subject}\n${email}\n${message}`);
  }

  constructor() { }

  ngOnInit() {
  }

}
