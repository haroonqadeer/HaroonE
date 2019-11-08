import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfigAddressComponent } from './config-address/config-address.component';

@NgModule({
    declarations: [
        ConfigAddressComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        ConfigAddressComponent
    ]
})
export class SharedmodModule { }
