import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import React from "react";
import {StringUtil} from "zavadil-ts-common";
import {Image} from "../../types/Image";
import {Img} from "./Img";
import {ImagezImagePreview} from "./ImagezImage";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export type ImageFormProps = {
	data: Image;
	onChange: (data: Image) => any;
}

export default function ImageForm({data, onChange}: ImageFormProps) {
	return (
		<Form>
			<Stack direction="vertical" gap={2}>
				<Row className="align-items-start">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Original URL:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={StringUtil.getNonEmpty(data.originalUrl)}
							onChange={(e) => {
								data.originalUrl = StringUtil.emptyToNull(e.target.value);
								onChange({...data});
							}}
						/>
						{
							StringUtil.notBlank(data.originalUrl) && <div className="mt-2">
								<Img url={data.originalUrl} alt={data.originalUrl} maxHeight={350}/>
							</div>
						}
					</Col>
				</Row>
				<Row className="align-items-start">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Name:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<div className="d-flex gap-2">
							<Form.Control
								type="text"
								value={data.name}
								onChange={(e) => {
									data.name = e.target.value;
									onChange({...data});
								}}
							/>
							<Button size="sm">Upload...</Button>
						</div>
						{
							StringUtil.notBlank(data.name) && <ImagezImagePreview name={data.name}/>
						}
					</Col>
				</Row>
				<Row className="align-items-start">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Description:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							as="textarea"
							rows={5}
							value={StringUtil.getNonEmpty(data.description)}
							onChange={(e) => {
								data.description = e.target.value;
								onChange({...data});
							}}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Source:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={StringUtil.getNonEmpty(data.source)}
							onChange={(e) => {
								data.source = StringUtil.emptyToNull(e.target.value);
								onChange({...data});
							}}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>Author:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={StringUtil.getNonEmpty(data.author)}
							onChange={(e) => {
								data.author = StringUtil.emptyToNull(e.target.value);
								onChange({...data});
							}}
						/>
					</Col>
				</Row>
				<Row className="align-items-center">
					<Col md={COL_1_MD} lg={COL_1_LG}>
						<Form.Label>License:</Form.Label>
					</Col>
					<Col md={COL_2_MD} lg={COL_2_LG}>
						<Form.Control
							type="text"
							value={StringUtil.getNonEmpty(data.license)}
							onChange={(e) => {
								data.license = StringUtil.emptyToNull(e.target.value);
								onChange({...data});
							}}
						/>
					</Col>
				</Row>
			</Stack>
		</Form>
	)
}
