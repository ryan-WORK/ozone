import * as styles from "../Widgets.scss";

import * as React from "react";

import { Button, ButtonGroup, Divider, InputGroup, Intent } from "@blueprintjs/core";
import { AdminTable } from "../../table/AdminTable";

// import { GroupCreateForm } from "./GroupCreateForm";

import { lazyInject } from "../../../../inject";

import { WidgetAPI, WidgetCreateRequest, WidgetDTO } from "../../../../api";
import { ConfirmationDialog } from "../../../confirmation-dialog/ConfirmationDialog";
// import { GroupEditTabGroup } from "../Users/GroupEditTabGroup";

interface State {
    widgets: WidgetDTO[];
    filtered: WidgetDTO[];
    filter: string;
    loading: boolean;
    pageSize: number;
    columns: any;
    showTable: boolean;
    showCreate: boolean;
    showEditGroup: boolean;
    showDelete: boolean;
    confirmationMessage: string;
    manageWidget: WidgetDTO | undefined;
    updatingWidget?: any;
}

// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style
// Popup warning dialogue for deleting
// Error handling for form

enum WidgetWidgetSubSection {
    TABLE,
    CREATE,
    EDIT
}

export class WidgetsWidget extends React.Component<{}, State> {
    @lazyInject(WidgetAPI)
    private widgetAPI: WidgetAPI;

    constructor(props: any) {
        super(props);
        this.state = {
            widgets: [],
            filtered: [],
            filter: "",
            loading: true,
            pageSize: 5,
            showTable: true,
            showCreate: false,
            showEditGroup: false,
            showDelete: false,
            confirmationMessage: "",
            manageWidget: undefined,
            columns: [
                {
                    Header: "Widgets",
                    columns: [
                        { Header: "Title", accessor: "value.namespace" },
                        { Header: "URL", accessor: "value.url" },
                        { Header: "Users", accessor: "value.totalUsers" },
                        { Header: "Groups", accessor: "value.totalGroups" }
                    ]
                },
                // TODO - Abstract this to only have to provide onclick function name with styled buttons
                {
                    Header: "Actions",
                    Cell: (row: any) => (
                        <div>
                            <ButtonGroup>
                                <Button
                                    data-element-id="widget-admin-widget-edit-button"
                                    text="Edit"
                                    intent={Intent.PRIMARY}
                                    icon="edit"
                                    small={true}
                                    onClick={() => (
                                        this.showSubSection(WidgetWidgetSubSection.EDIT),
                                        this.setState({ updatingWidget: row.original })
                                    )}
                                />
                                <Divider />
                                <Button
                                    data-element-id="widget-admin-widget-delete-button"
                                    text="Delete"
                                    intent={Intent.DANGER}
                                    icon="trash"
                                    small={true}
                                    disabled={row.original.totalStacks > 0}
                                    onClick={() => this.deleteWidget(row.original)}
                                />
                            </ButtonGroup>
                        </div>
                    )
                }
            ]
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getWidgets();
    }

    render() {
        const showTable = this.state.showTable;
        const showCreate = this.state.showCreate;
        const showEditGroup = this.state.showEditGroup;

        let data = this.state.widgets;
        const filter = this.state.filter.toLowerCase();

        // TODO - Improve this - this will be slow if there are many users.
        // Minimally could wait to hit enter before filtering. Pagination handling
        if (filter) {
            data = data.filter((row) => {
                return row.value.universalName.toLowerCase().includes(filter);
            });
        }

        return (
            <div data-element-id="widget-admin-widget-dialog">
                {showTable && (
                    <div className={styles.actionBar}>
                        <InputGroup
                            placeholder="Search..."
                            leftIcon="search"
                            value={this.state.filter}
                            onChange={(e: any) => this.setState({ filter: e.target.value })}
                            data-element-id="search-field"
                        />
                    </div>
                )}

                {showTable && (
                    <div className={styles.table}>
                        <AdminTable
                            data={data}
                            columns={this.state.columns}
                            loading={this.state.loading}
                            pageSize={this.state.pageSize}
                        />
                    </div>
                )}

                {showTable && (
                    <div className={styles.buttonBar}>
                        <Button
                            text="Create"
                            onClick={() => this.showSubSection(WidgetWidgetSubSection.CREATE)}
                            data-element-id="widget-admin-widget-create-button"
                        />
                    </div>
                )}

                {/* {showCreate &&
                <GroupCreateForm
                onSubmit={this.createGroup}
                onCancel={() => {this.showSubSection(GroupWidgetSubSection.TABLE);}}
                />
                }

                {showEditGroup &&
                <GroupEditTabGroup
                    group={this.state.updatingGroup}
                    onUpdate={this.handleUpdate}
                    onBack={() => {this.showSubSection(GroupWidgetSubSection.TABLE);}}
                />
                } */}

                <ConfirmationDialog
                    show={this.state.showDelete}
                    title="Warning"
                    content={this.state.confirmationMessage}
                    confirmHandler={this.handleConfirmationConfirmDelete}
                    cancelHandler={this.handleConfirmationCancel}
                    payload={this.state.manageWidget}
                />
            </div>
        );
    }

    private showSubSection(subSection: WidgetWidgetSubSection) {
        this.setState({
            showTable: subSection === WidgetWidgetSubSection.TABLE,
            showCreate: subSection === WidgetWidgetSubSection.CREATE,
            showEditGroup: subSection === WidgetWidgetSubSection.EDIT
        });
    }

    private getWidgets = async () => {
        const response = await this.widgetAPI.getWidgets();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            widgets: response.data.data,
            loading: false
        });
    };

    private handleUpdate(update?: any) {
        this.getWidgets();
    }

    private createWidget = async (data: WidgetCreateRequest) => {
        const response = await this.widgetAPI.createWidget(data);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.showSubSection(WidgetWidgetSubSection.TABLE);
        this.setState({ loading: true });
        this.getWidgets();

        return true;
    };

    private deleteWidget = async (widget: WidgetDTO) => {
        this.setState({
            showDelete: true,
            confirmationMessage: `This action will permenantly delete <strong>${widget.value.namespace}</strong>`,
            manageWidget: widget
        });

        this.getWidgets();

        return true;
    };

    private handleConfirmationConfirmDelete = async (payload: any) => {
        this.setState({
            showDelete: false,
            manageWidget: undefined
        });

        const widget: WidgetDTO = payload;

        const response = await this.widgetAPI.deleteWidget(widget.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getWidgets();

        return true;
    };

    private handleConfirmationCancel = (payload: any) => {
        this.setState({
            showDelete: false,
            manageWidget: undefined
        });
    };
}
