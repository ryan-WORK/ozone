import * as styles from "./GroupCreateForm.scss";

import * as React from "react";
import { Form, Formik, FormikActions, FormikProps } from "formik";
import { object, string } from "yup";

import { GroupCreateRequest } from "../../../../api";
import { CheckBox, FormError, SubmitButton, TextField } from "../../../form";

interface GroupCreateProps {
  onSubmit: (data: GroupCreateRequest) => Promise<boolean>;
  onCancel: () => void;
}

export const GroupCreateForm: React.FunctionComponent<GroupCreateProps> =
  ({ onSubmit, onCancel }) => (
       <Formik
           initialValues={{
               name: "",
               displayName: "",
               description: "",
               active: false,
               userManagement: false
           }}
           validationSchema={CreateGroupSchema}
           onSubmit={async (values: GroupCreateRequest, actions: FormikActions<GroupCreateRequest>) => {
               const isSuccess = await onSubmit(values);
               actions.setStatus(isSuccess ? null : { error: "An unexpected error has occurred" });
               actions.setSubmitting(false);
           }}
       >
           {(formik: FormikProps<GroupCreateRequest>) => (
                <div data-element-id='group-admin-widget-create-form'>
                    <Form className={styles.form}>
                        <TextField name="name" label="Name" labelInfo="(required)"/>
                        <TextField name="displayName" label="Display Name" labelInfo="(required)"/>
                        <TextField name="description" label="Description" labelInfo="(required)"/>
                        <CheckBox name="active" label="Active" text="True"/>
                        <CheckBox name="userManagement" label="User Management" text="Automatic"/>

                        {formik.status && formik.status.error && <FormError message={formik.status.error}/>}

                        <div className={styles.buttonBar} data-element-id='group-admin-widget-create-submit-button'>
                            <SubmitButton className={styles.submitButton}/>
                        </div>
                    </Form>
                </div>
           )}
       </Formik>
   );

   const CreateGroupSchema = object().shape({
     name: string().matches(/^[a-zA-Z0-9_]+$/, { message: "Name must contain only alphanumeric or underscore characters." })
                     .required("Required"),

     displayName: string().required("Required"),

     description: string().required("Required"),

     active: string(),

     userManagement: string()
});