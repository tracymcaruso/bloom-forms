import React from 'react'
import PropTypes from 'prop-types'

import ErrorTip from '../error-tip'

import '../styles/inputs.scss'
import '../styles/select-input.scss'

class SelectInput extends React.Component {
  state = {
    showList: false
  };

  selectOpt = (val) => {
    this.props.onChange(this.props.formId, this.props.name, val);
    this.setState({
      showList: false
    });
  };

  closeOpts = (e) => {
    e.persist()
    const target = e.target

    // find if it's our label or inside our label
    let thisLabel = e.relatedTarget;
    if (thisLabel && thisLabel.getAttribute) {
      while (thisLabel && thisLabel.getAttribute && !thisLabel.getAttribute('for')) {
        if (thisLabel.parentNode) {
          thisLabel = thisLabel.parentNode
        } else {
          // not even an input
          thisLabel = null;
        }
      }
    } else {
      thisLabel = null;
    }

    // if (!thisLabel || (thisLabel.getAttribute && thisLabel.getAttribute('for') && (thisLabel.getAttribute('for') !== this.props.name))) {
    //   this.setState({
    //     showList: false
    //   })
    // }

    const select = document.getElementById(this.props.name)

    if (this.props.onBlur) {
      this.props.onBlur(e, select)
    }
  }

  toggleList = (e) => {
    e.preventDefault();
    this.setState({
      showList: !this.state.showList
    });
  };

  render() {
    const { containerClass, label, name, onChange, options, showLabel, validateAs, value, error, ...rest } = this.props;
    let opts = options.map((opt, i) => {
      return opt.label
        ? (
          <option key={ `${name}-opt-${i}` } value={ opt.value }>
            { opt.label }
          </option>
        ) : (
          <option key={ `${name}-opt-${i}` } value={ opt }>{ opt }</option>
        );
    });

    let placeholderOpts = options.map((opt, i) => {
      return opt.label
        ? (
          <li key={ `${ name }-opt-${i}` } onClick={ (e) => this.selectOpt(opt.value) }>
            <button>
              { opt.label }
            </button>
          </li>
        ) : (
          <li key={ `${ name }-opt-${i}` } onClick={ (e) => this.selectOpt(opt) }>
            <button>
              { opt }
            </button>
          </li>
        );
    })

    let attr = {};

    if (rest.required) {
      attr['required'] = true;
      attr['aria-required'] = true;
    }

    let translateVal = options[0] && !!options[0].label;
    let activeOptLabel;
    if (translateVal && value) {
      activeOptLabel = options.filter((opt) => opt.value.toString() === value.toString())[0];
      activeOptLabel = activeOptLabel ? activeOptLabel.label : 'Select';
    }

    return (
      <label className={ `input__label select-input ${ containerClass || '' }` } htmlFor={ name } onBlur={ this.closeOpts }>
        <span className={ `input__label__text ${ !showLabel ? 'u-sr-only' : '' }` }>
          { label }{ attr.required && <span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span> }
        </span>
        <button disabled={!options.length} className={ `${!options.length ? 'btn disabled' : 'btn'} input__placeholder non-sr-only ${ this.state.showList ? 'is-open' : '' }` }
          onClick={ this.toggleList }>
          { this.props.placeholder && !value
            ? <span className='u-grayed-out'>{ this.props.placeholder }</span>
            :  (translateVal ? activeOptLabel : (value || 'Select'))
          }
        </button>
        { error && <ErrorTip contents={ error } className='tooltip--error--select' /> }
        { this.state.showList &&
          <ul className='select-input__opts non-sr-only'>
            { placeholderOpts }
          </ul>
        }
        <select value={ value } name={ name } id={ name } className='u-sr-only' { ...attr } data-validate={ validateAs }
          onChange={ (e) => this.selectOpt(e.target.value) }>
          { opts }
        </select>
      </label>
    )
  }
}

SelectInput.propTypes = {
  containerClass: PropTypes.string,
  formId: PropTypes.string.isRequired,
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType(PropTypes.string, PropTypes.number)
      }),
      PropTypes.string
    ).isRequired
  ).isRequired,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  validateAs: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
}

SelectInput.defaultProps = {
  value: ''
}

export default SelectInput;