import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import { Nav } from 'react-bootstrap';


export class NavigationBar extends Component {
  render() {
    return (
        <React.Fragment>
            <Navbar bg="primary" variant="dark">
                    <Navbar.Brand className='m-1'>
                        Secure and Sovereign Files
                </Navbar.Brand>
                <Nav className="me-auto"></Nav>
                <Nav className="justify-content-center" activeKey="/files">
                    <Nav.Item>
                    <Nav.Link href="/files">Files</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link href="/shared">Shared with you</Nav.Link>
                    </Nav.Item>
                </Nav>
          <Nav className="me-auto"></Nav>
              <Button onClick={this.props.onConnectButtonClick} className='m-1' variant='light'>Connect</Button>
            </Navbar>
      </React.Fragment>
    )
  }
}

export default NavigationBar