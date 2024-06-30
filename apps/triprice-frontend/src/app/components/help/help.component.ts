import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {
  helpForm: FormGroup;

  constructor(private fb: FormBuilder,
    private helpService: HelpService) {
    this.helpForm = this.fb.group({
      header: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.helpForm.valid) {
      this.helpService.sendHelpEmailToTriPriceAdmin(this.helpForm.controls.header.value, this.helpForm.controls.content.value);
      this.helpForm.reset();
    }
  }
}
