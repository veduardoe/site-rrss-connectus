import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthService } from "src/shared/services/auth.service";
import { ProfileComponent } from "./profile.component";

const routes: Routes = [
  {
    path: '', component: ProfileComponent, canActivate:[AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
