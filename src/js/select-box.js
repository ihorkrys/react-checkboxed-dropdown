import React, { Component, PropTypes } from "react";
import "../css/select-box.scss";

let keyInc = 0;

const KEY_HANDLERS = {
  "HANDLE_UP_KEY": 38,
  "HANDLE_DOWN_KEY": 40,
  "HANDLE_SPACE_KEY": 32,
  "HANDLE_ENTER_KEY": 13,
  "HANDLE_ESC_KEY": 27,
  "HANDLE_DOWNER_KEY": 74,
  "HANDLE_UPPER_KEY": 75
};

function interceptEvent(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export default class SelectBox extends Component {
  constructor(props) {
    super(props);
    this.clickingOption = false;
    this.blurTimeout = null;
    this.state = {
      key: "react-select-box-" + ++keyInc,
      open: false,
      focusedIndex: -1,
      pendingValue: []
    };
  }

  componentWillMount() {
    this.updatePendingValue(this.props.value);
  }

  componentWillReceiveProps(next) {
    this.updatePendingValue(next.value);
  }

  changeOnClose() {
    return this.isMultiple() && this.props.changeOnClose;
  }

  updatePendingValue(pendingValue, callback) {
    if (this.changeOnClose()) {
      this.setState({pendingValue}, callback);
      return true;
    }
    return false;
  }

  handleFocus() {
    clearTimeout(this.blurTimeout);
  }

  handleBlur() {
    clearTimeout(this.blurTimeout);
    this.blurTimeout = setTimeout(() => this.handleClose(), 0);
  }

  handleMouseDown() {
    this.clickingOption = true;
  }

  handleChange(value, callback) {
    return event => {
      this.clickingOption = false;
      interceptEvent(event);
      if (this.isMultiple()) {
        let selected = [];
        if (value) {
          selected = this.value().slice(0);
          const index = selected.indexOf(value);
          if (index >= 0) {
            selected.splice(index, 1);
          } else {
            selected.push(value);
          }
        }
        if (!this.updatePendingValue(selected, callback)) {
          this.props.onChange(selected);
        }
      } else {
        if (!this.updatePendingValue(value, callback)) {
          this.props.onChange(value);
        }
        this.handleClose();
        this.button.focus();
      }
    };
  }

  handleNativeChange(event) {
    let val = event.target.value;
    if (this.isMultiple()) {
      const children = [...event.target.childNodes];
      val = children.reduce((memo, child) => {
        if (child.selected) {
          memo.push(child.value);
        }
        return memo;
      }, []);
    }
    this.props.onChange(val);
  }

  handleClear(event) {
    interceptEvent(event);
    this.handleChange(null, () => {
      // only called when change="true"
      this.props.onChange(this.state.pendingValue);
    })(event);
  }

  toggleOpenClose(event) {
    interceptEvent(event);
    this.setState({open: !this.state.open}, () => this.state.open && this.menu.focus());
  }

  handleOpen(event) {
    interceptEvent(event);
    this.setState({open: true}, () => this.menu.focus());
  }

  handleClose(event) {
    interceptEvent(event);
    if (!this.clickingOption) {
      this.setState({open: false, focusedIndex: -1});
    }
    if (this.changeOnClose()) {
      this.props.onChange(this.state.pendingValue);
    }
  }

  moveFocus(move) {
    const len = React.Children.count(this.props.children);
    const focusedIndex = (this.state.focusedIndex + move + len) % len;
    this.setState({focusedIndex});
  }

  handleKey(event) {
    switch (event.which) {
      case KEY_HANDLERS.HANDLE_UP_KEY:
      case KEY_HANDLERS.HANDLE_UPPER_KEY:
        this.handleUpKey(event);
        break;
      case KEY_HANDLERS.HANDLE_DOWN_KEY:
      case KEY_HANDLERS.HANDLE_DOWNER_KEY:
        this.handleDownKey(event);
        break;
      case KEY_HANDLERS.HANDLE_ENTER_KEY:
        this.handleEnterKey(event);
        break;
      case KEY_HANDLERS.HANDLE_SPACE_KEY:
        this.handleSpaceKey(event);
        break;
      case KEY_HANDLERS.HANDLE_ESC_KEY:
        this.handleEscKey(event);
        break;
      default:
        break;
    }
  }

  handleUpKey(event) {
    interceptEvent(event);
    this.moveFocus(-1);
  }

  handleDownKey(event) {
    interceptEvent(event);
    if (!this.state.open) {
      this.handleOpen(event);
    }
    this.moveFocus(1);
  }

  handleSpaceKey(event) {
    interceptEvent(event);
    if (!this.state.open) {
      this.handleOpen(event);
    } else if (this.state.focusedIndex !== -1) {
      this.handleEnterKey();
    }
  }

  handleEnterKey(event) {
    if (this.state.focusedIndex !== -1) {
      this.handleChange(this.options()[this.state.focusedIndex].value)(event);
    }
  }

  handleEscKey(event) {
    if (this.state.open) {
      this.handleClose(event);
    } else {
      this.handleClear(event);
    }
  }

  label() {
    const selected = this.options()
      .filter(option => this.isSelected(option.value))
      .map(option => option.label);
    return selected.length > 0 ? selected.join(", ") : this.props.label;
  }

  isMultiple() {
    return this.props.multiple;
  }

  options() {
    const options = [];
    this.props.children.forEach(option => options.push({value: option.props.value, label: option.props.children}));
    return options;
  }

  value() {
    const value = this.changeOnClose() ? this.state.pendingValue : this.props.value;
    if (!this.isMultiple() || Array.isArray(value)) {
      return value;
    }
    if (value) {
      return [value];
    }
    return [];
  }

  hasValue() {
    const value = this.value();
    if (this.isMultiple()) {
      return value.length > 0;
    }
    return typeof value === "boolean" ? true : value;
  }

  isSelected(value) {
    if (this.isMultiple()) {
      return this.value().indexOf(value) !== -1;
    }
    return this.value() === value;
  }

  renderNativeSelect() {
    const key = this.state.key + "-native-select";
    const multiple = this.isMultiple();
    const empty = multiple ? null : <option key="" value="">No Selection</option>;
    const options = [empty, ...this.props.children];
    return <div className="react-select-box-native">
      <label>{this.props.label}</label>
      <select key={key} multiple={multiple}
              onKeyDown={e => e.stopPropagation()}
              value={this.props.value || (multiple ? [] : "")}
              onChange={e => this.handleNativeChange(e)}>{options}</select>
    </div>;
  }

  renderOptionMenu() {
    let className = "react-select-box-options";
    if (!this.state.open) {
      className += " react-select-box-hidden";
    }
    return <div className={className} onBlur={() => this.handleBlur()}
                onFocus={() => this.handleFocus()}
                aria-hidden={true}
                ref={ref => this.menu = ref}
                tabIndex={0}
    >
      <div className="react-select-box-off-screen">
        {this.options().map(this.renderOption, this)}
      </div>
      {this.renderCloseButton()}
    </div>;
  }

  renderOption(option, i) {
    let className = "react-select-box-option";
    if (i === this.state.focusedIndex) {
      className += " react-select-box-option-focused";
    }
    if (this.isSelected(option.value)) {
      className += " react-select-box-option-selected";
    }
    return <a href="#" onClick={event => this.handleChange(option.value)(event)}
              onMouseDown={() => this.handleMouseDown()}
              className={className}
              tabIndex={-1}
              key={option.value}
              onBlur={() => this.handleBlur()}
              onFocus={() => this.handleFocus()}
    >{option.label}</a>;
  }

  renderClearButton() {
    return this.hasValue() ?
      <button className="react-select-box-clear" onClick={e => this.handleClear(e)}>{this.props.clearText}</button> : "";
  }

  renderCloseButton() {
    return this.isMultiple() && this.props.closeText ?
      <button className="react-select-box-close" onBlur={() => this.handleBlur()}
              onClick={e => this.handleClose(e)}
              onFocus={() => this.handleFocus()}>{this.props.closeText}</button> : "";
  }

  render() {
    let className = "react-select-box-container";
    if (this.props.className) {
      className += " " + this.props.className;
    }
    if (this.isMultiple()) {
      className += " react-select-box-multi";
    }
    if (!this.hasValue()) {
      className += " react-select-box-empty";
    }
    const label = this.label();
    const title = this.props.showTitle ? label : "";
    return <div onKeyDown={e => this.handleKey(e)} className={className}>
      <button key={this.state.key} ref={ref => this.button = ref}
              className="react-select-box"
              onClick={e => this.toggleOpenClose(e)}
              onBlur={() => this.handleBlur()}
              tabIndex={0}
              aria-hidden={true}>
        <div className="react-select-box-label" title={title}>{label}</div>
      </button>
      {this.renderOptionMenu()}
      {this.renderClearButton()}
      {this.renderNativeSelect()}
    </div>;
  }
}

SelectBox.propTypes = {
  className: PropTypes.string,
  closeText: PropTypes.string,
  clearText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  changeOnClose: PropTypes.bool,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  showTitle: PropTypes.bool,
  value: PropTypes.array
};

SelectBox.defaultProps = {
  closeText: "Close",
  clearText: "Remove selection",
  label: "Select",
  multiple: false,
  changeOnClose: false,
  showTitle: false
};
