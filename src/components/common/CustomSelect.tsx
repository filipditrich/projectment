import React from "react";
import { FieldInputProps } from "formik";
import { FormikProps } from "formik/dist/types";
import Select, { OptionsType } from "react-select";
import { SelectComponentsProps } from "react-select/base";
import Creatable from "react-select/creatable";
import { isPlainObject } from "lodash";

/**
 * react-select field component for usage with formik forms
 * @param options
 * @param field
 * @param form
 * @param defaultValue
 * @param creatable
 * @param isClearable
 * @constructor
 */
export const RSFInput: React.FC<any> = ({ options, field, form, defaultValue, creatable, isMulti, ...rest }: SelectFieldProps) => {
	delete rest.children;
	
	// error detector
	const error: boolean = form.getFieldMeta(field.name).touched && !!form.getFieldMeta(field.name).error;
	
	// common props
	const props = {
		options, defaultValue, name: field.name,
		loadingMessage: () => "Načítání...",
		noOptionsMessage: () => "Data nejsou k dispozici",
		placeholder: "Vyberte...",
		className: error ? "rsf-error" : "",
		value: field.value
			? creatable ?
				(isMulti && Array.isArray(field.value)) ?
					(field.value as any[]).map((value) => isPlainObject(value) ? value : { value: value, label: value })
					: isPlainObject(field.value) ? field.value : { value: field.value, label: field.value }
				: (isMulti && Array.isArray(field.value))
					? options.filter((option: any) => (field.value as any[]).findIndex((optionValue) => optionValue.value === option.value) >= 0)
					: options.find((option: any) => option.value === field.value)
			: field.value,
		onChange: (value: any) => {
			value = Array.isArray(value)
				? value.map((optionValue) => isPlainObject(optionValue) ? optionValue : { value: optionValue, label: optionValue })
				: isPlainObject(value) ? value : { value: value, label: value };
			// its 5 am, and im losing my mind here
			value = Array.isArray(value) ? value.map((val) => val.value) : value.value;
			form.setFieldValue(field.name, value, true);
		},
		onMenuClose: () => form.setFieldTouched(field.name, true, true),
		onBlur: field.onBlur,
		isMulti,
		...rest,
	};
	return (
		<>
			{ creatable ? <Creatable { ...props } /> : <Select { ...props } /> }
			{ error ? <small>{ form.getFieldMeta(field.name).error }</small> : null }
		</>
	);
};

interface SelectFieldProps<T = any> extends SelectComponentsProps{
	options: OptionsType<T>;
	field: FieldInputProps<T>;
	form: FormikProps<T>;
	defaultValue: any;
	creatable?: boolean;
}
