import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule,FormBuilder } from "@angular/forms";


@NgModule({
    imports:[
        FormsModule,
        ReactiveFormsModule
    ],
    exports:[
        FormsModule,
        ReactiveFormsModule
    ]
})

export class GUIModule {}