import AuthHelperMethods from "../AuthHelperMethods";
import React, { Component } from "react";
import { Form, Button, Col } from "react-bootstrap";
import Popup from "reactjs-popup";

import withAuth from "../withAuth";

const axios = require("axios");
//investor Update Form
class LawyerFinal extends Component {
  Auth = new AuthHelperMethods();
  state = {
    governorate: this.props.governorate,
    city: this.props.city,
    address: this.props.address,
    telephone: this.props.telephone,
    fax: this.props.fax,

    currency: this.props.currency,
    capital: this.props.capital,

    companyName: this.props.companyName,
    companyNameEng: this.props.companyNameEng,
    formID: this.props.formId,

    lawyerId: this.props.lawyerId
  };
  updateAll = async e => {
    e.preventDefault();
    const response = await this.Auth.fetch(
      "api/lawyer/form/" + this.state.formID,
      {
        method: "PUT",
        body: JSON.stringify({
          companyName: this.state.companyName,
          companyNameEng: this.state.companyNameEng,
          financialInfo: {
            currency: this.state.currency,
            capital: this.state.capital
          },
          headquarters: {
            city: this.state.city,
            governorate: this.state.governorate,
            address: this.state.address,
            telephone: this.state.telephone,
            fax: this.state.fax
          },
          board: this.state.board
        })
      }
    ).catch(err => {
      this.state({ responseToPost: err });
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

  // updateAll(e) {
  //   e.preventDefault();
  //   axios
  //     .put(
  //       "http://localhost:5000/api/lawyer/updateForm/" +
  //         this.state.formID +
  //         "/" +
  //         this.state.lawyerId,
  //       JSON.stringify({
  //         companyName: this.state.companyName,
  //         companyNameEng: this.state.companyNameEng,
  //         financialInfo: {
  //           currency: this.state.currency,
  //           capital: this.state.capital
  //         },
  //         headquarters: {
  //           city: this.state.city,
  //           governorate: this.state.governorate,
  //           address: this.state.address,
  //           telephone: this.state.telephone,
  //           fax: this.state.fax
  //         },
  //         board: this.state.board
  //       }),
  //       {
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       }
  //     )
  //     .then(response => {
  //       const body = response.text();

  //       this.setState({ responseToPost: body });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  render() {
    return (
      <div className="Update">
        <Form onSubmit={this.handleSubmit}>
          <Form.Row>
            <Form.Group controlId="formBasicName">
              <Form.Label> * Company Name *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.companyName}
                onChange={e => this.setState({ companyName: e.target.value })}
              />

              <Form.Label> *Company Name English *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.companyNameEng}
                onChange={e =>
                  this.setState({ companyNameEng: e.target.value })
                }
              />

              <Form.Label> *Governorate *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.governorate}
                onChange={e => this.setState({ governorate: e.target.value })}
              />

              <Form.Label> City *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.city}
                onChange={e => this.setState({ city: e.target.value })}
              />

              <Form.Label> *Address *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.address}
                onChange={e => this.setState({ address: e.target.value })}
              />

              <Form.Label> *Telephone *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.telephone}
                onChange={e => this.setState({ telephone: e.target.value })}
              />

              <Form.Label> *Fax *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.fax}
                onChange={e => this.setState({ fax: e.target.value })}
              />

              <Form.Label> *Currency *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.currency}
                onChange={e => this.setState({ currency: e.target.value })}
              />

              <Form.Label> *Capital *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.capital}
                onChange={e => this.setState({ capital: e.target.value })}
              />

              <Form.Label> *Board *</Form.Label>
              <Form.Control
                type="text"
                value={this.state.board}
                onChange={e => this.setState({ board: e.target.value })}
              />
              <p>{this.state.responseToPost}</p>

              <Button
                variant="primary"
                type="submit"
                onClick={e => {
                  this.updateAll(e);
                }}
              >
                UPDATE
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </div>
    );
  }
}
export default withAuth(LawyerFinal);
