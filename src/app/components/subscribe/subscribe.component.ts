import { Component, OnInit } from '@angular/core';
import { MyOverlayRef } from '../../services/myoverlay-ref';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  frmSubscribe = this.fb.group({
    name: 'Mohsen',
    email: [
      'mohsen@gmail.com',
      Validators.compose([Validators.email, Validators.required])
    ]
  });

  constructor(private fb: FormBuilder, private ref: MyOverlayRef) {}

  ngOnInit() {}

  submit() {
    this.ref.close(this.frmSubscribe.value);
  }

  cancel() {
    this.ref.close(null);
  }
}
