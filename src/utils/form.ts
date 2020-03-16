import { ReactElement } from "react";
import { ColumnProps } from "reactstrap/lib/Col";
import * as yup from "yup";
import { ObjectSchema, Ref, Schema } from "yup";
import { UseFormikProps } from "../models/formik";

/**
 * Generates initial values object for Formik
 * @param config
 */
export function genInitialValues<T>(config: IFieldConfig<T>): T {
	let obj: Partial<T> = {};
	for (const name of Object.keys(config))
		obj[name as keyof T] = config[name as keyof T].value;
	return obj as T;
}

/**
 * generates yup validation schema for Formik
 * @param config
 */
export function genValidationSchema<T>(config: IFieldConfig<T>): any {
	let obj: any = {};
	for (const name of Object.keys(config))
		obj[name as any] = config[name as keyof T].yup;
	return yup.object().shape(obj);
}

export interface IFieldConfigFieldOptions {
	disabled?: boolean;
	isDisabled?: boolean;
}

export type IFieldConfig<T> = {
	[key in keyof T]: {
		value: T[key];
		displayValue?: any;
		title: string;
		helpMessage: string;
		field?: (props: UseFormikProps<T>, options?: IFieldConfigFieldOptions) => ReactElement;
		hideLabel?: boolean;
		hideField?: boolean;
		yup: Schema<T[key | any]> | Ref;
		column?: {
			[key in "xs" | "sm" | "md" | "lg" | "xl"]?: ColumnProps
		};
	};
};
