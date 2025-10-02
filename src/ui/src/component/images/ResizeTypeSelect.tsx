import {EnumSelect} from "zavadil-react-common";

export type ResizeTypeSelectProps = {
	value: string;
	onChange: (value?: string | null) => any;
}

export default function ResizeTypeSelect({value, onChange}: ResizeTypeSelectProps) {
	return <EnumSelect
		value={value}
		options={['original', 'crop', 'fit', 'scale']}
		onChange={onChange}
	/>

}
