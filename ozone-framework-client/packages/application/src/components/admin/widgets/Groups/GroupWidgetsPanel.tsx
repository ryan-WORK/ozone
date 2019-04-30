import * as React from "react";
import { Button, InputGroup } from "@blueprintjs/core";

import { GroupWidgetsEditDialog } from "./GroupWidgetEditDialog";

import { showConfirmationDialog } from "../../../confirmation-dialog/InPlaceConfirmationDialog";

import { GroupDTO } from "../../../../api/models/GroupDTO";

import { widgetApi, WidgetQueryCriteria } from "../../../../api/clients/WidgetAPI";
import { WidgetDTO } from "../../../../api/models/WidgetDTO";
import { WidgetTable } from "../Widgets/WidgetTable";

import * as styles from "../Widgets.scss";

interface GroupEditWidgetProps {
    onUpdate: (update?: any) => void;
    group: any;
}

export interface GroupEditWidgetState {
    widgets: WidgetDTO[];
    loading: boolean;
    showAdd: boolean;
}

export class GroupWidgetsPanel extends React.Component<GroupEditWidgetProps, GroupEditWidgetState> {
    defaultPageSize: number = 5;
    constructor(props: GroupEditWidgetProps) {
        super(props);
        this.state = {
            widgets: [],
            loading: true,
            showAdd: false
        };
    }

    componentDidMount() {
        this.getWidgets();
    }

    render() {
        return (
            <div data-element-id="group-admin-add-widget">
                <div className={styles.table}>
                    <WidgetTable
                        data={this.state.widgets}
                        isLoading={this.state.loading}
                        onDelete={this.confirmRemoveUser}
                        defaultPageSize={this.defaultPageSize}
                    />
                </div>

                <div className={styles.buttonBar}>
                    <Button
                        text="Add"
                        onClick={() => this.showAddWidgetsDialog()}
                        data-element-id="group-edit-add-widget-dialog-add-button"
                    />
                </div>

                <GroupWidgetsEditDialog
                    show={this.state.showAdd}
                    onSubmit={this.addWidgets}
                    onClose={this.closeAddWidgetsDialog}
                />
            </div>
        );
    }

    private showAddWidgetsDialog() {
        this.setState({
            showAdd: true
        });
    }

    private getWidgets = async () => {
        const currentGroup: GroupDTO = this.props.group;

        // console.log("current group:" + currentGroup.id)
        const criteria: WidgetQueryCriteria = {
            group_id: currentGroup.id
        };
        const response = await widgetApi.getWidgets(criteria);

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private addWidgets = async (widgets: Array<WidgetDTO>) => {
        const responses = [];
        for (const widget of widgets) {
            const response = await widgetApi.addWidgetGroups(widget.id, this.props.group.id);
            if (response.status !== 200) return;

            responses.push(response.data.data);
        }

        this.setState({
            showAdd: false
        });

        this.getWidgets();
        this.props.onUpdate(responses);

        return responses;
    };

    private closeAddWidgetsDialog = () => {
        this.setState({
            showAdd: false
        });
    };

    private confirmRemoveUser = async (widget: WidgetDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "This action will remove ",
                { text: widget.value.namespace, style: "bold" },
                " from group ",
                { text: this.props.group.name, style: "bold" },
                "."
            ],
            onConfirm: () => this.removeWidget(widget)
        });
    };

    private removeWidget = async (widget: WidgetDTO) => {
        const response = await widgetApi.removeWidgetGroups(widget.id, this.props.group.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getWidgets();
        this.props.onUpdate();

        return true;
    };
}
