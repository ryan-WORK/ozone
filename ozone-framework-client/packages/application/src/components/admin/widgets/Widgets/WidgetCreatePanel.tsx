import * as React from "react";
import ReactTable, { Column } from "react-table";
import { MenuItem, Tab, Tabs, Button } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import * as uuidv4 from "uuid/v4";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { array, boolean, number, object, string } from "yup";

import { CancelButton, FormError, SubmitButton } from "../../../form";

import { widgetApi } from "../../../../api/clients/WidgetAPI";
import { WidgetCreateRequest, WidgetUpdateRequest, WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTypeReference } from "../../../../api/models/WidgetTypeDTO";
import { WidgetCreateForm } from "./WidgetCreateForm";

import * as styles from "../Widgets.scss";

interface State {
    showImportWidgetFromURL: boolean,
    widget: WidgetCreateRequest | WidgetUpdateRequest
}

interface Props {
    widget: undefined | WidgetUpdateRequest,
    onSubmit: (data: WidgetCreateRequest | WidgetUpdateRequest) => Promise<boolean>,
    widgetTypes: WidgetTypeReference[]
}


export class WidgetCreatePanel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showImportWidgetFromURL: (this.props.widget === undefined),
            widget: (this.props.widget !== undefined) ? this.props.widget : this.getBlankWidget()
        };
    }

    render() {
        let toDisplay = null;
        if (this.state.showImportWidgetFromURL) {
            toDisplay = (
                <a
                    data-element-id="widget-admin-widget-show-create-form"
                    onClick={() => {
                        this.setState({ showImportWidgetFromURL: false });
                    }}
                >
                    Don't have a descriptor URL?
                </a>)
        }
        else {
            toDisplay = <WidgetCreateForm
                currentWidget={this.state.widget}
                onSubmit={this.props.onSubmit}
                widgetTypes={this.props.widgetTypes}
            />
        }

        return (
            <div>
                {toDisplay}
            </div>
        )
    }


    private getBlankWidget(): WidgetCreateRequest {
        return {
            displayName: "",
            widgetVersion: "",
            description: "",
            widgetUrl: "",
            imageUrlSmall: "",
            imageUrlMedium: "",
            width: 200,
            height: 200,
            widgetGuid: uuidv4.default(),
            universalName: "",
            visible: true,
            background: false,
            singleton: false,
            mobileReady: false,
            widgetTypes: [this.props.widgetTypes[1]], // assume more than one option. Default option of administrator breaks stuff.
            intents: {send: [], receive: []}
        }
    }
}
