import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormLayoutComponent } from './components/formlayout/formlayout.component';
import { PanelsComponent } from './components/panels/panels.component';
import { OverlaysComponent } from './components/overlays/overlays.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MiscComponent } from './components/misc/misc.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ChartsComponent } from './components/charts/charts.component';
import { FileComponent } from './components/file/file.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AppMainComponent } from './app.main.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { TableComponent } from './components/table/table.component';
import { ListComponent } from './components/list/list.component';
import { TreeComponent } from './components/tree/tree.component';
import { CrudComponent } from './components/crud/crud.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { FloatLabelComponent } from './components/floatlabel/floatlabel.component';
import { InvalidStateComponent } from './components/invalidstate/invalidstate.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { IconsComponent } from './components/icons/icons.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { TiendaOnlineComponent } from './pages/tienda-online/tienda-online.component';
import { RecargasComponent } from './pages/recargas/recargas.component';
import { ExtractosComponent } from './pages/extractos/extractos.component';
import { CtaAhorroComponent } from './pages/cta-ahorro/cta-ahorro.component';
import { ExtractoRecargaComponent } from './pages/extracto-recarga/extracto-recarga.component';
import { MiEntretenimientoComponent } from './pages/mi-entretenimiento/mi-entretenimiento.component';
import { RtaCuentasComponent } from './pages/mi-entretenimiento/rta-cuentas/rta-cuentas.component';
import { ConsumidoComponent } from './pages/webJV/consumido/consumido.component';
import { JVExtractoComponent } from './pages/webJV/jvextracto/jvextracto.component';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    // {path: '', component: DashboardComponent},
                    { path: '', redirectTo: 'tiendaOnline', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'uikit/formlayout', component: FormLayoutComponent },
                    { path: 'uikit/input', component: InputComponent },
                    { path: 'uikit/floatlabel', component: FloatLabelComponent },
                    { path: 'uikit/invalidstate', component: InvalidStateComponent },
                    { path: 'uikit/button', component: ButtonComponent },
                    { path: 'uikit/table', component: TableComponent },
                    { path: 'uikit/list', component: ListComponent },
                    { path: 'uikit/tree', component: TreeComponent },
                    { path: 'uikit/panel', component: PanelsComponent },
                    { path: 'uikit/overlay', component: OverlaysComponent },
                    { path: 'uikit/media', component: MediaComponent },
                    { path: 'uikit/menu', loadChildren: () => import('./components/menus/menus.module').then(m => m.MenusModule) },
                    { path: 'uikit/message', component: MessagesComponent },
                    { path: 'uikit/misc', component: MiscComponent },
                    { path: 'uikit/charts', component: ChartsComponent },
                    { path: 'uikit/file', component: FileComponent },
                    { path: 'pages/crud', component: CrudComponent },
                    { path: 'pages/timeline', component: TimelineComponent },
                    { path: 'pages/empty', component: EmptyComponent },
                    { path: 'icons', component: IconsComponent },
                    { path: 'blocks', component: BlocksComponent },
                    { path: 'documentation', component: DocumentationComponent },
                    //Pages
                    { path: 'tiendaOnline', component: TiendaOnlineComponent },
                    { path: 'recargas', component: RecargasComponent },
                    { path: 'extractos', component: ExtractosComponent },
                    { path: 'ctaAhorro', component: CtaAhorroComponent },
                    { path: 'extRecargas', component: ExtractoRecargaComponent },
                    { path: 'miEntretenimiento', component: MiEntretenimientoComponent },
                    { path: 'miEntretenimiento/rtaCuentas', component: RtaCuentasComponent },
                    { path: 'webJV/Consumido', component: ConsumidoComponent },
                    { path: 'webJV/extracto', component: JVExtractoComponent },

                ],
            },
            { path: 'pages/landing', component: LandingComponent },
            { path: 'pages/login', component: LoginComponent },
            { path: 'pages/error', component: ErrorComponent },
            { path: 'pages/notfound', component: NotfoundComponent },
            { path: 'pages/access', component: AccessComponent },
            { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
