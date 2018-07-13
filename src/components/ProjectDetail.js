import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Header, Icon, Table, Button } from 'semantic-ui-react';

<<<<<<< HEAD
const membersDetail = memberDetail => (
  <Table.Row>
=======
const membersDetail = (memberDetail, projectId, onDeleteClick) => (
  <Table.Row key={memberDetail.userId}>
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
    <Table.Cell>{memberDetail.userId || '-'}</Table.Cell>
    <Table.Cell>{memberDetail.firstName || '-'}{' '}{memberDetail.lastName || '-'}</Table.Cell>
    <Table.Cell>{memberDetail.name || '-'}</Table.Cell>
    <Table.Cell>{memberDetail.role || '-'}</Table.Cell>
    <Table.Cell>
<<<<<<< HEAD
      <Button animated="fade" style={{ borderStyle: 'solid', borderColor: '#FF0000', backgroundColor: 'white', borderWidth: '1px' }} >
=======
      <Button animated="fade" style={{ borderStyle: 'solid', borderColor: '#FF0000', backgroundColor: 'white', borderWidth: '1px' }} onClick={() => onDeleteClick(memberDetail.userId, projectId)}>
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
        <Button.Content visible><font color="#FF0000" >Delete</font></Button.Content>
        <Button.Content hidden > <Icon color="red" name="user delete" /> </Button.Content>
      </Button>
    </Table.Cell>
  </Table.Row>
);

<<<<<<< HEAD
const ProjectDetail = ({ projectDetail, onEditClick, onAddMemberClick }) => (
=======
const ProjectDetail = ({ projectDetail, onEditClick, onAddMemberClick, onDeleteMemberClick }) => (
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
  <Segment.Group raised size="large" >
    <Segment>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width="5">
            <Header as="h2">
              <Icon name="file alternate" />
              <Header.Content>
                Project Detail
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column floated="right" >
            <Icon link name="edit" size="large" onClick={onEditClick} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment>
<<<<<<< HEAD
      <Grid Columns={2} padded>
=======
      <Grid columns={2} padded>
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} mobile={16} tablet={4}><font size="4"><b>Project No. :</b></font></Grid.Column>
        <Grid.Column computer={11} mobile={16} tablet={11}>{projectDetail.id || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} mobile={16} tablet={4} ><font size="4"><b>Project Name :</b></font></Grid.Column>
        <Grid.Column computer={11} mobile={16} tablet={11} >{projectDetail.name || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
<<<<<<< HEAD
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Quotation Number :</b></font></Grid.Column>
=======
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Quotation No. :</b></font></Grid.Column>
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.quotationId || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Customer :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.customer || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Purchased Order :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.purchasedOrder || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
<<<<<<< HEAD
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Quotation No. :</b></font></Grid.Column>
=======
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Amount :</b></font></Grid.Column>
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.amount || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Form :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.startDate || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>To :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.endDate || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Description :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.description || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>Status :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>{projectDetail.status || '-'}</Grid.Column>
        <Grid.Column width={1} only="large screen" />
        <Grid.Column computer={4} tablet={4} mobile={16} ><font size="4"><b>File :</b></font></Grid.Column>
        <Grid.Column computer={11} tablet={11} mobile={16}>Requirment</Grid.Column>
      </Grid>
    </Segment>
    <Segment>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width="5">
            <Header as="h2">
              <Icon name="users" />
              <Header.Content>
                Project Members
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column floated="right" >
            <Icon link name="add user" size="large" onClick={onAddMemberClick} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Segment>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Emp.No.</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Position</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
<<<<<<< HEAD
          {projectDetail.members.map(memberDetail => membersDetail(memberDetail))}
=======
          {projectDetail.members.map(memberDetail => membersDetail(memberDetail, projectDetail.id, onDeleteMemberClick))}
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
        </Table.Body>
      </Table>
    </Segment>
  </Segment.Group>
);

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  onEditClick: PropTypes.func.isRequired,
<<<<<<< HEAD
  onAddMemberClick: PropTypes.func.isRequired
=======
  onAddMemberClick: PropTypes.func.isRequired,
  onDeleteMemberClick: PropTypes.func.isRequired
>>>>>>> 2ef84c28b7d073fae1de484c4f2e765e8e8276f6
};

export default ProjectDetail;
