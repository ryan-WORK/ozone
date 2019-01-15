export namespace MainPage {

    export const LOGIN_BUTTON = "button[data-element-id='login-button']";

    export const LOGIN_DIALOG = "div[data-element-id='login-dialog']";

    export const USER_MENU_BUTTON = "button[data-element-id='user-menu-button']";

    export const WIDGETS_BUTTON = "button[data-element-id='widgets-button']";

    export const WIDGETS_DIALOG = "div[data-element-id='widgets-dialog']";

}

export namespace LoginForm {

    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const PASSWORD_FIELD = "input[data-role='field'][name='password']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const SUCCESS_CALLOUT = "div[data-element-id='form-success-callout']";


}

export namespace AdminWidget {

    export const USER_ADMIN_WIDGET_DIALOG = "div[data-element-id='user-admin-widget-dialog']";

    export const USER_ADMIN_CREATE_BUTTON = "button[data-element-id='user-admin-widget-create-button']";

    export const USER_NAME_FIELD = "input[data-role='field'][name='username']";

    export const FULL_NAME_FIELD = "input[data-role='field'][name='userRealName']";

    export const EMAIL_FIELD = "input[data-role='field'][name='email']";

    export const SUBMIT_BUTTON = "button[data-element-id='form-submit-button']";

    export const EDIT_USER_ID = "button[data-element-id='user-admin-widget-edit-newUserEmail1@email.com']";

    export const DELETE_USER_ID = "button[data-element-id='user-admin-widget-delete-newUserEmail1@email.com']";

    export const CONFIRM_DELETE_ALERT = "div.delete-user-alert";

    export const CONFIRM_DELETE_BUTTON = "div.delete-user-alert > div.bp3-alert-footer > button.bp3-intent-danger";

}

export namespace GroupAdminWidget {
    export const GROUP_ADMIN_WIDGET_DIALOG = "div[data-element-id='group-admin-widget-dialog']";

    export const GROUP_ADMIN_WIDGET_DIALOG_CREATE_BUTTON = "button[data-element-id='group-admin-widget-create-button']";

    
    export const CREATE_GROUP_DIALOG_FORM = "div[data-element-id='group-admin-widget-create-form']";

    export const CREATE_GROUP_DIALOG_SUBMIT_BUTTON = "div[data-element-id='group-admin-widget-create-submit-button'] > button";

    export const CREATE_GROUP_DIALOG_NAME_INPUT = `${CREATE_GROUP_DIALOG_FORM} input[name='name']`;

    export const CREATE_GROUP_DIALOG_DISPLAY_NAME_INPUT = `${CREATE_GROUP_DIALOG_FORM} input[name='displayName']`;

    export const CREATE_GROUP_DIALOG_DESCRIPTION_INPUT = `${CREATE_GROUP_DIALOG_FORM} input[name='description']`;

}

export namespace GlobalElements {
    export const CONFIRMATION_DIALOG = "div[data-element-id='confirmation-dialog']";

    export const CONFIRMATION_DIALOG_CONFIRM_BUTTON = `button[data-element-id='confirmation-dialog-confirm'] `;

}