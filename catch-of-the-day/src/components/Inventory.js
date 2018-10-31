import React, { Component } from 'react';
import AddFishForm from './AddFishForm';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import base from '../base';

const providers = {
  github: firebase.auth.GithubAuthProvider,
  twitter: firebase.auth.TwitterAuthProvider,
};

export default class Inventory extends Component {
  constructor() {
    super();
    this.state = {
      uid: null,
      owner: null,
    };
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user, error) => {
      if (user) {
        console.log(user);
        this.authHandler(user);
      }
    });
  }

  authenticate(provider) {
    const p = new providers[provider]();
    firebase
      .auth()
      .signInWithPopup(p)
      .then(result => this.authHandler(result.user));
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ uid: null });
  }

  authHandler(authData) {
    const { storeId } = this.props;
    console.log(authData);
    // Query the firebase for this store data
    base.fetch(storeId, {
      context: this,
      then(data) {
        // If no owner claim as own
        if (!data.owner) {
          base.update(storeId, {
            data: { owner: authData.uid },
          });
        }

        // Set current user and owner state
        this.setState({
          uid: authData.uid,
          owner: data.owner || authData.uid,
        });
      },
    });
  }

  handleChange(event, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [event.target.name]: event.target.value,
    };
    this.props.updateFish(key, updatedFish);
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Login</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>
          Log in with Github
        </button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>
          Log in with Twitter
        </button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input
          type="text"
          name="name"
          value={fish.name}
          placeholder="Fish Name"
          onChange={e => this.handleChange(e, key)}
        />
        <input
          type="text"
          name="price"
          value={fish.price}
          placeholder="Fish Price"
          onChange={e => this.handleChange(e, key)}
        />
        <select
          type="text"
          name="status"
          value={fish.status}
          placeholder="Fish Status"
          onChange={e => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea
          type="text"
          name="desc"
          value={fish.desc}
          placeholder="Fish Desc"
          onChange={e => this.handleChange(e, key)}
        />
        <input
          type="text"
          name="image"
          value={fish.image}
          placeholder="Fish Image"
          onChange={e => this.handleChange(e, key)}
        />
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    );
  }
  render() {
    const logout = <button onClick={this.logout}>Log Out</button>;

    // Check if not logged in
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>;
    }

    // Check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store!</p>
          {logout}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  addFish: PropTypes.func.isRequired,
  updateFish: PropTypes.func.isRequired,
  removeFish: PropTypes.func.isRequired,
  loadSamples: PropTypes.func.isRequired,
  fishes: PropTypes.object.isRequired,
  storeId: PropTypes.string.isRequired,
};
