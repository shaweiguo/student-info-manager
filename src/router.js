import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AdminIndexPage } from "./page/admin/index";
import { AdminStudentPage } from "./page/admin/student";
import { IndexPage } from "./page/index";

export class MainRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path={'/'} component={IndexPage}/>
                    <Route exact path={'/admin'} component={AdminIndexPage}/>
                    <Route exact path={'/admin/student'} component={AdminStudentPage}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
