import React, { Component } from 'react';
import { getFunName } from '../helpers';

class StorePicker extends Component {
  goToStore(event) {
    event.preventDefault();
    // 1. grab text from box
    const storeId = this.storeInput.value;
    // 2. transition from / to /:storeId
    this.props.history.push(`/store/${storeId}`);
  }

  render() {
    return (
      // Hello
      <form action="" className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <h2>Please Enter A Store</h2>
        <input
          type="text"
          required
          placeholder="Store Name"
          ref={input => (this.storeInput = input)}
          defaultValue={getFunName()}
        />
        <button type="submit">Visit Store</button>
      </form>
    );
  }
}

export default StorePicker;
