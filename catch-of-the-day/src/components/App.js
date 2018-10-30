import React, { Component } from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import base from '../base';
import sampleFishes from '../sample-fishes';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {},
    };
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
  }

  componentWillMount() {
    // This runs right before app is rendered
    this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`, {
      context: this,
      state: 'fishes',
    });

    // Check if order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef),
      });
    }
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(
      `order-${this.props.match.params.storeId}`,
      JSON.stringify(nextState.order)
    );
  }

  addFish(fish) {
    // update our state
    const fishes = { ...this.state.fishes };
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // set state
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes,
    });
  }

  addToOrder(key) {
    const order = { ...this.state.order };
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} params={this.props.params} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    );
  }
}
