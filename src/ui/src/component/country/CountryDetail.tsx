import {Col, Form, Row, Spinner, Stack} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton, Switch} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {Country} from "../../types/Country";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function CountryDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<Country>();
	const [changed, setChanged] = useState<boolean>(false);

	const onChanged = useCallback(
		() => {
			if (!data) return;
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const reload = useCallback(
		() => {
			setData(undefined);
			if (!id) {
				setData({
					name: '',
					createOverview: false
				});
				return;
			}
			restClient
				.countries
				.loadSingle(Number(id))
				.then(
					(b) => {
						setData({...b});
						setChanged(false);
					}
				)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.id);
			restClient
				.countries
				.save(data)
				.then(
					(b) => {
						if (inserting) {
							navigate(`/countries/detail/${b.id}`, {replace: true});
						} else {
							setData({...b});
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteCountry = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this country?',
				() => restClient
					.countries
					.delete(Number(data.id))
					.then(
						(f) => {
							navigate(-1);
						})
					.catch((e: Error) => userAlerts.err(e))
			);
		},
		[restClient, data, userAlerts, navigate, confirmDialog]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="d-flex justify-content-between p-2 gap-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton disabled={!changed} onClick={saveData}>Save</SaveButton>
					{
						data.id && <DeleteButton onClick={deleteCountry}>Delete</DeleteButton>
					}
				</Stack>
			</div>
			<Form className="p-3">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Form.Control
								type="text"
								value={data.name}
								onChange={
									(e) => {
										data.name = e.target.value;
										onChanged();
									}
								}
							/>
						</Col>
					</Row>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label htmlFor="createOverview">Create Overview:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<Switch
								id="createOverview"
								checked={data.createOverview}
								onChange={(e) => {
									data.createOverview = e;
									onChanged();
								}}
								label="Create country media overview"
							/>
						</Col>
					</Row>
				</Stack>
			</Form>
		</div>
	)
}
