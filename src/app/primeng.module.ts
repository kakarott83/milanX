import { NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
    imports:[
        ButtonModule, 
        CheckboxModule,
        InputTextModule,
        MenubarModule,
        SidebarModule,
        PanelMenuModule,
        ToastModule,
        CardModule,
        CalendarModule
    ],
    exports:[
        ButtonModule, 
        CheckboxModule,
        InputTextModule,
        MenubarModule,
        SidebarModule,
        PanelMenuModule,
        ToastModule,
        CardModule,
        CalendarModule
    ]
})

export class PrimeNgModule {}