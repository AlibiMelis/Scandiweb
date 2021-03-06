import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  decrementItemCount,
  incrementItemCount,
  setItemAttribute,
  removeFromCart,
  showToast,
} from "../../redux/actions";
import { calculateProductsTotal } from "../../utils/price";
import MinicartItem from "./MinicartItem";
import { ReactComponent as CartIcon } from "../../assets/cart.svg";
import "./Minicart.css";

const mapStateToProps = (state) => ({
  items: state.cart.items,
  currency: state.currency.value,
});
const mapDispatchToProps = {
  incrementItemCount,
  decrementItemCount,
  setItemAttribute,
  removeFromCart,
  showToast,
};

class Minicart extends Component {
  constructor(props) {
    super(props);
    this.minicartRef = createRef();
    this.buttonRef = createRef();
    this.state = { open: false };
  }

  onOutsideClick = (event) => {
    if (!this.minicartRef.current?.contains(event.target) && !this.buttonRef.current?.contains(event.target)) {
      this.close();
    }
  };
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onOutsideClick);
  }

  onMinicartClick = () => {
    if (!this.state.open) {
      this.open();
    } else {
      this.close();
    }
  };

  open = () => {
    document.addEventListener("mousedown", this.onOutsideClick);
    this.setState({ open: true });
  };

  close = () => {
    document.removeEventListener("mousedown", this.onOutsideClick);
    this.setState({ open: false });
  };
  removeItemFromCart = (itemId) => {
    this.props.removeFromCart(itemId);
    this.props.showToast("Item is removed from your cart", "success");
  };

  render() {
    const { items, currency, incrementItemCount, decrementItemCount, setItemAttribute } = this.props;
    const { open } = this.state;
    const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = calculateProductsTotal(items, currency).toFixed(2);

    return (
      <div className="minicart-container">
        <div className="minicart-icon" onClick={this.onMinicartClick} cart-counter={totalQty} ref={this.buttonRef}>
          <CartIcon />
        </div>
        {open && (
          <div className="minicart-bg">
            <div className="minicart" ref={this.minicartRef}>
              <div>
                <span className="bold">My bag,</span> {` ${items.length} items.`}
              </div>

              <div className="items">
                {this.props.items.map((item) => (
                  <MinicartItem
                    item={item}
                    currency={currency}
                    onInc={() => incrementItemCount(item.id)}
                    onDec={() => decrementItemCount(item.id)}
                    onSetAttr={(attr) => setItemAttribute(item.id, attr)}
                    onRemove={() => this.removeItemFromCart(item.id)}
                    key={item.id}
                  />
                ))}
              </div>

              <div className="total">
                <div>Total:</div>
                <div>
                  {currency}
                  {totalPrice}
                </div>
              </div>

              <div className="minicart-buttons">
                <Link to="/shop/cart" className="link btn btn-secondary" onClick={this.close}>
                  View bag
                </Link>
                <Link to="#" className="link btn btn-primary" onClick={this.close}>
                  Check out
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Minicart);
